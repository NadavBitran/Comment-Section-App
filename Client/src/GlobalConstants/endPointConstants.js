
export const END_POINT_CONVERSATION_DELETE = (conversationId) => `api/conversation/${conversationId}`

export const END_POINT_REPLY_DELETE = (replyId) => `api/reply/${replyId}`

export const END_POINT_CONVERSATION_GET = (page , limit , postsOffset) => `/api/conversation?page=${page}&limit=${limit}&offset=${postsOffset}`
export const END_POINT_USER_CONVERSATION_GET = (page , limit , userId , sortOptions) => `/api/conversation?page=${page}&limit=${limit}&userId=${userId}&search=${sortOptions.search}&sort=${sortOptions.option.sortOption},${sortOptions.option.orderOption}`
export const END_POINT_USER_REPLY_GET = (page , limit , userId , sortOptions) => `/api/reply?page=${page}&limit=${limit}&userId=${userId}&search=${sortOptions.search}&sort=${sortOptions.option.sortOption},${sortOptions.option.orderOption}`
export const END_POINT_USER_GET = (userId) => `api/user/${userId}`

export const END_POINT_REFRESH_TOKEN_GET = () => '/api/token/refresh'
export const END_POINT_SIGN_OUT_GET = () => '/api/user/signout'

export const END_POINT_CONVERSATION_POST = () => `/api/conversation`
export const END_POINT_REPLY_POST = (conversationId) =>  `/api/reply/${conversationId}`
export const END_POINT_SIGN_IN_POST = () => `/api/user/signin`
export const END_POINT_SIGN_UP_POST = () => `/api/user/signup`
export const END_POINT_EMAIL_POST = () => `/api/email`

export const END_POINT_CONVERSATION_UPDATE = (conversationId) => `/api/conversation/${conversationId}`
export const END_POINT_REPLY_UPDATE = (conversationId) => `/api/reply/${conversationId}`
export const END_POINT_CONVERSATION_LIKE_UPDATE = (conversationId) => `/api/conversation/like/${conversationId}`
export const END_POINT_REPLY_LIKE_UPDATE = (conversationId) => `/api/reply/like/${conversationId}`