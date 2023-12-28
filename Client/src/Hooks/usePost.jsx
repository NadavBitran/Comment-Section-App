// ---------------------------
// IMPORTS:
import {
    useContext  , 
    useState , 
    useEffect ,
    useCallback ,
    useRef ,
    createContext} from 'react';


import {io} from 'socket.io-client';
import { v4 as uuid } from "uuid";


import {URL} from '../Api/index.js';

import { fetchConversations 
            }  from "../Api/get.js";

import { postConversation ,
         postReply 
         } from "../Api/post.js";

import { updateConversation ,
         updateReply,
         updateConversationLikes,
         updateReplyLikes } from "../Api/put.js";

import { deleteConversation ,
         deleteReply } from "../Api/delete.js";


import moment from 'moment'

import { LIMIT } from '../Pages/CommentSection/Components/PostList/constants/constants.js';
// ---------------------------

// ---------------------------
// usePostSource: Saves state of data and managing data change during the application runtime
function usePostSource(){
    const [posts , setPosts] = useState(null);
    const [postsSocket , setPostsSocket] = useState(null);
    const [pageNumber , setPageNumber] = useState(0);
    const [hasMorePosts, setHasMorePosts] = useState(false);
    const [isError , setIsError] = useState(false);
    const postsOffset = useRef(0)
    const currentPostsLength = useRef(0)
    const totalPostsLength = useRef(0)
    const isMounted = useRef(true)

    useEffect(() => {
        const initialSocket = () => {
            const ioSocket = io(URL)
            setPostsSocket(ioSocket)
        }
        const preformFirstPageLoad = async() => {
            const response = await loadNewPage()

            if(!response) setIsError(true)
        }
        
        if(isMounted.current){
            preformFirstPageLoad()
            initialSocket()
        }

        
        return () => { 
            if(postsSocket !== null) 
            {   
                console.log("Disconnected!")
                postsSocket.disconnect() 
            }
            isMounted.current = false
        }
    } , [])



    useEffect(() => {
        const setSocketSubscription = () => {
            postsSocket.on('ADD_POST' , (newPost) => {
                setPosts((posts) => [...posts , {...newPost , createdAt: moment(newPost.createdAt).fromNow()
                }])
                postsOffset.current++
                currentPostsLength.current++
            })
    
            postsSocket.on('UPDATE_POST' , (converationId , updatedContent) => {
                setPosts((posts) => {return posts.map((post) => {
                    if(post.key === converationId) return {...post , ...updatedContent}
                    else return post})})
            })
    
            postsSocket.on('DELETE_POST' , (converationId) => {
                setPosts((posts) => {return posts.filter((post) => {
                    if(post.key !== converationId)
                        return true
                    else{
                        postsOffset.current--
                        currentPostsLength.current--
                        return false
                    }})})
            })
    
    
            postsSocket.on('ADD_REPLY' , (converationId , newReply) => {
                setPosts((posts) => {return posts.map((post) => {
                    if(post.key === converationId) post.replies.push({...newReply , createdAt : moment(newReply.createdAt).fromNow()})
                    return post
                })})
            })
    
            postsSocket.on('UPDATE_REPLY' , (converationId , replyId , updatedContent) => {
                setPosts((posts) => {return posts.map((post) => {
                    if(post.key === converationId){
                        const replies = post.replies.map((reply) => {
                            if(reply.key === replyId) return {...reply , ...updatedContent}
                            else return reply
                        })
                        return {...post , replies : replies}
                    }
                    else return post
                })
                })
            })
    
            postsSocket.on('DELETE_REPLY' , (converationId , replyId) => {
                setPosts((posts) => {return posts.map((post) => {
                    if(post.key === converationId)
                    {
                        const replies = post.replies.filter((reply) => reply.key !== replyId)
                        console.log(replies)
                        return {...post , replies: replies}
                    }
                    else return post
                })})
            })
        
        }

        if(postsSocket === null) return
        
        setSocketSubscription()

    } , [postsSocket])

    const loadNewPage = useCallback(async() => {
        try{
            let response = await fetchConversations(pageNumber + 1 , LIMIT , postsOffset.current)


            let data = response.data.list.reverse()
            let postlength = response.data.listLength


            data.forEach((entity) => {
                entity.createdAt = moment(entity.createdAt).fromNow()
    
                entity.replies.forEach((reply) => {
                    reply.createdAt = moment(reply.createdAt).fromNow()
                })
            })

            if(pageNumber === 0){
                setPosts(() => [...data])
                setHasMorePosts(data.length < postlength)
                currentPostsLength.current = data.length
            }   
            else 
            {
                setPosts((currPosts) => [...data , ...currPosts])
                setHasMorePosts((currentPostsLength.current + data.length) < postlength)
                currentPostsLength.current+=data.length
            }
            totalPostsLength.current = postlength
            setPageNumber(pageNumber + 1)

            return true
        }
        catch(error){
            return false
        }
    } , [pageNumber , posts] )


    const setNewPost = useCallback(async (writer , content) => {
        const newPost = {
            key : uuid() , 
            content: content ,
            createdAt: new Date() , 
            score: 0,
            user: writer ,
            likes : [''],
            dislikes : [''] ,
            replies: []
        }
        await postConversation(newPost)
    } , [])

    const setNewReply = useCallback(async (converationId , replyingTo , writer , content) => {
        const newReply = {
            key : uuid() ,
            content: content,
            createdAt: new Date() ,
            score: 0,
            user: writer ,
            replyingTo: replyingTo ,
            likes : [''] , 
            dislikes : ['']
        }
        await postReply(converationId , newReply)
    } , [])

    const setExistingPost = useCallback(async (converationId , type , content) => {
        await updateConversation(converationId , {
            type : type ,
            content : content
        })
    } , [])

    const setExistingReply = useCallback(async (converationId , replyId , type , content) => {
        await updateReply(converationId , {
            replyId : replyId ,
            type : type ,
            content : content
        })
    } , [])

    const setExistingPostLikes = useCallback(async (converationId , operationType) => {
        try{
            const updatedConversation = await updateConversationLikes(converationId , {
                operationType : operationType
            })
            
            if(updateConversation.hasOwnProperty('message')) return
    
            setPosts((posts) => { return posts.map((post) => {
                if(post.key === converationId) return {...post , likes : updatedConversation.data.likes , 
                                                                 dislikes : updatedConversation.data.dislikes , 
                                                                 score : updatedConversation.data.score}
                else return post
            })
    
            })

            return 'Success'
        }
        catch(error){
            return 'Failed'
        }

    } , [posts])

    const setExistingReplyLikes = useCallback(async (converationId , replyId , operationType) => {
        try{
            const updatedReply = await updateReplyLikes(converationId , {
                replyId : replyId , 
                operationType : operationType
            })
    
            if(updateConversation.hasOwnProperty('message')) return
    
            setPosts((posts) => {return posts.map((post) => {
                if(post.key === converationId){
                    const replies = post.replies.map((reply) => {
                        if(reply.key === replyId) return {...reply , likes : updatedReply.data.likes ,
                                                                     dislikes : updatedReply.data.dislikes ,
                                                                     score : updatedReply.data.score}
                        else return reply
                    })
                    return {...post , replies : replies}
                }
                else return post
            })
            })

            return 'Success'
        }
        catch(error){
            return 'Failed'
        }
    } , [posts])

    const setRemovePost = useCallback(async (converationId) => {
        await deleteConversation(converationId)
    } , [])

    const setRemoveReply = useCallback(async (converationId , replyId) => {
        await deleteReply(converationId , {
            replyId : replyId
        })
    } , [])



    return {posts: posts , 

            setNewPost: setNewPost , 
            setNewReply : setNewReply , 

            setExistingPost : setExistingPost ,
            setExistingReply : setExistingReply ,

            setExistingPostLikes : setExistingPostLikes ,
            setExistingReplyLikes : setExistingReplyLikes ,

            setRemovePost : setRemovePost , 
            setRemoveReply : setRemoveReply ,

            hasMorePosts : hasMorePosts,
            totalPostsLength : totalPostsLength ,
            postsOffset : postsOffset,
            isError : isError,
            setIsError : setIsError,
            loadNewPage : loadNewPage
    }
}
// ---------------------------


// ---------------------------
// usePost: The custom hook that connect from client to usePostSource via useContext
const PostContext = createContext()

export function usePost(){
    return useContext(PostContext)
}


// ---------------------------
// PostProvider: The provider that connects children prop to the post manager
export function PostProvider({children}){
    return (
        <PostContext.Provider value={usePostSource()}>
            {children}
        </PostContext.Provider>
    );
}

