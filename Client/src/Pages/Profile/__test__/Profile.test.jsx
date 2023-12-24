import { findByText, render , screen , waitFor} from "@testing-library/react";
import { afterAll, beforeAll, beforeEach, describe, expect , vi } from "vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";

import Profile from "../Profile.jsx";
import { useProfile } from "../../../Hooks/useProfile";
import { useUser } from "../../../Hooks/useUser.jsx";

import { TEST_USER
     , TEST_USER_POST_LIST , 
     TEST_USER_REPLY_LIST } from "../../../FakeData";



import { mockNavigator } from "../../../Hooks/mocks/navigate";


vi.mock("react-router-dom" , () => {
    return{
        ...vi.importActual("react-router-dom"),
        useNavigate : () => {return mockNavigator},
        useParams : () => {return{id : TEST_USER._id}}
    }
})
vi.mock("../Components/CommentReadOnly")
vi.mock("../Components/ActivityChart/ActivityChart")
vi.mock("../Components/Filter/Filter")
vi.mock("../Components/Pagination/Pagination")
vi.mock("../../../Hooks/useProfile")
vi.mock("../../../Hooks/useUser")
vi.mock("../../../Components/Modal/Modal")


const FAKE_POST_LIST_LENGTH = 30
const FAKE_REPLY_LIST_LENGTH = 40


const loadProfileMocksToTrack = {
    Success : {
        loadProfileMainPage : vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(true) , 500)
            })
        }),
        loadProfilePostPage : vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(true) , 500)
            })
        }),
        loadProfileReplyPage : vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(true) , 500)
            })
        })
    },
    Failure : {
        loadProfileMainPage : vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(false) , 500)
            })
        }),
        loadProfilePostPage : vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(false) , 500)
            })
        }),
        loadProfileReplyPage : vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(false) , 500)
            })
        })
    }
}

const mockedUseProfile = {
    regular_test : {
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
        loadProfileMainPage : loadProfileMocksToTrack.Success.loadProfileMainPage , 
        loadProfilePostPage : loadProfileMocksToTrack.Success.loadProfilePostPage,
        loadProfileReplyPage :loadProfileMocksToTrack.Success.loadProfileReplyPage ,
        resetProfilePages : vi.fn()
    },
    network_error_test : {
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
        loadProfileMainPage : loadProfileMocksToTrack.Failure.loadProfileMainPage , 
        loadProfilePostPage : loadProfileMocksToTrack.Success.loadProfilePostPage,
        loadProfileReplyPage :loadProfileMocksToTrack.Success.loadProfileReplyPage ,
        resetProfilePages : vi.fn()
    },
    load_error_test : {
        profileUser : TEST_USER ,
        profileUserPosts : null ,
        profileUserReplies : null,
        profileUserPostsLength : FAKE_POST_LIST_LENGTH,
        profileUserRepliesLength : FAKE_REPLY_LIST_LENGTH ,
        profileUserPostsCurrentPage : 0 ,
        profileUserRepliesCurrentPage : 0 ,
        profileUserPostsSortOptions : {option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""},
        profileUserRepliesSortOptions : {option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""} ,
        profileUserPostsDates : [] ,
        profileUserRepliesDates : [] ,
        isOwnProfile : true , 
        loadProfileMainPage : loadProfileMocksToTrack.Success.loadProfileMainPage , 
        loadProfilePostPage : loadProfileMocksToTrack.Failure.loadProfilePostPage,
        loadProfileReplyPage :loadProfileMocksToTrack.Failure.loadProfileReplyPage ,
        resetProfilePages : vi.fn()
    },
    no_history_test : {
        profileUser : TEST_USER ,
        profileUserPosts : [] ,
        profileUserReplies : [] ,
        profileUserPostsLength : 0,
        profileUserRepliesLength : 0 ,
        profileUserPostsCurrentPage : 0 ,
        profileUserRepliesCurrentPage : 0 ,
        profileUserPostsSortOptions : {option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""},
        profileUserRepliesSortOptions : {option : {sortOption : 'createdAt' , orderOption : 'desc'} , search : ""} ,
        profileUserPostsDates : [] ,
        profileUserRepliesDates : [] ,
        isOwnProfile : true , 
        loadProfileMainPage : loadProfileMocksToTrack.Success.loadProfileMainPage , 
        loadProfilePostPage : loadProfileMocksToTrack.Success.loadProfilePostPage,
        loadProfileReplyPage :loadProfileMocksToTrack.Success.loadProfileReplyPage ,
        resetProfilePages : vi.fn()
    }
}



describe("Profile Tests" , () => {

    beforeAll(() => {
        useProfile.mockImplementation(() => (mockedUseProfile.regular_test))
    })

    beforeEach(() => {
        mockNavigator.mockClear()
    })

describe("Profile Render" , () => {

            it("Should Render Profile Main Page Correctly" , async() => {
                render(<Profile />)

                const skeletonLoad = screen.queryByTestId("skeleton-load")

                expect(skeletonLoad).toBeInTheDocument()

                const analysisStats = await screen.findByText("Mocked ActivityChart")
                const profileInfo = {
                    username : await screen.findByText(TEST_USER.username),
                    firstname : await screen.findByText(TEST_USER.firstname),
                    lastname : await screen.findByText(TEST_USER.lastname),
                    email : await screen.findByText(TEST_USER.email),
                    postWritten : await screen.findByText(FAKE_POST_LIST_LENGTH),
                    repliesWritten : await screen.findByText(FAKE_REPLY_LIST_LENGTH)
                }

                expect(analysisStats).toBeInTheDocument()

                Object.values(profileInfo).forEach((element) => {
                    expect(element).toBeInTheDocument();
                });
            })
        })

    describe("Profile Without Login Error" , () => {

        beforeAll(() => {
            useUser.mockImplementation(() => ({
                user: null,
                signupUser: vi.fn(),
                signinUser: vi.fn(),
                signoutUser: vi.fn(),
            }))
        })

        afterAll(() => {
            useUser.mockImplementation(() => ({
                user: TEST_USER,
                signupUser: vi.fn(),
                signinUser: vi.fn(),
                signoutUser: vi.fn(),
            }))
        })
        
        it("Should Not Render Profile Main Page If No User Logged In" , () => {
            render(<Profile />)

            expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()

        })
    })

    describe("Profile Loading Error" , () => {
        beforeAll(() => {
            useProfile.mockImplementation(() => (mockedUseProfile.network_error_test))
        })
        
        afterAll(() => {
            useProfile.mockImplementation(() => (mockedUseProfile.regular_test))
        })

        it("Should Not Render Profile If There's Failure In The Load Request" , async() => {
            
            render(<Profile />)

            const errorLoad = await screen.findByText("Mocked Modal")

            expect(errorLoad).toBeInTheDocument()
        })
    })
    


    
    describe("Profile Functionality" , () => {
    
        describe("No Active History" , () => {

            beforeAll(() => {
                useProfile.mockImplementation(() => (mockedUseProfile.no_history_test))
            })

            afterAll(() => {
                useProfile.mockImplementation(() => (mockedUseProfile.regular_test))
            })
    
            it("Should Show No Posts Message if User Post List doesn't exist" , async() => {

                const user = userEvent.setup()

                render(<Profile />)

                const postHistoryBtn = await screen.findByText("Post History")

                await user.click(postHistoryBtn)

                expect(screen.queryByText("No Posts Found")).toBeInTheDocument()

            })

            it("Should Show No Replies Message if User Replies List doesn't exist" , async() => {

                const user = userEvent.setup()

                render(<Profile />)

                const replyHistoryBtn = await screen.findByText("Reply History")

                await user.click(replyHistoryBtn)

                expect(screen.queryByText("No Replies Found")).toBeInTheDocument()
            })

        })
    
        describe("Has Active History" , () => {

                
            it("Should Show Post History Page" , async() => {

                const user = userEvent.setup()

                render(<Profile />)

                const postHistoryBtn = await screen.findByText("Post History")

                await user.click(postHistoryBtn)


                const mockedContnet = await screen.findAllByText("Mocked Comment")
                const mockedFilter = await screen.findByText("Mocked Filter")
                const mockedPagination = await screen.findByText("Mocked Pagination")

                expect(mockedContnet).toHaveLength(FAKE_POST_LIST_LENGTH)
                expect(mockedFilter).toBeInTheDocument()
                expect(mockedPagination).toBeInTheDocument()
            })
    
             
            it("Should Show Reply History Page", async() => {

                const user = userEvent.setup()

                render(<Profile />)

                const ReplyHistoryBtn = await screen.findByText("Reply History")

                await user.click(ReplyHistoryBtn)


                const mockedContnet = await screen.findAllByText("Mocked Comment")
                const mockedFilter = await screen.findByText("Mocked Filter")
                const mockedPagination = await screen.findByText("Mocked Pagination")

                expect(mockedContnet).toHaveLength(FAKE_REPLY_LIST_LENGTH)
                expect(mockedFilter).toBeInTheDocument()
                expect(mockedPagination).toBeInTheDocument()
            })
    
        })
    
    
    
        describe("Profile Load between pages Error" , () => {

            beforeAll(() => {
                useProfile.mockImplementation(() => (mockedUseProfile.load_error_test))
            })

            afterAll(() => {
                useProfile.mockImplementation(() => (mockedUseProfile.regular_test))
            })

            it("Should Show Error if User Post Page failed to load" , async() => {
                
                const user = userEvent.setup()

                render(<Profile />)

                const postHistoryBtn = await screen.findByText("Post History")

                await user.click(postHistoryBtn)

                const errorModal = await screen.findByText("Mocked Modal")
                const mockedContnet = screen.queryAllByText("Mocked Comment")

                expect(errorModal).toBeInTheDocument()
                expect(mockedContnet).toHaveLength(0)
                
            })
    
            it("Should Show Error if User Replies Page failed to load" , async() => {

                const user = userEvent.setup()

                render(<Profile />)

                const replyHistoryBtn = await screen.findByText("Reply History")

                await user.click(replyHistoryBtn)

                const errorModal = await screen.findByText("Mocked Modal")
                const mockedContnet = screen.queryAllByText("Mocked Comment")

                expect(errorModal).toBeInTheDocument()
                expect(mockedContnet).toHaveLength(0)
            })
        })
    })    
})

