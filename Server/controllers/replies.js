// @BREIF: Contains all the functions designed to deal with replies related actions, mainly CRUD 
// @ROUTE: /api/reply/* 

const {Conversation} = require("../models/conversations")
const {User} = require("../models/users")

const {
    PAGE_DEFAULT,
    LIMIT_DEFAULT,
    SEARCH_DEFAULT,
    SORT_DEFAULT
  } = require('../constants/controllers/queryConstants');
  const {
    ERR_REQ_USER_NOT_EXIST,
    ERR_REQ_WENT_WRONG,
    SUCC_REQ
  } = require('../constants/controllers/messageConstants');
  const {
    IO_REPLY_DELETE,
    IO_REPLY_UPDATE,
    IO_REPLY_ADD
  } = require('../constants/controllers/ioConstants');
  
  const { REACTION_TYPE } = require('../constants/controllers/otherConstants');
  const HTTP_STATUS_CODES = require('../constants/controllers/httpstatusConstants');
  const { APP_VARIABLES } = require('../constants/globalConstants');

// @BREIF: Dealing with requests to receive AT LEAST one reply and at MOST $limit replies, which meet certain conditions according to the parameters
// @ROUTE: /api/reply/
// @METHOD: GET
// @PARAMS: 
//          - Page - the page of the desired replies (PAGINATION parameter)
//          - Limit - the amount of the desired replies (PAGINATION parameter)
//          - Search - the text that should be contained in the desired replies (FILTER parameter)
//          - UserId - the id of the user who wrote the desired replies (FILTER parameter)
//          - Sort - the order in which the desired replies should be returned (SORT parameter)
// @BODY: NONE
// @RETURN:
//          ON SUCCESS (200)
//          - List - The list of all the replies that meet the parameters that arrived in the REQUEST
//          - Listlength - The length of all the replies avaliable that meet the parameter that arrived in the REQUEST
//          ON FAILURE (404)
//          - Error message indicating that the id of the user (UserId) doesn't exist
//          ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST
const getReplies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || PAGE_DEFAULT;
        const limit = parseInt(req.query.limit) || LIMIT_DEFAULT;
        const userId = req.query.userId;
        const search = req.query.search || SEARCH_DEFAULT;
        let sort = req.query.sort || SORT_DEFAULT;

        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort])
        let sortBy = {}
        if(sort[1]){
            sortBy[`replies.${sort[0]}`] = (sort[1] === 'asc') ? 1 : -1
        }
        else{
            sortBy[`replies.${sort[0]}`] = -1
        }

        let result;

        if (userId) {
            const existingUser = await User.findOne({ _id: userId });

            if (!existingUser) return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: ERR_REQ_USER_NOT_EXIST });

            result = await Conversation.aggregate([
                { $unwind: '$replies' },
                { $match: { 'replies.user.email': existingUser.email ,
                            'replies.content' : {$regex : search , $options : 'i'}} },
                {
                    $facet: {
                        paginatedReplies: [
                            {
                                $sort : sortBy
                            },
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $group: {
                                    _id: 0,
                                    replies: { $push: '$replies' },
                                },
                            },
                        ],
                        totalReplies: [
                            { $count: 'count' },
                        ],
                    },
                },
            ]);
        } else {
            result = await Conversation.aggregate([
                { $unwind: '$replies' },
                { $match : {'replies.content' : {$regex : search , $options : 'i'}}} ,
                {
                    $facet: {
                        paginatedReplies: [
                            {
                                $sort : sortBy
                            },
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $group: {
                                    _id: 0,
                                    replies: { $push: '$replies' },
                                },
                            },
                        ],
                        totalReplies: [
                            { $count: 'count' },
                        ],
                    },
                },
            ]);
        }

        console.log(result)

        let paginatedReplies = []
        let totalReplies = 0

        if(result.length !== 0 && result[0].totalReplies.length !== 0 && result[0].paginatedReplies.length !== 0){
            paginatedReplies = result[0].paginatedReplies[0].replies;
            totalReplies = result[0].totalReplies[0].count;
        }


        res.status(HTTP_STATUS_CODES.OK).json({ list: paginatedReplies, listLength: totalReplies });
    } catch (error) {
        console.log(error.message)
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
    }
};

// @BREIF: Dealing with request to add ONLY one reply , which passed in the BODY REQUEST
// @ROUTE: /api/reply/
// @METHOD: POST
// @PARAMS: 
//         - Key - the comment key which the reply is inside of (FILTER parameter)
// @BODY:
//         - The whole new reply object
// @RETURN:
//         ON SUCCESS (200)
//         - Message - message indicating the post proccess was successful
//          - Socket Emit - sending all ONLINE clients via WEBSOCKET the newly added reply and its comment's key
//         ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST
const addReply = async (req , res) => {
    try{
        let newReply = req.body;

        
        await Conversation.findOneAndUpdate({key : req.params.key} , {$push : {replies : newReply}})

        const io = req.app.get(APP_VARIABLES.SOCKET_IO)
        io.emit(IO_REPLY_ADD , req.params.key , newReply)

        res.status(HTTP_STATUS_CODES.OK).json({message : SUCC_REQ})
    }
    catch(error){
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : ERR_REQ_WENT_WRONG})
    }
}

// @BREIF: Dealing with request to update ONLY one reply (but not reply's LIKES count) , which meet certain conditions according to the parameters
// @ROUTE: /api/reply/:key
// @METHOD: PUT
// @PARAMS:
//         - Key - the comment key which the reply is inside of (FILTER parameter)
// @BODY: 
//          - Type - the key in the reply that needs to be changed (CONTENT parameter)
//          - Content -  the value in the reply that has to replace the existing one (CONTENT parameter)
//          - ReplyId - the id of the reply that needs to be changed (FILTER parameter)
// @RETURN:
//          ON SUCCESS (200)
//          - Message - message indicating the update proccess was successful
//          - Socket Emit - sending all ONLINE clients via WEBSOCKET the Key of updated reply with it's updated content AND the comment's key which the reply is inside of 
//          ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST
const updateReply = async (req , res) => {
    let setterServer = {
        [`replies.$.${req.body.type}`] : req.body.content 
    }
    let setterClient = {
        [req.body.type] : req.body.content
    }
    try{


        
        await Conversation.findOneAndUpdate(
            {key : req.params.key  , 'replies.key' : req.body.replyId} ,
            {$set :  setterServer})

            const io = req.app.get(APP_VARIABLES.SOCKET_IO)
            io.emit(IO_REPLY_UPDATE , req.params.key , req.body.replyId , setterClient)
        
            res.status(HTTP_STATUS_CODES.OK).json({message : SUCC_REQ})
    }
    catch(error){
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : ERR_REQ_WENT_WRONG})
    }
}

// @BREIF: Dealing with request to delete ONLY one reply , which meet certain conditions according to the parameters
// @ROUTE: /api/reply/:key
// @METHOD: DELETE
// @PARAMS:
//         - Key - the comment key which the reply is inside of (FILTER parameter)
// @BODY: 
//          - ReplyId - the id of the reply that needs to be changed (FILTER parameter)
// @RETURN:
//          ON SUCCESS (200)
//          - Message - message indicating the deletion proccess was successful
//          - Socket Emit - sending all ONLINE clients via WEBSOCKET the Key of deleted reply AND the comment's key which the reply is inside of 
//          ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST
const deleteReply = async (req , res) => {
    try{



        await Conversation.findOneAndUpdate(
            {key : req.params.key} ,
            {$pull : {'replies' : {key : req.body.replyId }}})

            const io = req.app.get(APP_VARIABLES.SOCKET_IO)
            io.emit(IO_REPLY_DELETE , req.params.key , req.body.replyId)

            res.status(HTTP_STATUS_CODES.OK).json({message : SUCC_REQ})
    }
    catch(error){
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : ERR_REQ_WENT_WRONG})
    }
}

// @BREIF: Dealing with request to update ONLY one reply's LIKES count , which meet certain conditions according to the parameters
// @ROUTE: /api/reply/like/:key
// @METHOD: PUT
// @PARAMS: 
//         - Key - the comment key which the reply is inside of (FILTER parameter)
// @AUTH PARAMS:
//          - The userId of the user who created this REQUEST
// @BODY:
//          - OperationType - the LIKES operation (increase, decrease) 
//          - replyId - the id of the reply that needs to be changed (FILTER parameter)
// @RETURN:
//          ON SUCCESS (200)
//          - UpdatedReply - the new reply after the update of the LIKES count
//          ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST    
const updateReplyLikes = async (req , res) => {
    try{
        const {operationType} = req.body

        let existingComment = await Conversation.findOne({key : req.params.key})

        let existingReply = existingComment.replies.find((reply) => reply.key === req.body.replyId)

        let isLiked = existingReply.likes.includes(req.userId)
        let isDisliked = existingReply.dislikes.includes(req.userId)

        switch(operationType){
            case REACTION_TYPE.LIKE:
                if(isDisliked){
                    existingReply.dislikes = existingReply.dislikes.filter(id => id!==req.userId)
                }
                else{
                    existingReply.likes.push(req.userId)
                }
                break;
            case REACTION_TYPE.DISLIKE:
                if(isLiked){
                    existingReply.likes = existingReply.likes.filter(id=> id!==req.userId)
                }
                else{
                    existingReply.dislikes.push(req.userId)
                }
                break;
        
        }

        existingReply.score = existingReply.likes.length - existingReply.dislikes.length

        await Conversation.findOneAndUpdate(
            {key : req.params.key , 'replies.key' : req.body.replyId } ,
            {$set : {
                'replies.$.dislikes' : existingReply.dislikes ,
                'replies.$.likes' : existingReply.likes ,
                'replies.$.score' : existingReply.likes.length - existingReply.dislikes.length
            } } , 
            {new : true}
        )


        res.status(HTTP_STATUS_CODES.OK).json(existingReply)
    }
    catch(error){
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : ERR_REQ_WENT_WRONG})
    }
}


module.exports = {
    getReplies: getReplies ,
    addReply: addReply ,
    updateReply , updateReply ,
    deleteReply: deleteReply ,
    updateReplyLikes: updateReplyLikes
}