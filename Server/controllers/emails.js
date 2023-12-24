// @BREIF: Contains all the functions designed to deal with email related actions 
// @ROUTE: /api/email/* 

const {REQ_SUCC ,ERR_REQ_WENT_WRONG} = require("../constants/controllers/messageConstants")
const HTTP_STATUS_CODES = require("../constants/controllers/httpstatusConstants")
const {APP_VARIABLES} = require("../constants/globalConstants")


// @BREIF: Generating TEXT and TEMPLATE HTML to the support team's EMAIL
// @PARAMS:
//          - data: the REQUEST data including details that needs to be filled in the TEXT and TEMPLATE HTML
// @RETURN:
//          - the TEXT and TEMPLATE HTML filled with the REQUEST data details
const generateContactEmailText = (data) => {
    const {firstname , lastname , email , subject , image , description} = data

    const html = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title> <style> @import url('https://fonts.googleapis.com/css2?family=Alata&family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;700;800&family=Josefin+Sans:wght@300&family=Montserrat:wght@500;700&family=Open+Sans&family=Poppins:wght@400;500;600;700&family=Raleway:wght@400;700&family=Rubik:wght@400;500;700&family=Space+Grotesk:wght@500&display=swap'); body{ font-family: rubik; } .messageContent{ position: absolute; top: 50%; left: 50%; transform: translate(-50% , -50%); padding: 2rem; background-color: white; } .messageContent h1{ text-align: center; color: hsl(237, 34%, 32%); } .messageContentGrid{ background-color: rgb(251,253,254); border: 1px solid hsl(237, 34%, 32%); border-radius: 5px; display: grid; grid-template-columns: 1fr 1fr; padding: 2rem; } .messageContentGrid h2{ color: hsl(237, 34%, 32%); } </style></head><body> <div class="messageContent"> <h1>New Contact Message</h1> <div class="messageContentGrid"> <div class="firstnameContainer"> <h2>First Name</h2> <p>${firstname}</p> </div> <div class="lastnameContainer"> <h2>Last Name</h2> <p>${lastname}</p> </div> <div class="emailContainer"> <h2>Email</h2> <p>${email}</p> </div> <div class="subjectContainer"> <h2>Subject</h2> <p>${subject}</p> </div> <div class="descriptionContainer"> <h2>Description</h2> <p>${description}</p> </div> </div> </div></body></html>`

    const text = `firstname : ${firstname} \n\n lastname : ${lastname} \n\n email : ${email} \n\n subject : ${subject} \n\n description : ${description} \n\n`

    if(image)
    {
        return {text : text , html : html , attachments : [{filename : "imageContact" , path : image}]}
    }
    else return {text : text , html : html}
}

// @BREIF: Generating TEXT and TEMPLATE HTML to the client's email
// @PARAMS:
//          - data: the REQUEST data including details that needs to be filled in the TEXT and TEMPLATE HTML
// @RETURN:
//          - the TEXT and TEMPLATE HTML filled with the REQUEST data details
const generateUserEmailText = (data) => {
    const {firstname , lastname , email , subject , image , description} = data

    const html = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title> <style> @import url('https://fonts.googleapis.com/css2?family=Alata&family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;700;800&family=Josefin+Sans:wght@300&family=Montserrat:wght@500;700&family=Open+Sans&family=Poppins:wght@400;500;600;700&family=Raleway:wght@400;700&family=Rubik:wght@400;500;700&family=Space+Grotesk:wght@500&display=swap'); body{ font-family: rubik; } .message{ position: absolute; top: 50%; left: 50%; transform: translate(-50% , -50%); } .messageUser{ color: hsl(237, 34%, 32%); } .messageContent{ padding: 2rem; background-color: white; } .messageContent h1{ text-align: center; color: hsl(237, 34%, 32%); } .messageContentGrid{ background-color: rgb(251,253,254); border: 1px solid hsl(237, 34%, 32%); border-radius: 5px; display: grid; grid-template-columns: 1fr 1fr; padding: 2rem; } .messageContentGrid h2{ color: hsl(237, 34%, 32%); } </style></head><body> <div class="message"> <h2 class="messageUser">Dear ${firstname}!<br>Thank you for reaching me at my Interactive Comment Section Demo mini-project, I appreciate you taking the time to contact me. <br>I wanted to let you know that I have received your message and I'll do my best to respond as quickly as possible. <br>Best regards , Nadav</h2> <div class="messageContent"> <h1>Request Summary</h1> <div class="messageContentGrid"> <div class="firstnameContainer"> <h2>First Name</h2> <p>${firstname}</p> </div> <div class="lastnameContainer"> <h2>Last Name</h2> <p>${lastname}</p> </div> <div class="emailContainer"> <h2>Email</h2> <p>${email}</p> </div> <div class="subjectContainer"> <h2>Subject</h2> <p>${subject}</p> </div> <div class="descriptionContainer"> <h2>Description</h2> <p>${description}</p> </div> </div> </div> </div></body></html>`

    const text = `Dear ${firstname}! \n Thank you for reaching me at my Interactive Comment Section Demo mini-project, I appreciate you taking the time to contact me. \n I wanted to let you know that I have received your message and I'll do my best to respond as quickly as possible. \n Best regards , Nadav \n\n ----Request Summary----  \n firstname : ${firstname} \n\n lastname : ${lastname} \n\n email : ${email} \n\n subject : ${subject} \n\n description : ${description} \n\n`

    if(image)
    {
        return {text : text , html : html , attachments : [{filename : "imageContact" , path : image}]}
    }
    else return {text : text , html : html}
}


// @BREIF: Dealing with requests to send TWO messages
//          - First Message - to the support EMAIL, informing of a new contact request
//          - Second Message - to the client EMAIL, informing of a new contact case opened
// @ROUTE: /api/email
// @METHOD: POST
// @PARAMS: NONE
// @BODY:
//          - The email data including: client's name , client's requested subject , client's description...
// @RETURN: 
//          ON SUCCESS (200)
//          - Message - message indicating the email sending was successful
//          ON FAILURE (500)
//          - Error message indicating something went wrong while dealing with the REQUEST
const sendEmail = async( req , res ) => {

    const data = req.body

    const transporter = req.app.get(APP_VARIABLES.EMAIL_TRANSPORTER)
    const options = req.app.get(APP_VARIABLES.EMAIL_OPTIONS)
    try{
        await transporter.sendMail({
            ...options , 
            ...generateContactEmailText(data) ,
            subject : `${data.subject} message from ${data.firstname}` 
        })
        await transporter.sendMail({
            from: options.from ,
            to : data.email ,
            ...generateUserEmailText(data) ,
            subject : `Acknowledgment of Your Message and Next Steps`
        })
        console.log("returning: " , 200)
        res.status(HTTP_STATUS_CODES.OK).json({message : REQ_SUCC})
    }
    catch(error){
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : ERR_REQ_WENT_WRONG})
    }
}   


module.exports = {
    sendEmail : sendEmail
}