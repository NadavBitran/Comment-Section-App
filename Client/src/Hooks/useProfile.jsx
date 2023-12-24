import { useState } from "react"
import { useUser } from "./useUser"
import moment from 'moment'


import { fetchUserConversations , fetchUserReplies , fetchUser } from "../Api/get"

export function useProfile(id){
    const [profileUser , setProfileUser] = useState(null)
    const [profileUserPosts , setProfileUserPosts] = useState(null)
    const [profileUserPostsDates , setProfileUserPostsDates] = useState(null)
    const [profileUserPostsCurrentPage , setProfileUserPostsCurrentPage] = useState(1)
    const [profileUserPostsLength , setProfileUserPostsLength] = useState(0)
    const [profileUserPostsSortOptions , setProfileUserPostsSortOptions] = useState({option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""})
    const [profileUserReplies , setProfileUserReplies] = useState(null)
    const [profileUserRepliesDates , setProfileUserRepliesDates] = useState(null)
    const [profileUserRepliesCurrentPage , setProfileUserRepliesCurrentPage] = useState(1) 
    const [profileUserRepliesLength , setProfileUserRepliesLength] = useState(0)
    const [profileUserRepliesSortOptions , setProfileUserRepliesSortOptions] = useState({option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""})
    const {user} = useUser()



    const loadProfileMainPage = async() => {

        try{
            let response = await fetchUser(id)
            
            setProfileUser(response.data.user)
            setProfileUserPostsLength(response.data.userPostsLength)
            setProfileUserPostsDates(response.data.userPostsDates)
            setProfileUserRepliesLength(response.data.userRepliesLength)
            setProfileUserRepliesDates(response.data.userRepliesDates)

            return true
        }
        catch(error){
            return false
        }
    }

    const loadProfilePostPage = async(pageNumber , limit , sortOptions) => {
        try{
            let response = await fetchUserConversations(pageNumber , limit , id , sortOptions)

            response.data.list.forEach((entity) => {
                entity.createdAt = moment(entity.createdAt).fromNow()
            })
            setProfileUserPosts(response.data.list)
            setProfileUserPostsLength(response.data.listLength)
            setProfileUserPostsCurrentPage(pageNumber)
            setProfileUserPostsSortOptions(sortOptions)

            return true
        }
        catch(error){
            return false
        }
    }

    const loadProfileReplyPage = async(pageNumber , limit , sortOptions) => {
        try{
            let response = await fetchUserReplies(pageNumber , limit , id , sortOptions)

            response.data.list.forEach((entity) => {
                entity.createdAt = moment(entity.createdAt).fromNow()
            })


            setProfileUserReplies(response.data.list)
            setProfileUserRepliesLength(response.data.listLength)
            setProfileUserRepliesCurrentPage(pageNumber)
            setProfileUserRepliesSortOptions(sortOptions)

            return true
        }
        catch(error){
            return false
        }
    }

    const resetProfilePages = () => {
        setProfileUserPosts(null)
        setProfileUserReplies(null)
        setProfileUserPostsCurrentPage(1)
        setProfileUserRepliesCurrentPage(1)
        setProfileUserPostsSortOptions({option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""})
        setProfileUserRepliesSortOptions({option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""})
        setProfileUserPostsLength(0)
        setProfileUserRepliesLength(0)


    }



    return {profileUser : profileUser ,
            profileUserPosts : profileUserPosts ,
            profileUserReplies : profileUserReplies ,
            profileUserPostsLength : profileUserPostsLength,
            profileUserRepliesLength : profileUserRepliesLength ,
            profileUserPostsCurrentPage : profileUserPostsCurrentPage ,
            profileUserRepliesCurrentPage : profileUserRepliesCurrentPage ,
            profileUserPostsSortOptions : profileUserPostsSortOptions,
            profileUserRepliesSortOptions : profileUserRepliesSortOptions ,
            profileUserPostsDates : profileUserPostsDates ,
            profileUserRepliesDates : profileUserRepliesDates ,
            isOwnProfile : user._id === id , 
            loadProfileMainPage : loadProfileMainPage , 
            loadProfilePostPage : loadProfilePostPage,
            loadProfileReplyPage : loadProfileReplyPage ,
            resetProfilePages : resetProfilePages
        }

}
