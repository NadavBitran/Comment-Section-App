import technicalSupportPng from "/images/technicalSupport.png"
import developerContactPng from "/images/developerContact.png"
import feedbackContactPng from "/images/feedbackContact.png"


export const CONTACT_SUBJECT = {
    GENERAL : "General",
    TECHNICAL_SUPPORT : "Technical Support",
    FEEDBACK_AND_SUGGESTIONS : "Feedback and Suggestions",
}

export const INFO_CARD_DATA = [
    {
        TITLE : "Contact Me",
        TITLE_IMAGE : developerContactPng,
        DESC : [
            "Welcome to my interactive comments section demo!",
            "If you have any questions, I'd love to hear from you. Please use the form to get in touch."],
        MATCHED_SUBJECT : CONTACT_SUBJECT.GENERAL,
    },
    {
        TITLE : "Technical Support",
        TITLE_IMAGE : technicalSupportPng,
        DESC : ["If you're experiencing technical difficulties or have inquiries about the website's functionality," ,
                "please describe the issue in detail, and I'll work to resolve it promptly."],
        MATCHED_SUBJECT : CONTACT_SUBJECT.TECHNICAL_SUPPORT
    },
    {
        TITLE : "Feedback and Suggestions",
        TITLE_IMAGE : feedbackContactPng,
        DESC : ["Whether it's a suggestion for improvement or a positive experience you'd like to share, I'm eager to know what you think.",
                "Your insights help to enhance the user experience."],
        MATCHED_SUBJECT : CONTACT_SUBJECT.FEEDBACK_AND_SUGGESTIONS
    }
]