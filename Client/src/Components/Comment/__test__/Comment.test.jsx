import { 
    TEST_USER ,
    TEST_OWN_POST,
    TEST_OWN_REPLY,
    TEST_OTHER_POST,
    TEST_OTHER_REPLY } from '../../../FakeData';

import { MAIN_ROUTES } from '../../../GlobalConstants/globalConstants';

import {describe , expect , it , vi} from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils';
import Comment from "../Comment";

import { mockNavigator } from '../../../Hooks/mocks/navigate';



vi.mock('react-router-dom');
vi.mock("../../../Pages/CommentSection/Components/ManageComment/ManageComment");
vi.mock('../../../Hooks/useUser');
vi.mock("../../../Hooks/usePost.jsx");


 const ownPostJSX = <Comment 
 type = {TEST_OWN_POST.type}
 converationId={TEST_OWN_POST.conversationId}
 content={TEST_OWN_POST.content}
 createdAt={TEST_OWN_POST.createdAt}
 score={TEST_OWN_POST.score}
 likes={TEST_OWN_POST.likes}
 dislikes={TEST_OWN_POST.dislikes}
 writer={TEST_OWN_POST.writer}
 />

 const ownReplyJSX = <Comment 
 type = {TEST_OWN_REPLY.type}
 converationId={TEST_OWN_REPLY.conversationId}
 content={TEST_OWN_REPLY.content}
 createdAt={TEST_OWN_REPLY.createdAt}
 score={TEST_OWN_REPLY.score}
 likes={TEST_OWN_REPLY.likes}
 dislikes={TEST_OWN_REPLY.dislikes}
 writer={TEST_OWN_REPLY.writer}
 replyingTo={TEST_OWN_REPLY.replyingTo}
 replyId={TEST_OWN_REPLY.replyId}
 />

 const otherPostJSX = <Comment 
 type = {TEST_OTHER_POST.type}
 converationId={TEST_OTHER_POST.conversationId}
 content={TEST_OTHER_POST.content}
 createdAt={TEST_OTHER_POST.createdAt}
 score={TEST_OTHER_POST.score}
 likes={TEST_OTHER_POST.likes}
 dislikes={TEST_OTHER_POST.dislikes}
 writer={TEST_OTHER_POST.writer}
 />

 const otherReplyJSX = <Comment 
 type = {TEST_OTHER_REPLY.type}
 converationId={TEST_OTHER_REPLY.conversationId}
 content={TEST_OTHER_REPLY.content}
 createdAt={TEST_OTHER_REPLY.createdAt}
 score={TEST_OTHER_REPLY.score}
 likes={TEST_OTHER_REPLY.likes}
 dislikes={TEST_OTHER_REPLY.dislikes}
 writer={TEST_OTHER_REPLY.writer}
 replyingTo={TEST_OTHER_REPLY.replyingTo}
 replyId={TEST_OTHER_REPLY.replyId}
 />


describe("Comment Render" , () => {

    it("renders the Comment Component own post" , () => {
        render(ownPostJSX)

                const ownTagElement = screen.queryByText(/you/i)
                const deleteOptionElement = screen.queryByText(/Delete/i)
                const editOptionElement = screen.queryByText(/Edit/i)
                const replyOptionElement = screen.queryByText(/Reply/i)
        
                expect(ownTagElement).toBeInTheDocument()
                expect(deleteOptionElement).toBeInTheDocument()
                expect(editOptionElement).toBeInTheDocument()
                expect(replyOptionElement).not.toBeInTheDocument()

    })

    it("renders the Comment Component own reply" , () => {
        render(ownReplyJSX)

            const ownTagElement = screen.queryByText(/you/i)
            const deleteOptionElement = screen.queryByText(/Delete/i)
            const editOptionElement = screen.queryByText(/Edit/i)
            const replyOptionElement = screen.queryByText(/Reply/i)
    
            expect(ownTagElement).toBeInTheDocument()
            expect(deleteOptionElement).toBeInTheDocument()
            expect(editOptionElement).toBeInTheDocument()
            expect(replyOptionElement).not.toBeInTheDocument()
    })

    it("renders the Comment Component regular post" , () => {
        render(otherPostJSX)

            const ownTagElement = screen.queryByText(/you/i)
            const deleteOptionElement = screen.queryByText(/Delete/i)
            const editOptionElement = screen.queryByText(/Edit/i)
            const replyOptionElement = screen.queryByText(/Reply/i)
    
            expect(ownTagElement).not.toBeInTheDocument()
            expect(deleteOptionElement).not.toBeInTheDocument()
            expect(editOptionElement).not.toBeInTheDocument()
            expect(replyOptionElement).toBeInTheDocument()
    })

    it("renders the Comment Component regular reply" , () => {
        render(otherReplyJSX)

            const ownTagElement = screen.queryByText(/you/i)
            const deleteOptionElement = screen.queryByText(/Delete/i)
            const editOptionElement = screen.queryByText(/Edit/i)
            const replyOptionElement = screen.queryByText(/Reply/i)
    
            expect(ownTagElement).not.toBeInTheDocument()
            expect(deleteOptionElement).not.toBeInTheDocument()
            expect(editOptionElement).not.toBeInTheDocument()
            expect(replyOptionElement).toBeInTheDocument()
    })

})

describe("Comment Functionality" , () => {

    it("enables reply to post" , async () => {

        const user = userEvent.setup()

        render(otherPostJSX)
        
        const replyOptionElement = screen.getByText(/Reply/i)

        await user.click(replyOptionElement)

        const replyBox = screen.getByTestId("mocked-manage-comment")

        expect(replyBox).toBeInTheDocument()
    })

    it("enables reply to reply" , async () => {
        const user = userEvent.setup()

        render(otherReplyJSX)
        
        const replyOptionElement = screen.getByText(/Reply/i)

        await user.click(replyOptionElement)

        const replyBox = screen.getByTestId("mocked-manage-comment")

        expect(replyBox).toBeInTheDocument()
    })

    it("enables delete to post " , async() => {
        const user = userEvent.setup()

        render(ownPostJSX)
        
        const deleteOptionElement = screen.getByText(/Delete/i)

        await user.click(deleteOptionElement)

        const deleteBox = screen.getByTestId("mocked-manage-comment")

        expect(deleteBox).toBeInTheDocument()
    })

    it("enables delete to reply" , async() => {
        const user = userEvent.setup()

        render(ownReplyJSX)
        
        const deleteOptionElement = screen.getByText(/Delete/i)

        await user.click(deleteOptionElement)

        const deleteBox = screen.getByTestId("mocked-manage-comment")

        expect(deleteBox).toBeInTheDocument()
    })

    it("enables editing to post" , async() => {
        const user = userEvent.setup()

        render(ownPostJSX)
        
        const editOptionElement = screen.getByText(/Edit/i)

        await user.click(editOptionElement)

        const editBox = screen.getByTestId("mocked-manage-comment")

        expect(editBox).toBeInTheDocument()
    })

    it("enables editing to reply" , async() => {
        const user = userEvent.setup()

        render(ownReplyJSX)
        
        const editOptionElement = screen.getByText(/Edit/i)

        await user.click(editOptionElement)

        const editBox = screen.getByTestId("mocked-manage-comment")

        expect(editBox).toBeInTheDocument()
    })

    it("should enable request switching to profile page by clicking on comment's title" , async() => {
        const user = userEvent.setup()

        render(ownPostJSX)

        const titleElement = screen.getByText(TEST_USER.username)

        await user.click(titleElement)

        expect(mockNavigator).toHaveBeenCalledTimes(1)
        expect(mockNavigator).toHaveBeenCalledWith(MAIN_ROUTES.PROFILE.replace(":id" , TEST_USER._id))
    })
})

