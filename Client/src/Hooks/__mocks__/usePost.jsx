import React from 'react'
import {vi} from 'vitest';
import { TEST_POST_LIST } from '../../FakeData';

export const usePost = vi.fn().mockReturnValue({
    posts:  TEST_POST_LIST, 

    setNewPost: vi.fn() , 
    setNewReply : vi.fn() , 

    setExistingPost : vi.fn() ,
    setExistingReply : vi.fn() ,

    setExistingPostLikes : vi.fn() ,
    setExistingReplyLikes : vi.fn() ,

    setRemovePost : vi.fn() , 
    setRemoveReply : vi.fn() ,

    hasMorePosts : false,
    totalPostsLength : TEST_POST_LIST.length ,
    postsOffset : 0,
    isError : false,
    setIsError : vi.fn(),
    loadNewPage : vi.fn()
})  

export * from "../usePost"