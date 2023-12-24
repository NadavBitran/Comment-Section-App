import React from 'react'
import {vi} from 'vitest';

import { TEST_USER , TEST_USER_POST_LIST , TEST_USER_REPLY_LIST } from '../../FakeData';

const FAKE_POST_LIST_LENGTH = 30
const FAKE_REPLY_LIST_LENGTH = 30

export const useProfile = vi.fn().mockReturnValue({
    profileUser : TEST_USER ,
    profileUserPosts : TEST_USER_POST_LIST(FAKE_POST_LIST_LENGTH) ,
    profileUserReplies : TEST_USER_REPLY_LIST(FAKE_REPLY_LIST_LENGTH) ,
    profileUserPostsLength : FAKE_POST_LIST_LENGTH,
    profileUserRepliesLength : FAKE_REPLY_LIST_LENGTH ,
    profileUserPostsCurrentPage : 0 ,
    profileUserRepliesCurrentPage : 0 ,
    profileUserPostsSortOptions : {option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""},
    profileUserRepliesSortOptions : {option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""} ,
    profileUserPostsDates : [] ,
    profileUserRepliesDates : [] ,
    isOwnProfile : true , 
    loadProfileMainPage : vi.fn() , 
    loadProfilePostPage : vi.fn(),
    loadProfileReplyPage : vi.fn() ,
    resetProfilePages : vi.fn()
})