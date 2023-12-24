import {API} from "./index.js";

export const deleteConversation = (conversationId) => API.delete(`/api/conversation/${conversationId}` , {
    headers : { "Content-Type" : "application/json" }
})
export const deleteReply = (conversationId , data) => API.delete(`/api/reply/${conversationId}` , {
    data: data ,
    headers : {"Content-Type" : 'application/json'}
})