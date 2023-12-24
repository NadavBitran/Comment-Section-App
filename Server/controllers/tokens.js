// @BREIF: Contains all the functions designed to deal with token related actions 
// @ROUTE: /api/token/*


const { json } = require('express');
const jwt = require('jsonwebtoken');


const HTTP_STATUS_CODES = require("../constants/controllers/httpstatusConstants")
const {ERR_UNAUTH} = require("../constants/controllers/messageConstants")
const {ACCESS_TOKEN_LENGTH , REFRESH_TOKEN_MAX_AGE , REFRESH_TOKEN_JWT_COOKIE_NAME} = require("../constants/tokens/tokenConstants")



// @BREIF: Dealing with sending new accessToken to requested user
// @ROUTE: /api/token/refresh
// @METHOD: GET
// @PARAMS: NONE
// @BODY: NONE
// @COOKIES:
//          - jwt - An HTTP-Only Cookie contains refreshToken value
// @RETURN
//          ON SUCCESS (200)
//          - accessToken - the Newly accessToken
//          - refreshToken - a new refreshToken inside an HTTP-Only Cookie
//          ON FAILURE (406)
//          - Error message indicating the user is Unauthorized to refresh his token's due to refreshToken EXPIRES, refreshToken NOT AVALIABLE or ANY OTHER ERROR
const refresh = async(req , res) => {

    try{
        if(req.cookies?.jwt){
            
            const refreshToken = req.cookies.jwt

            const decodedData = jwt.verify(refreshToken , process.env.JWT_SECRET)

            const newAccessToken = jwt.sign({email : decodedData.email , id : decodedData.id , key : decodedData.key , usertype : decodedData.usertype} , process.env.JWT_SECRET , {expiresIn: ACCESS_TOKEN_LENGTH})

            res.cookie(REFRESH_TOKEN_JWT_COOKIE_NAME , refreshToken , {
                httpOnly : true , 
                sameSite : 'None' ,
                secure : true ,
                maxAge : REFRESH_TOKEN_MAX_AGE
            })

            return res.status(HTTP_STATUS_CODES.OK).json({accessToken : newAccessToken})
        }
        else{
            res.status(HTTP_STATUS_CODES.NOT_ACCEPTABLE).json({message: ERR_UNAUTH})
        }
    }
    catch(error){
        res.status(HTTP_STATUS_CODES.NOT_ACCEPTABLE).json({message: ERR_UNAUTH})
    }
}

module.exports = {
    refresh : refresh
}