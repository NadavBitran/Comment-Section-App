import {API} from "./index.js";


export const updateConversation = (conversationId , data) => API.put(`/api/conversation/${conversationId}` , data , {
    headers : {'Content-Type' : 'application/json'}
})
export const updateReply = (conversationId , data) => API.put(`/api/reply/${conversationId}` , data , {
    headers : {'Content-Type' : 'application/json'}
})
export const updateConversationLikes = (conversationId , data) => API.put(`/api/conversation/like/${conversationId}` , data , {
    headers : {'Content-Type' : 'application/json'}
})
export const updateReplyLikes = (conversationId , data) => API.put(`/api/reply/like/${conversationId}` , data , {
    headers : {'Content-Type' : 'application/json'}
})