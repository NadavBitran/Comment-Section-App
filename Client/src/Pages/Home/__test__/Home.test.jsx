import {beforeAll, describe , expect , it , vi} from 'vitest';
import {userEvent} from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils';
import Home from "../Home";
import { useUser } from '../../../Hooks/useUser';

import { TEST_USER } from '../../../FakeData';
import { BrowserRouter as Router } from 'react-router-dom'; 

vi.mock("../../../Hooks/useUser")


// Integration Tests (User is mocked, Link tag is not)
describe("Home Render" , () => {
    
    describe("Tests When user details saved in client's browser" , () => {

        it("Should render correctly the Home Page when user saved in client's browser" , () => {

            render(
                <Router>
                    <Home />
                </Router>)
        
                const titleElement = screen.queryByText('Interactive Comment Section')
                const continueLink = screen.queryByText(`Continue as ${TEST_USER.username}`)
        
                expect(titleElement).toBeInTheDocument()
                expect(continueLink).toBeInTheDocument()
        })     
    })

    describe("Tests When user details isn't saved in client's browser" , () => {

        beforeAll(() => {
            useUser.mockImplementation(() => ({
                user: null,
                signupUser: vi.fn(),
                signinUser: vi.fn(),
                signoutUser: vi.fn(),
            }))
        })

        it("Should render correctly the Home Page when user isn't saved in client's browser" , () => {
            
            render(
                <Router>
                    <Home />
                </Router>)
        
                const titleElement = screen.queryByText('Interactive Comment Section')
                const continueLink = screen.queryByText(`Continue as ${TEST_USER.username}`)
        
                expect(titleElement).toBeInTheDocument()
                expect(continueLink).not.toBeInTheDocument()
        })
    })

})