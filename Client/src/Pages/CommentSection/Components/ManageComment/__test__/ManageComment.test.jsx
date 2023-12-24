import { queryByText, render , screen , waitFor} from "@testing-library/react";
import { afterAll, beforeAll, beforeEach, describe, expect , vi } from "vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";

import ManageComment from "../ManageComment";
import { usePost } from "../../../../../Hooks/usePost.jsx";

import { TEST_OWN_POST , TEST_OWN_REPLY , TEST_OTHER_POST , TEST_OTHER_REPLY , TEST_POST_LIST, TEST_USER } from "../../../../../FakeData";
import {COMMENT_TYPE} from "../../../../../Components/Comment/Constants/constants.js"
import {OPERATION_TYPE} from "../Constants/constants.js"


vi.mock("../../../../../Hooks/usePost")
vi.mock("../../../../../Hooks/useUser")
vi.mock("../../../../../Components/Modal/Modal")


const POST_LIST_LENGTH = 20
const mocked_setCommentStatus = vi.fn()

const ManageComment_JSX = {
    SEND : <ManageComment
                operationType={OPERATION_TYPE.SEND}
                commentType={COMMENT_TYPE.POST} 
            />,
    EDIT : {
        TO_POST : <ManageComment
                    operationType={OPERATION_TYPE.EDIT}
                    commentType={COMMENT_TYPE.POST}
                    contentToEdit={TEST_OWN_POST.content}
                    converationId={TEST_OWN_POST.converationId}
                    setCommentStatus={mocked_setCommentStatus}
                />,
        TO_REPLY : <ManageComment
                    operationType={OPERATION_TYPE.EDIT}
                    commentType={COMMENT_TYPE.REPLY}
                    contentToEdit={TEST_OWN_REPLY.content}
                    converationId={TEST_OWN_REPLY.converationId}
                    replyId={TEST_OWN_REPLY.replyId}
                    replyTo={TEST_OWN_REPLY.replyingTo}
                    setCommentStatus={mocked_setCommentStatus}
                />
    },
    REPLY : <ManageComment
                operationType={OPERATION_TYPE.REPLY}
                commentType={COMMENT_TYPE.POST}
                converationId={TEST_OWN_POST.converationId}
                replyTo={TEST_OWN_POST.writer.username}
                setCommentStatus={mocked_setCommentStatus} 
            />,
    DELETE : <ManageComment
                operationType={OPERATION_TYPE.DELETE} 
            />
}

const MockedUsePostFuncToTrack = {
    SUCCESS : {
        setNewPost : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    resolve("Success")
                } , 500)
            })
        }),
        setNewReply : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    resolve("Success")
                } , 500)
            })
        }),
        setExistingPost : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    resolve("Success")
                } , 500)
            })
        }),
        setExistingReply : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    resolve("Success")
                } , 500)
            })
        }),
        setRemovePost : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    resolve("Success")
                } , 500)
            })
        }),
        setRemoveReply : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    resolve("Success")
                } , 500)
            })
        })
    },
    FAILURE : {
        setNewPost : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    reject(new Error("Mocked Error"))
                } , 500)
            })
        }),
        setNewReply : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    reject(new Error("Mocked Error"))
                } , 500)
            })
        }),
        setExistingPost : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    reject(new Error("Mocked Error"))
                } , 500)
            })
        }),
        setExistingReply : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    reject(new Error("Mocked Error"))
                } , 500)
            })
        }),
        setRemovePost : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    reject(new Error("Mocked Error"))
                } , 500)
            })
        }),
        setRemoveReply : vi.fn().mockImplementation(() => {
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    reject(new Error("Mocked Error"))
                } , 500)
            })
        })
    }
}

const MockedUsePost = {
    regular : {
        posts:  TEST_POST_LIST(10), 

        setNewPost: MockedUsePostFuncToTrack.SUCCESS.setNewPost , 
        setNewReply : MockedUsePostFuncToTrack.SUCCESS.setNewReply , 
    
        setExistingPost : MockedUsePostFuncToTrack.SUCCESS.setExistingPost ,
        setExistingReply : MockedUsePostFuncToTrack.SUCCESS.setExistingReply ,
    
        setExistingPostLikes : vi.fn() ,
        setExistingReplyLikes : vi.fn() ,
    
        setRemovePost : MockedUsePostFuncToTrack.SUCCESS.setRemovePost , 
        setRemoveReply : MockedUsePostFuncToTrack.SUCCESS.setRemoveReply ,
    
        hasMorePosts : false,
        totalPostsLength : POST_LIST_LENGTH ,
        postsOffset : 0,
        isError : false,
        setIsError : vi.fn(),
        loadNewPage : vi.fn()
    },
    operationFail : {
        posts:  TEST_POST_LIST(10), 

        setNewPost: MockedUsePostFuncToTrack.FAILURE.setNewPost , 
        setNewReply : MockedUsePostFuncToTrack.FAILURE.setNewReply , 
    
        setExistingPost : MockedUsePostFuncToTrack.FAILURE.setExistingPost ,
        setExistingReply : MockedUsePostFuncToTrack.FAILURE.setExistingReply ,
    
        setExistingPostLikes : vi.fn() ,
        setExistingReplyLikes : vi.fn() ,
    
        setRemovePost : MockedUsePostFuncToTrack.FAILURE.setRemovePost , 
        setRemoveReply : MockedUsePostFuncToTrack.FAILURE.setRemoveReply ,
    
        hasMorePosts : false,
        totalPostsLength : POST_LIST_LENGTH ,
        postsOffset : 0,
        isError : false,
        setIsError : vi.fn(),
        loadNewPage : vi.fn()
    }
}




describe("Manage Comment Tests" , () => {

    beforeAll(() => {
        usePost.mockImplementation(() => MockedUsePost.regular)
    })
    beforeEach(() => {
        mocked_setCommentStatus.mockClear()
    })

    describe("Manage Comment Send Tests" , () => {

        describe("Manage Comment Send Render" , () => {
            
            it("Should Render The Component Correctly" , () => {
                
                render(ManageComment_JSX.SEND)

                const profilePic = screen.queryByAltText("user-profile-picture")
                const sendBtn = screen.queryByText(OPERATION_TYPE.SEND)
                const inputField = screen.queryByPlaceholderText("Add A Comment...")

                expect(profilePic).toBeInTheDocument() && expect(profilePic).toHaveAttribute("src" , TEST_USER.image)
                expect(sendBtn).toBeInTheDocument()
                expect(inputField).toBeInTheDocument()
            })

        })

        describe("Manage Comment Send Functionality" , () => {

            it("Should Show Error When Message Is Empty" , async() => {

                const user = userEvent.setup()

                render(ManageComment_JSX.SEND)

                const sendBtn = screen.queryByText(OPERATION_TYPE.SEND)

                await user.click(sendBtn)

                expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()

            })

            it("Should Successfuly Show Loading Animation And Clear Input When User Preforming Succesful Send Operation" , async() => {
                
                const user = userEvent.setup()

                render(ManageComment_JSX.SEND)

                const sendBtn = screen.queryByText(OPERATION_TYPE.SEND)
                const inputField = screen.queryByPlaceholderText("Add A Comment...")
                
                await user.type(inputField , "Some-Content")

                await user.click(sendBtn)

                expect(screen.queryByTestId("Spinner")).toBeInTheDocument()

                await waitFor(() => expect(inputField.value).toBe(""))

            })

            describe("Request Error Handling" , () => {

                beforeAll(() => {
                    usePost.mockImplementation(() => MockedUsePost.operationFail)
                })

                afterAll(() => {
                    usePost.mockImplementation(() => MockedUsePost.regular)
                })

                it("Should Successulfy Show Loading Animation And Show Error When The Send Operation Failed" , async() => {
                    
                    const user = userEvent.setup()

                    render(ManageComment_JSX.SEND)
    
                    const sendBtn = screen.queryByText(OPERATION_TYPE.SEND)
                    const inputField = screen.queryByPlaceholderText("Add A Comment...")
                    
                    await user.type(inputField , "Some-Content")
    
                    await user.click(sendBtn)
    
                    expect(screen.queryByTestId("Spinner")).toBeInTheDocument()
    
                    await waitFor(() => expect(screen.queryByText("Mocked Modal")).toBeInTheDocument())

                })
            })

        })

    })

    describe("Manage Comment Edit Tests" , () => {

        describe("Manage Comment Edit Render" , () => {

            it("Should Render The Component Correctly (EDIT POST)" , () => {

                render(ManageComment_JSX.EDIT.TO_POST)

                expect(screen.queryByText(TEST_OWN_POST.content)).toBeInTheDocument()
                expect(screen.queryByText(OPERATION_TYPE.UPDATE)).toBeInTheDocument()
            })

            it("Should Render The Component Correctly (EDIT REPLY) " , () => {

                render(ManageComment_JSX.EDIT.TO_REPLY)

                expect(screen.queryByText(`@${TEST_OWN_REPLY.replyingTo} ${TEST_OWN_REPLY.content}`)).toBeInTheDocument()
                expect(screen.queryByText(OPERATION_TYPE.UPDATE)).toBeInTheDocument()
            })
        })

        describe("Manage Comment Edit Functionality" , () => {

            it("Should Show Error When Message Is Empty (EDIT POST)" , async() => {

                const user = userEvent.setup()

                render(ManageComment_JSX.EDIT.TO_POST)

                const updateBtn = screen.queryByText(OPERATION_TYPE.UPDATE)
                const inputField = screen.queryByRole("textbox")

                await user.clear(inputField)

                await user.click(updateBtn)

                expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()

            })

            it("Should Show Error When Message Is Empty (EDIT REPLY)" , async() => {

                const user = userEvent.setup()

                render(ManageComment_JSX.EDIT.TO_REPLY)

                const updateBtn = screen.queryByText(OPERATION_TYPE.UPDATE)
                const inputField = screen.queryByRole("textbox")

                await user.clear(inputField)

                await user.click(updateBtn)

                expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()

            })

            it("Should Successfuly Show Loading Animation And Clear Input When User Preforming Succesful Edit Operation (EDIT POST)" , async() => {

                const user = userEvent.setup()

                render(ManageComment_JSX.EDIT.TO_POST)

                const updateBtn = screen.queryByText(OPERATION_TYPE.UPDATE)
                const inputField = screen.queryByRole("textbox")

                await user.type(inputField , "Some Updated Text")

                await user.click(updateBtn)

                expect(screen.queryByTestId("Spinner")).toBeInTheDocument()

                await waitFor(() => {expect(mocked_setCommentStatus).toBeCalledTimes(1)})

            })

            it("Should Successfuly Show Loading Animation And Clear Input When User Preforming Succesful Edit Operation (EDIT REPLY)" , async() => {

                const user = userEvent.setup()

                render(ManageComment_JSX.EDIT.TO_REPLY)

                const updateBtn = screen.queryByText(OPERATION_TYPE.UPDATE)
                const inputField = screen.queryByRole("textbox")

                await user.type(inputField , "Some Updated Text")

                await user.click(updateBtn)

                expect(screen.queryByTestId("Spinner")).toBeInTheDocument()

                await waitFor(() => {expect(mocked_setCommentStatus).toBeCalledTimes(1)})
            })

            describe("Request Error Handling" , () => {

                beforeAll(() => {
                    usePost.mockImplementation(() => MockedUsePost.operationFail)
                })

                afterAll(() => {
                    usePost.mockImplementation(() => MockedUsePost.regular)
                })

                it("Should Successulfy Show Loading Animation And Show Error When The Edit Operation Failed (EDIT POST)" , async() => {

                    const user = userEvent.setup()

                    render(ManageComment_JSX.EDIT.TO_POST)
    
                    const updateBtn = screen.queryByText(OPERATION_TYPE.UPDATE)
                    const inputField = screen.queryByRole("textbox")
    
                    await user.type(inputField , "Some Updated Text")
    
                    await user.click(updateBtn)
    
                    expect(screen.queryByTestId("Spinner")).toBeInTheDocument()
    
                    await waitFor(() => {expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()})
                })
    
                it("Should Successulfy Show Loading Animation And Show Error When The Edit Operation Failed (EDIT REPLY)" , async() => {
    
                    const user = userEvent.setup()

                    render(ManageComment_JSX.EDIT.TO_REPLY)
    
                    const updateBtn = screen.queryByText(OPERATION_TYPE.UPDATE)
                    const inputField = screen.queryByRole("textbox")
    
                    await user.type(inputField , "Some Updated Text")
    
                    await user.click(updateBtn)
    
                    expect(screen.queryByTestId("Spinner")).toBeInTheDocument()
    
                    await waitFor(() => {expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()})
                })
            })
        })
    })

    describe("Manage Comment Reply Tests" , () => {

        describe("Manage Comment Reply Render" , () => {

            it("Should Render The Component Correctly (REPLY POST)" , () => {

                render(ManageComment_JSX.REPLY)

                const profilePic = screen.queryByAltText("user-profile-picture")
                const replyBtn = screen.queryByText(OPERATION_TYPE.REPLY)
                const inputField = screen.queryByText(`@${TEST_OWN_POST.writer.username}`)

                expect(profilePic).toBeInTheDocument() && expect(profilePic).toHaveAttribute("src" , TEST_USER.image)
                expect(replyBtn).toBeInTheDocument()
                expect(inputField).toBeInTheDocument() 
            })

        })

        describe("Manage Comment Reply Functionality" , () => {

            it("Should Show Error When Message Is Empty (REPLY POST)" , async() => {

                const user = userEvent.setup()

                render(ManageComment_JSX.REPLY)

                const replyBtn = screen.queryByText(OPERATION_TYPE.REPLY)

                await user.click(replyBtn)

                expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()

            })


            it("Should Successfuly Show Loading Animation And Clear Input When User Preforming Succesful Reply Operation (REPLY POST)" , async() => {

                const user = userEvent.setup()

                render(ManageComment_JSX.REPLY)

                const replyBtn = screen.queryByText(OPERATION_TYPE.REPLY)
                const inputField = screen.queryByText(`@${TEST_OWN_POST.writer.username}`)

                await user.type(inputField , `some-reply-text`)
                await user.click(replyBtn)

                expect(screen.queryByTestId("Spinner")).toBeInTheDocument()

                await waitFor(() => expect(mocked_setCommentStatus).toBeCalledTimes(1))

            })
            

            describe("Request Error Handling" , () => {
                
                beforeAll(() => {
                    usePost.mockImplementation(() => MockedUsePost.operationFail)
                })

                afterAll(() => {
                    usePost.mockImplementation(() => MockedUsePost.regular)
                })

                it("Should Successulfy Show Loading Animation And Show Error When The Reply Operation Failed (REPLY POST)" , async() => {

                    const user = userEvent.setup()

                    render(ManageComment_JSX.REPLY)
    
                    const replyBtn = screen.queryByText(OPERATION_TYPE.REPLY)
                    const inputField = screen.queryByText(`@${TEST_OWN_POST.writer.username}`)
    
                    await user.type(inputField , `some-reply-text`)
                    await user.click(replyBtn)
    
                    expect(screen.queryByTestId("Spinner")).toBeInTheDocument()
    
                    await waitFor(() => expect(screen.queryByText("Mocked Modal")).toBeInTheDocument())
                    expect(mocked_setCommentStatus).toBeCalledTimes(0)

                })
                
            } )

        })
    })

    describe("Manage Comment Delete Tests" , () => {

        describe("Manage Comment Delete Render" , () => {

            it("Should Render The Component Correctly" , () => {
                
                render(ManageComment_JSX.DELETE)

                expect(screen.queryByText("Mocked Modal")).toBeInTheDocument()
                
            })
        })
    })
})