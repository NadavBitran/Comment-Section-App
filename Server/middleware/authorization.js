// @BREIF: Contains all the MIDDLEWARE functions designed to deal with authentication related actions

const jwt = require("jsonwebtoken")


const HTTP_STATUS_CODES = require("../constants/controllers/httpstatusConstants")
const {ERR_UNAUTH} = require("../constants/controllers/messageConstants")
 
// @BREIF: Dealing with JWT accessToken verification 
// @HEADERS:
//          - accessToken - the user's JWT accessToken
// @RETURN:
//          ON SUCCESS (NEXT)
//          - the MIDDLEWARE continue to the next MIDDLEWARE/REQUEST HANDLER
//          - the following details: userId , userEmail and userType is extracted and passed added into the REQUEST OBJECT
//          ON FAILURE (401)
//          - Error message indicating the user is Unauthorized and needs to update his accessToken
const auth = async(req , res , next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]

        let decodedData;

        decodedData = jwt.verify(token , process.env.JWT_SECRET)

        req.userId = decodedData.id
        req.userEmail = decodedData.email
        req.userType = decodedData.usertype
        
        next()
    }catch(error){
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({message : ERR_UNAUTH})
    }
}

module.exports = {
    auth : auth
}