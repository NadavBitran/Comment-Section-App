import {beforeAll, beforeEach, describe , expect , it} from 'vitest';
import userEvent, { UserEvent  } from '@testing-library/user-event';
import {waitFor} from '@testing-library/react';
import { render, screen , act} from '../../../../test-utils';
import Contact from "../Contact";
import { useUser } from '../../../Hooks/useUser';


import {API} from "../../../Api/index"
import MockAdapter from "axios-mock-adapter";

import {CONTACT_SUBJECT } from "../Constants/constants"
import { TEST_USER } from '../../../FakeData';
import { END_POINT_EMAIL_POST } from '../../../GlobalConstants/endPointConstants';
import avatarImageTest from "/images/AvatarTest.png"


vi.mock("../../../Hooks/useUser")
vi.mock("../../../Components/InfoCard/InfoCard")



describe("Contact Tests" , () => {
    let axiosMock;

    beforeAll(() => {
        axiosMock = new MockAdapter(API)

        axiosMock.onPost(END_POINT_EMAIL_POST()).reply(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([200, { message: 'Success' }]);
              }, 1000);
            });
          });
    })

    describe("Contact Render" , () => {

        it("renders Contact page correctly" , () => {
            render(<Contact/>)

            const firstNameElement = screen.getByLabelText('First name*')
            const lastNameElement = screen.getByLabelText('Last name*')
            const emailElement = screen.getByLabelText('Email*')
            const subjectElement = screen.getByLabelText('Subject*')
            const descElement = screen.getByLabelText('Description*')
            const fileElement = screen.getByTestId("File")

            const submissionForm = screen.queryByText(/"Thank you!"/i)
            const errorMessage = screen.getByTestId("errorLabel")

            expect(firstNameElement).toBeInTheDocument()
            expect(lastNameElement).toBeInTheDocument()
            expect(emailElement).toBeInTheDocument()
            expect(subjectElement).toBeInTheDocument()
            expect(descElement).toBeInTheDocument()
            expect(fileElement).toBeInTheDocument()
            expect(submissionForm).not.toBeInTheDocument()
            expect(errorMessage).not.toHaveClass("show")

        })

        it("should fill Form data while user logged-in" , () => {
            render(<Contact/>)

            const firstNameElement = screen.getByLabelText('First name*')
            const lastNameElement = screen.getByLabelText('Last name*')
            const emailElement = screen.getByLabelText('Email*')

            expect(firstNameElement).toHaveValue(TEST_USER.firstname)
            expect(lastNameElement).toHaveValue(TEST_USER.lastname)
            expect(emailElement).toHaveValue(TEST_USER.email)
        })
    })
    
    describe("Contact Functionality" , () => {

        describe("Contact Functionality with user logged-in" , () => {


            it("should set Contact Option when user clicks on cards title" , () => {
                // Integration functionality
            })

            it("should check flow of form submission after correct user inputs including loading spinner animation and thank you form" , async() => {
            

                const user = userEvent.setup()

                render(<Contact/>)

                const descElement = screen.getByLabelText('Description*')
                const submission = screen.getByRole("button")

                await user.type(descElement , "some text")
                
                await user.click(submission)


                expect(screen.getByTestId("errorLabel")).not.toHaveClass("show")
                expect(screen.queryByTestId("Spinner")).toBeInTheDocument()

                await waitFor(() => expect(screen.queryByText(/Thank you!/i)).toBeInTheDocument())

                expect(screen.queryByTestId("Spinner")).not.toBeInTheDocument()
            })



        })
    
        describe("Contact Functioality without user logged-in" , () => {

            beforeAll(() => {
                useUser.mockImplementation(() => ({
                    user: null,
                    signupUser: vi.fn(),
                    signinUser: vi.fn(),
                    signoutUser: vi.fn(),
                }))
            })

            it("should show error message if field empty" , async() => {
    
                const user = userEvent.setup()
                
                render(<Contact/>)

                const lastNameElement = screen.getByLabelText('Last name*')
                const emailElement = screen.getByLabelText('Email*')
                const subjectElement = screen.getByLabelText('Subject*')
                const descElement = screen.getByLabelText('Description*')
                const fileElement = screen.getByTestId("File")
                const submission = screen.getByRole("button")
    
                await user.type(lastNameElement , TEST_USER.lastname)
                await user.type(emailElement , TEST_USER.email)
                await user.type(subjectElement , CONTACT_SUBJECT.GENERAL)
                await user.type(descElement , "some text")
                await user.upload(fileElement , new File(['fake file content'] , avatarImageTest))

                await user.click(submission)

                const errorMessage = screen.getByTestId("errorLabel")

                expect(errorMessage).toHaveClass("show")
                expect(errorMessage).toHaveTextContent(/^.+$/i)
            })

            it("should show error message if desc is huge (above 200 letters)" , async() => {
                const user = userEvent.setup()
                
                render(<Contact/>)

                const firstNameElement = screen.getByLabelText('First name*')
                const lastNameElement = screen.getByLabelText('Last name*')
                const emailElement = screen.getByLabelText('Email*')
                const subjectElement = screen.getByLabelText('Subject*')
                const descElement = screen.getByLabelText('Description*')
                const submission = screen.getByRole("button")

                await user.type(firstNameElement , TEST_USER.firstname)
                await user.type(lastNameElement , TEST_USER.lastname)
                await user.type(emailElement , TEST_USER.email)
                await user.type(subjectElement , CONTACT_SUBJECT.GENERAL)
                await user.type(descElement , "A".repeat(201))
                
                await user.click(submission)

                const errorMessage = screen.getByTestId("errorLabel")

                expect(errorMessage).toHaveClass("show")
                expect(errorMessage).toHaveTextContent(/^.+$/i)
            })

            it("shows show error message if email structure is false" , async() => {
                const user = userEvent.setup()
                
                render(<Contact/>)

                const firstNameElement = screen.getByLabelText('First name*')
                const lastNameElement = screen.getByLabelText('Last name*')
                const emailElement = screen.getByLabelText('Email*')
                const subjectElement = screen.getByLabelText('Subject*')
                const descElement = screen.getByLabelText('Description*')
                const submission = screen.getByRole("button")

                await user.type(firstNameElement , TEST_USER.firstname)
                await user.type(lastNameElement , TEST_USER.lastname)
                await user.type(emailElement , "email@gmail,com")
                await user.type(subjectElement , CONTACT_SUBJECT.GENERAL)
                await user.type(descElement , "some text")
                
                await user.click(submission)

                const errorMessage = screen.getByTestId("errorLabel")

                expect(errorMessage).toHaveClass("show")
                expect(errorMessage).toHaveTextContent(/^.+$/i)
            })
        })

    
    })
})
