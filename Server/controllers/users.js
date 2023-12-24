// @BREIF: Contains all the functions designed to deal with users related actions 
// @ROUTE: /api/user/*


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const {User} = require("../models/users");
const { Conversation } = require('../models/conversations');
const conversations = require('./conversations');


const HTTP_STATUS_CODES = require("../constants/controllers/httpstatusConstants")
const {REQ_SUCC , ERR_REQ_WENT_WRONG , ERR_REQ_INV_CRED , ERR_REQ_USER_NOT_EXIST , ERR_REQ_USER_ALR_EXIST , ERR_REQ_USERNAME_ALR_EXIST} = require("../constants/controllers/messageConstants")
const {ACCESS_TOKEN_LENGTH , REFRESH_TOKEN_LENGTH , REFRESH_TOKEN_MAX_AGE , REFRESH_TOKEN_JWT_COOKIE_NAME , REFRESH_TOKEN_EXPIRED_AGE} = require("../constants/tokens/tokenConstants")
const {BCRYPT_HASH_LENGTH} = require("../constants/controllers/otherConstants")

// @BREIF: Dealing with request to login with existing user into the APP
// @ROUTE: /api/user/signin
// @METHOD: POST
// @PARAMS: NONE
// @BODY:
//        - email - the Email the client typed
//        - password - the Password the client typed
// @RETURN:
//        ON SUCCESS (200)
//        - ExistingUser - the user details of the matching credentials the user typed, with encrypted password
//        - AccessToken - the user's new accessToken
//        - RefreshToken - the user's new refreshToken inside an HTTP-Only Cookie
//        ON FAILURE (404)
//        - Message - indicating the user doesn't exist (no user with such email avaliable)
//        ON FAILURE (400)
//        - Message - indicating the credentials are invalid (the password doesn't match)
//        ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST
const signin = async(req , res) => {
    const { email , password } = req.body;

    try{
        const existingUser = await User.findOne({email : email})

        if(!existingUser) return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message: ERR_REQ_USER_NOT_EXIST})

        const isPasswordCorrect = await bcrypt.compare(password , existingUser.password)

        if(!isPasswordCorrect) return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message: ERR_REQ_INV_CRED})

        const accessToken = jwt.sign({ email: existingUser.email, id : existingUser._id , key : existingUser.key , usertype : existingUser.usertype} , process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_LENGTH })

        const refreshToken = jwt.sign({ email: existingUser.email, id : existingUser._id , key : existingUser.key , usertype : existingUser.usertype} , process.env.JWT_SECRET , { expiresIn: REFRESH_TOKEN_LENGTH } )

        res.cookie(REFRESH_TOKEN_JWT_COOKIE_NAME , refreshToken , {
            httpOnly : true , 
            sameSite : 'None' ,
            secure : true ,
            maxAge : REFRESH_TOKEN_MAX_AGE
        })
        return res.status(HTTP_STATUS_CODES.OK).json({result : existingUser , accessToken : accessToken})
    }
    catch(error){
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : ERR_REQ_WENT_WRONG})
    }
}

// @BREIF: Dealing with request to signout the user from the APP
// @ROUTE: /api/user/signout
// @METHOD: GET
// @PARAMS: NONE
// @BODY: NONE
// @RETURN:
//        ON SUCCESS (200)
//        - RefreshToken - removing user's refreshToken from the HTTP-Only Cookie
const signout = async(req , res) => {
    res.cookie(REFRESH_TOKEN_JWT_COOKIE_NAME , 'none' , {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge : REFRESH_TOKEN_EXPIRED_AGE
    })
    return res.status(HTTP_STATUS_CODES.OK).json({message : REQ_SUCC})
}


// @BREIF: Dealing with request to signup with existing user into the APP
// @ROUTE: /api/user/signup
// @METHOD: POST
// @PARAMS: NONE
// @BODY:
//        - Form details: key , email , password , fullname , username , image...
// @RETURN:
//        ON SUCCESS (200)
//        - newUser - the user details of the newly user created, with encrypted password
//        - AccessToken - the user's new accessToken
//        - RefreshToken - the user's new refreshToken inside an HTTP-Only Cookie
//        ON FAILURE (400)
//        - Message - indicating the user with requested email already exist
//        - Message - indicating the user with requested username already exist
//        ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST
const signup = async(req , res) => {
    const { usertype , key , email , password  , firstname , lastname , username , image} = req.body;

    try{
        const existingUser = await User.findOne({email : email})

        if(existingUser) return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message: ERR_REQ_USER_ALR_EXIST})

        const existingUsername = await User.findOne({username : username})

        if(existingUsername) return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message : ERR_REQ_USERNAME_ALR_EXIST})

        const hashedPassword = await bcrypt.hash(password , BCRYPT_HASH_LENGTH)

        const newUser = await User.create({
                                            key : key ,
                                            usertype : usertype ,
                                            email : email , 
                                            password : hashedPassword , 
                                            firstname : firstname , 
                                            lastname : lastname , 
                                            username : username ,
                                            image : image
                                        })
        const accessToken = jwt.sign({email : newUser.email , key: newUser.key , id: newUser._id , usertype : existingUser.usertype} , process.env.JWT_SECRET , {expiresIn: ACCESS_TOKEN_LENGTH})

        const refreshToken = jwt.sign({email : newUser.email , key: newUser.key , id: newUser._id , usertype : existingUser.usertype} , process.env.JWT_SECRET , {expiresIn: REFRESH_TOKEN_LENGTH})

        res.cookie(REFRESH_TOKEN_JWT_COOKIE_NAME , refreshToken , {
            httpOnly : true , 
            sameSite : 'None' ,
            secure : true ,
            maxAge : REFRESH_TOKEN_MAX_AGE
        })

        return res.status(HTTP_STATUS_CODES.OK).json({result : newUser , accessToken : accessToken})
    }
    catch(error){
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: ERR_REQ_WENT_WRONG})
    }
}

// @BREIF: Dealing with request to get user detials 
// @ROUTE: /api/user/:id
// @METHOD: GET
// @PARAMS: 
//        - id: the userId to return his details
// @BODY: NONE
// @RETURN:
//        ON SUCCESS (200)
//        - user - the matched user full details
//        - statistical user details - user's statistical details about his past posts and replies creation (including amount and dates created)
//        ON FAILURE (500)
//          - Error message indicating that something went wrong while dealing with the REQUEST
const getUser = async (req, res) => {
    try {
      const existingUser = await User.findOne({ _id: req.params.id });
  
      if (!existingUser) {
        return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: ERR_REQ_USER_NOT_EXIST });
      }
  
      const existingUserPostsDetails = await Conversation.aggregate([
        {
          $match: { 'user.email': existingUser.email },
        },
        {
          $group: {
            _id: 0,
            userPostsLength: { $sum: 1 },
            userPostsDates: { $push: '$createdAt' },
          },
        },
        {
          $project: { userPostsLength: 1, userPostsDates: 1 },
        },
      ]);
  
      const existingUserRepliesDetails = await Conversation.aggregate([
        { $unwind: '$replies' },
        { $match: { 'replies.user.email': existingUser.email } },
        {
            $group : {
                _id : 0,
                userRepliesLength : {$sum : 1},
                userRepliesDates : {$push : '$replies.createdAt'}
            }
        },
        {
            $project : {userRepliesLength : 1 , userRepliesDates : 1}
        }
      ]);
  
      let returnObject = {
        user: existingUser,
        userPostsLength: 0,
        userPostsDates: [],
        userRepliesLength: 0,
        userRepliesDates: []
      };
  
      if (existingUserRepliesDetails.length !== 0) {
        returnObject = {
            ...returnObject,
            userRepliesLength: existingUserRepliesDetails[0].userRepliesLength,
            userRepliesDates: existingUserRepliesDetails[0].userRepliesDates,
          };
      }
  
      if (existingUserPostsDetails.length !== 0) {
        returnObject = {
          ...returnObject,
          userPostsLength: existingUserPostsDetails[0].userPostsLength,
          userPostsDates: existingUserPostsDetails[0].userPostsDates,
        };
      }

  
      res.status(HTTP_STATUS_CODES.OK).json(returnObject);
    } catch (error) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERR_REQ_WENT_WRONG });
    }
  };
  

module.exports = {
    signin : signin ,
    signup : signup , 
    signout : signout ,
    getUser : getUser
}