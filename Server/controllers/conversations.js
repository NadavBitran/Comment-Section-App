// @BRIEF: Contains all the functions designed to deal with comment-related actions, mainly CRUD
// @ROUTE: /api/conversation/*

const { Conversation } = require('../models/conversations');
const { User } = require('../models/users');

const {
  PAGE_DEFAULT,
  OFFSET_DEFAULT,
  LIMIT_DEFAULT,
  SEARCH_DEFAULT,
  SORT_DEFAULT
} = require('../constants/controllers/queryConstants');
const {
  ERR_REQ_USER_NOT_EXIST,
  ERR_REQ_COMMENT_NOT_EXIST,
  ERR_REQ_WENT_WRONG,
  SUCC_REQ
} = require('../constants/controllers/messageConstants');
const {
  IO_POST_DELETE,
  IO_POST_UPDATE,
  IO_POST_ADD
} = require('../constants/controllers/ioConstants');

const { REACTION_TYPE } = require('../constants/controllers/otherConstants');
const HTTP_STATUS_CODES = require('../constants/controllers/httpstatusConstants');
const { APP_VARIABLES } = require('../constants/globalConstants');

// @BRIEF: Dealing with requests to receive AT LEAST one comment and at MOST $limit comments,
// which meet certain conditions according to the parameters
// @ROUTE: /api/conversation/
// @METHOD: GET
// @PARAMS:
//   - Page - the page of the desired comments (PAGINATION parameter)
//   - Limit - the amount of the desired comments (PAGINATION parameter)
//   - Offset - the error of the user in the comments window that the Page and Limit parameters are supposed to return (DYNAMIC CHAT parameter)
//   - Search - the text that should be contained in the desired comments (FILTER parameter)
//   - UserId - the id of the user who wrote the desired comments (FILTER parameter)
//   - Sort - the order in which the desired comments should be returned (SORT parameter)
// @BODY: NONE
// @RETURN:
//   ON SUCCESS (200)
//   - List - The list of all the comments that meet the parameters that arrived in the REQUEST
//   - Listlength - The length of all the comments available that meet the parameter that arrived in the REQUEST
//   ON FAILURE (404)
//   - Error message indicating that the id of the user (UserId) doesn't exist
//   ON FAILURE (500)
//   - Error message indicating that something went wrong while dealing with the REQUEST
const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || PAGE_DEFAULT;
    const offset = parseInt(req.query.offset) || OFFSET_DEFAULT;
    const limit = parseInt(req.query.limit) || LIMIT_DEFAULT;
    const search = req.query.search || SEARCH_DEFAULT;
    let sort = req.query.sort || SORT_DEFAULT;
    const userId = req.query.userId;

    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'desc';
    }

    let query = { content: { $regex: search, $options: 'i' } };
    if (userId) {
      const existingUser = await User.findOne({ _id: userId });

      if (!existingUser) return res.status(404).json({ message: ERR_REQ_USER_NOT_EXIST });

      query = { 'user.email': existingUser.email, content: { $regex: search, $options: 'i' } };
    }

    const totalCommentsPromise = Conversation.countDocuments(query);
    const commentListPromise = Conversation.find(query)
      .lean()
      .skip(((page - 1) * limit) + offset)
      .limit(limit)
      .sort(sortBy);

    const [totalComments, commentList] = await Promise.all([totalCommentsPromise, commentListPromise]);

    res.status(HTTP_STATUS_CODES.OK).json({ list: commentList, listLength: totalComments });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
  }
};

// @BRIEF: Dealing with requests to receive ONLY one comment,
// which meet certain conditions according to the parameters
// @ROUTE: /api/conversation/:key
// @METHOD: GET
// @PARAMS:
//   - Key: the key of the desired comment (FILTER parameter)
// @BODY: NONE
// @RETURN:
//   ON SUCCESS (200)
//   - Comment - the desired comment with the specific Key parameter
//   ON FAILURE (404)
//   - Error message indicating the desired comment with the specific Key parameter doesn't exist
//   ON FAILURE (500)
//   - Error message indicating that something went wrong while dealing with the REQUEST
const getComment = async (req, res) => {
  try {
    const comment = await Conversation.findById(req.params.key);

    if (comment) {
      return res.status(HTTP_STATUS_CODES.OK).json(comment);
    }

    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: ERR_REQ_COMMENT_NOT_EXIST });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
  }
};

// @BRIEF: Dealing with request to delete ONLY one comment,
// which meet certain conditions according to the parameters
// @ROUTE: /api/conversation/:key
// @METHOD: DELETE
// @PARAMS:
//   - Key: the key of the desired comment (FILTER parameter)
// @BODY: NONE
// @RETURN:
//   ON SUCCESS (200)
//   - Message - message indicating the deletion process was successful
//   - Socket Emit - sending all ONLINE clients via WEBSOCKET the Key of deleted comment
//   ON FAILURE (500)
//   - Error message indicating that something went wrong while dealing with the REQUEST
const deleteComment = async (req, res) => {
  try {
    await Conversation.findOneAndDelete({ key: req.params.key });

    const io = req.app.get(APP_VARIABLES.SOCKET_IO);
    io.emit(IO_POST_DELETE, req.params.key);

    res.status(HTTP_STATUS_CODES.OK).json({ message: SUCC_REQ });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
  }
};

// @BRIEF: Dealing with request to update ONLY one comment (but not comment's LIKES count),
// which meet certain conditions according to the parameters
// @ROUTE: /api/conversation/:key
// @METHOD: PUT
// @PARAMS:
//   - Key: the key of the desired comment (FILTER parameter)
// @BODY:
//   - Type: the key in the comment that needs to be changed (CONTENT parameter)
//   - Content: the value in the comment that has to replace the existing one (CONTENT parameter)
// @RETURN:
//   ON SUCCESS (200)
//   - Message - message indicating the update process was successful
//   - Socket Emit - sending all ONLINE clients via WEBSOCKET the Key of updated comment with its updated content
//   ON FAILURE (500)
//   - Error message indicating that something went wrong while dealing with the REQUEST
const updateComment = async (req, res) => {
  const setter = { [req.body.type]: req.body.content };
  try {
    await Conversation.findOneAndUpdate({ key: req.params.key }, setter);

    const io = req.app.get(APP_VARIABLES.SOCKET_IO);
    io.emit(IO_POST_UPDATE, req.params.key, setter);

    res.status(HTTP_STATUS_CODES.OK).json({ message: SUCC_REQ });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
  }
};

// @BRIEF: Dealing with request to add ONLY one comment,
// which passed in the BODY REQUEST
// @ROUTE: /api/conversation/
// @METHOD: POST
// @PARAMS: NONE
// @BODY:
//   - The whole new comment object
// @RETURN:
//   ON SUCCESS (200)
//   - Message - message indicating the post process was successful
//   - Socket Emit - sending all ONLINE clients via WEBSOCKET the newly added comment
//   ON FAILURE (500)
//   - Error message indicating that something went wrong while dealing with the REQUEST
const addComment = async (req, res) => {
  try {
    let newComment = req.body;

    await Conversation.create(newComment);

    const io = req.app.get(APP_VARIABLES.SOCKET_IO);
    io.emit(IO_POST_ADD, newComment);

    res.status(HTTP_STATUS_CODES.OK).json({ message: SUCC_REQ });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
  }
};

// @BRIEF: Dealing with request to update ONLY one comment's LIKES count,
// which meet certain conditions according to the parameters
// @ROUTE: /api/conversation/like/:key
// @METHOD: PUT
// @PARAMS:
//   - Key: the key of the desired comment (FILTER parameter)
// @AUTH PARAMS:
//   - The userId of the user who created this REQUEST
// @BODY:
//   - The LIKES operation (increase, decrease)
// @RETURN:
//   ON SUCCESS (200)
//   - UpdatedComment - the new comment after the update of the LIKES count
//   ON FAILURE (500)
//   - Error message indicating that something went wrong while dealing with the REQUEST
const updateCommentLikes = async (req, res) => {
  try {
    const { operationType } = req.body;

    let existingComment = await Conversation.findOne({ key: req.params.key });

    const isLiked = existingComment.likes.includes(req.userId);
    const isDisliked = existingComment.dislikes.includes(req.userId);

    switch (operationType) {
      case REACTION_TYPE.LIKE:
        if (isDisliked) {
          existingComment.dislikes = existingComment.dislikes.filter(id => id !== req.userId);
        } else {
          existingComment.likes.push(req.userId);
        }
        break;
      case REACTION_TYPE.DISLIKE:
        if (isLiked) {
          existingComment.likes = existingComment.likes.filter(id => id !== req.userId);
        } else {
          existingComment.dislikes.push(req.userId);
        }
        break;
    }

    const updatedComment = await Conversation.findOneAndUpdate(
      { key: req.params.key },
      {
        score: existingComment.likes.length - existingComment.dislikes.length,
        likes: existingComment.likes,
        dislikes: existingComment.dislikes
      },
      { new: true }
    );

    res.status(HTTP_STATUS_CODES.OK).json(updatedComment);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
  }
};

module.exports = {
  getComments,
  getComment,
  deleteComment,
  updateComment,
  updateCommentLikes,
  addComment
};
