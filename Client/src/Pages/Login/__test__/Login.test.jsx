import { TEST_USER } from '../../../FakeData';
import {beforeAll, beforeEach, describe , expect , it , vi} from 'vitest';
import {waitFor} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils';
import Login from "../Login";
import { useUser } from '../../../Hooks/useUser';

import { mockNavigator } from '../../../Hooks/mocks/navigate';


const userMocksToTrack = {
    mockSuccess: {
        signUpSuccess: vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(null), 1000);
            });
        }),
        signInSuccess: vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(null), 1000);
            });
        }),
        signOutSuccess: vi.fn(),
    },
    mockFail: {
        signUpFail: vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve("Something Went Wrong."), 1000);
            });
        }),
        signInFail: vi.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve("Something Went Wrong." ), 1000);
            });
        }),
        signOutFail: vi.fn(),
    },
};


vi.mock('react-router-dom')
vi.mock('../../../Hooks/useUser')


describe("Login Tests" , () => {

    beforeAll(() => {
        useUser.mockImplementation(() => ({
            user: TEST_USER,
            signupUser: userMocksToTrack.mockSuccess.signUpSuccess,
            signinUser: userMocksToTrack.mockSuccess.signInSuccess,
            signoutUser: userMocksToTrack.mockSuccess.signOutSuccess
        }))
    })

    beforeEach(() => {
        mockNavigator.mockClear()
    })

    describe("Login Render" , () => {
        
        it("Should render Login Page correctly" , () => {
            render(<Login />)

            const titleElement = screen.getByTestId("login__title")
            const firstNameInput = screen.queryByPlaceholderText(/First Name/i)
            const emailInput = screen.getByPlaceholderText(/Email/i)
            const passInput = screen.getByPlaceholderText(/Password/i)
            const errorLbl = screen.getByTestId("errorLabel")
            const switchToSignUp = screen.getByText(/Don't have an account?/i)

            expect(titleElement).toBeInTheDocument()
            expect(firstNameInput).not.toBeInTheDocument()
            expect(emailInput).toBeInTheDocument()
            expect(passInput).toBeInTheDocument()
            expect(errorLbl).not.toHaveClass("show")
            expect(switchToSignUp).toBeInTheDocument()
        })
    })

    
    describe("Login Functionality" , () => {

        it("Should try to signout user on initial" , () => {
            render(<Login />)

            expect(userMocksToTrack.mockSuccess.signOutSuccess).toBeCalled()
        })  

        it("Should move between login signup options while the user wants and back" , async() => {
            const user = userEvent.setup()

            render(<Login />)

            let titleElement , firstNameInput;

            const loginToSignup = screen.getByTestId("switch-signUp")

            await user.click(loginToSignup)

            const switchToSignIn = screen.getByText(/Already have an account?/i)
            firstNameInput = screen.queryByPlaceholderText(/First Name/i)
            titleElement = screen.getByTestId("login__title")
            
            expect(switchToSignIn).toBeInTheDocument()
            expect(firstNameInput).toBeInTheDocument()
            expect(titleElement).toHaveTextContent("Sign Up")

            const signupToLogin = screen.getByTestId("switch-signIn")

            await user.click(signupToLogin)

            const switchToSignUp = screen.getByText(/Don't have an account?/i)
            firstNameInput = screen.queryByPlaceholderText(/First Name/i)
            titleElement = screen.getByTestId("login__title")

            expect(switchToSignUp).toBeInTheDocument()
            expect(firstNameInput).not.toBeInTheDocument()
            expect(titleElement).toHaveTextContent("Sign In")

        })

        describe("Should set errors according to user inputs in login & signup forms" , () => {
            
            it("Should return error when one of the field is empty" , async() => {

                const user = userEvent.setup()

                render(<Login />)

                const passElement  = screen.getByPlaceholderText(/Password/i)
                const submission = screen.getByRole("button")
                const errorLbl = screen.getByTestId("errorLabel")

                await user.type(passElement , "@Somthing123")

                await user.click(submission)


                expect(errorLbl).toHaveClass("show")
                expect(errorLbl).toHaveTextContent("Please fill out all required fields.")
            })

            it("Should return error when email isnt valid" , async() => {
                
                const user = userEvent.setup()

                render(<Login />)

                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement  = screen.getByPlaceholderText(/Password/i)
                const submission = screen.getByRole("button")
                const errorLbl = screen.getByTestId("errorLabel")

                await user.type(emailElement , "email@gmail,com")
                await user.type(passElement , "@Somthing123")

                await user.click(submission)


                expect(errorLbl).toHaveClass("show")
                expect(errorLbl).toHaveTextContent("Please fill out an existing email.")
            })

        })

        describe("Should set errors according to user inputs in signup form" , () => {

            it("Should return error when username is less then 3 letters" , async() => {

                const user = userEvent.setup()

                render(<Login />)

                const loginToSignup = screen.getByTestId("switch-signUp")

                await user.click(loginToSignup)

                const firstNameElement = screen.getByPlaceholderText(/First Name/i)
                const lastNameElement = screen.getByPlaceholderText(/Last Name/i)
                const userNameElement = screen.getByPlaceholderText(/User Name/i)
                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement = screen.getByPlaceholderText("Password *: maxblagun123@MB")
                const cnfPassElement = screen.getByPlaceholderText(/Repeat Password/i)
                const submission = screen.getByRole("button")
                const errorLbl = screen.getByTestId("errorLabel")

                await user.type(firstNameElement , "jo")
                await user.type(lastNameElement , "abraham")
                await user.type(userNameElement , "jo")
                await user.type(emailElement , "jo123@gmail.com")
                await user.type(passElement , "@Jo123456")
                await user.type(cnfPassElement , "@Jo123456")

                await user.click(submission)

                expect(errorLbl).toHaveClass("show")
                expect(errorLbl).toHaveTextContent("Username has to be at least 3 letters")
            })

            it("Should return error when password doesn't match require criteria" , async() => {
                const user = userEvent.setup()

                render(<Login />)

                const loginToSignup = screen.getByTestId("switch-signUp")

                await user.click(loginToSignup)

                const firstNameElement = screen.getByPlaceholderText(/First Name/i)
                const lastNameElement = screen.getByPlaceholderText(/Last Name/i)
                const userNameElement = screen.getByPlaceholderText(/User Name/i)
                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement = screen.getByPlaceholderText("Password *: maxblagun123@MB")
                const cnfPassElement = screen.getByPlaceholderText(/Repeat Password/i)
                const submission = screen.getByRole("button")
                const errorLbl = screen.getByTestId("errorLabel")

                await user.type(firstNameElement , "jo")
                await user.type(lastNameElement , "abraham")
                await user.type(userNameElement , "joabarahm123")
                await user.type(emailElement , "jo123@gmail.com")
                await user.type(passElement , "@jo123456")
                await user.type(cnfPassElement , "@Jo123456")

                await user.click(submission)

                expect(errorLbl).toHaveClass("show")
                expect(errorLbl).toHaveTextContent(/Your password must meet the following criteria/i)
            })

            it("Should return error when confrim password doesn't match prev password" , async() => {
                const user = userEvent.setup()

                render(<Login />)

                const loginToSignup = screen.getByTestId("switch-signUp")

                await user.click(loginToSignup)

                const firstNameElement = screen.getByPlaceholderText(/First Name/i)
                const lastNameElement = screen.getByPlaceholderText(/Last Name/i)
                const userNameElement = screen.getByPlaceholderText(/User Name/i)
                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement = screen.getByPlaceholderText("Password *: maxblagun123@MB")
                const cnfPassElement = screen.getByPlaceholderText(/Repeat Password/i)
                const submission = screen.getByRole("button")
                const errorLbl = screen.getByTestId("errorLabel")

                await user.type(firstNameElement , "jo")
                await user.type(lastNameElement , "abraham")
                await user.type(userNameElement , "joabarahm123")
                await user.type(emailElement , "jo123@gmail.com")
                await user.type(passElement , "@Jo123456")
                await user.type(cnfPassElement , "@Jo12345")

                await user.click(submission)

                expect(errorLbl).toHaveClass("show")
                expect(errorLbl).toHaveTextContent(/Passwords do not match. Please try again./i)
            })
        })

        describe("Should perform user flow of success signin and signup" , () => {
            it("Should perform user flow of succesful sign in" , async() => {
                const user = userEvent.setup()

                render(<Login />)
    
                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement = screen.getByPlaceholderText("Password *: maxblagun123@MB")
                const submission = screen.getByRole("button")
    
                await user.type(emailElement , "jo123@gmail.com")
                await user.type(passElement , "@Jo123456")
    
                await user.click(submission)
    
                const spinnerAnimation = screen.getByTestId("Spinner")
                expect(spinnerAnimation).toBeInTheDocument()

                await waitFor(() => expect(mockNavigator).toBeCalledTimes(1))
            })

            it("Should preform user flow of succesful sign up" , async() => {
                const user = userEvent.setup()

                render(<Login />)

                const loginToSignup = screen.getByTestId("switch-signUp")

                await user.click(loginToSignup)
    
                const firstNameElement = screen.getByPlaceholderText(/First Name/i)
                const lastNameElement = screen.getByPlaceholderText(/Last Name/i)
                const userNameElement = screen.getByPlaceholderText(/User Name/i)
                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement = screen.getByPlaceholderText("Password *: maxblagun123@MB")
                const cnfPassElement = screen.getByPlaceholderText(/Repeat Password/i)
                const submission = screen.getByRole("button")
    
                await user.type(firstNameElement , "jo")
                await user.type(lastNameElement , "abraham")
                await user.type(userNameElement , "joabarahm123")
                await user.type(emailElement , "jo123@gmail.com")
                await user.type(passElement , "@Jo123456")
                await user.type(cnfPassElement , "@Jo123456")
    
                await user.click(submission)
    
                const spinnerAnimation = screen.getByTestId("Spinner")
                expect(spinnerAnimation).toBeInTheDocument()

                await waitFor(() => expect(mockNavigator).toBeCalledTimes(1))
            })

        })

        describe("Should preform a user flow of failed signin and signup attemts" , () => {
            
            
            beforeAll(() => {
                useUser.mockImplementation(() => ({
                    user: TEST_USER,
                    signupUser: userMocksToTrack.mockFail.signUpFail,
                    signinUser: userMocksToTrack.mockFail.signInFail,
                    signoutUser: userMocksToTrack.mockFail.signOutFail
                }))
            })

            it("Should preform flow user flow of failed sign in " , async () =>{
                const user = userEvent.setup()

                render(<Login />)
    
                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement = screen.getByPlaceholderText("Password *: maxblagun123@MB")
                const submission = screen.getByRole("button")
    
                await user.type(emailElement , "jo123@gmail.com")
                await user.type(passElement , "@Jo123456")
    
                await user.click(submission)
    
                const spinnerAnimation = screen.getByTestId("Spinner")
                expect(spinnerAnimation).toBeInTheDocument()

                await waitFor(() => {
                    expect(mockNavigator).toBeCalledTimes(0)
                    expect(screen.getByTestId("errorLabel")).toHaveClass("show")
                    expect(screen.getByTestId("errorLabel")).toHaveTextContent("Something Went Wrong.")
                })
            })

            it("Should preform flow user of failed sign up" , async () => {
                const user = userEvent.setup()

                render(<Login />)

                const loginToSignup = screen.getByTestId("switch-signUp")

                await user.click(loginToSignup)
    
                const firstNameElement = screen.getByPlaceholderText(/First Name/i)
                const lastNameElement = screen.getByPlaceholderText(/Last Name/i)
                const userNameElement = screen.getByPlaceholderText(/User Name/i)
                const emailElement = screen.getByPlaceholderText(/Email/i)
                const passElement = screen.getByPlaceholderText("Password *: maxblagun123@MB")
                const cnfPassElement = screen.getByPlaceholderText(/Repeat Password/i)
                const submission = screen.getByRole("button")
    
                await user.type(firstNameElement , "jo")
                await user.type(lastNameElement , "abraham")
                await user.type(userNameElement , "joabarahm123")
                await user.type(emailElement , "jo123@gmail.com")
                await user.type(passElement , "@Jo123456")
                await user.type(cnfPassElement , "@Jo123456")
    
                await user.click(submission)
    
                const spinnerAnimation = screen.getByTestId("Spinner")
                expect(spinnerAnimation).toBeInTheDocument()

                await waitFor(() => {
                    expect(mockNavigator).toBeCalledTimes(0)
                    expect(screen.getByTestId("errorLabel")).toHaveClass("show")
                    expect(screen.getByTestId("errorLabel")).toHaveTextContent("Something Went Wrong.")
                })
            })
        })
        

        it("Should hide show user password when user clicks on visiblility icon" , async() => {
            const user = userEvent.setup()

            render(<Login />)

            const passwordIcon = screen.getByTestId("passwordIcon")

            const passElement = screen.getByPlaceholderText(/Password/i)

            await user.type(passElement , "something")

            expect(passElement).toHaveAttribute('type','password')

            await user.click(passwordIcon)

            expect(passElement).toHaveAttribute('type','text')
        })
    })
})
