import {API} from "./index.js";


export const fetchConversations = (page , limit , postsOffset) => API.get(`/api/conversation?page=${page}&limit=${limit}&offset=${postsOffset}`)
export const fetchUserConversations = (page , limit , userId , sortOptions) => API.get(`/api/conversation?page=${page}&limit=${limit}&userId=${userId}&search=${sortOptions.search}&sort=${sortOptions.option.sortOption},${sortOptions.option.orderOption}`)
export const fetchUserReplies = (page , limit , userId , sortOptions) => API.get(`/api/reply?page=${page}&limit=${limit}&userId=${userId}&search=${sortOptions.search}&sort=${sortOptions.option.sortOption},${sortOptions.option.orderOption}`)
export const fetchUser = (id) => API.get(`api/user/${id}`)
export const fetchRefreshToken = () => API.get('/api/token/refresh')
export const fetchSignOutUser= () => API.get('/api/user/signout')