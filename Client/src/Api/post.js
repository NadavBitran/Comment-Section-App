import {API} from "./index.js";


export const postConversation = (data) => API.post(`/api/conversation` , data , {
    headers : {'Content-Type': 'application/json'} 
})
export const postReply = (conversationId , data) => API.post(`/api/reply/${conversationId}` , data , {
    headers:  {'Content-Type': 'application/json'} 
})
export const postSigninUser = (data) => API.post(`/api/user/signin` , data , {
    headers : {'Content-Type': 'application/json'} 
} )
export const postSignupUser = (data) => API.post(`/api/user/signup` , data , {
    headers : {'Content-Type': 'application/json'} 
} )
export const postEmail = (data) => API.post(`/api/email` , data ,{
    headers : {'Content-Type' : 'application/json'}
})