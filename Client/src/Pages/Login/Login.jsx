import {useState , useEffect , useRef} from 'react';
import {useNavigate} from 'react-router-dom';

import {MAIN_ROUTES} from "../../GlobalConstants/globalConstants";
import {LOGIN_METHOD} from "./Constants/constants"

import hidePasswordIcon from "/images/password-hide.png"
import showPasswordIcon from "/images/password-show.png"

import { useUser  } from '../../Hooks/useUser';

import "./Login.scss";



/*
    @breif: This is the login page, contains:
            - option to log-in 
            - option to sign-up
*/
function Login(){

    const [loginMethod , setLoginMethod] = useState(LOGIN_METHOD.SIGNIN)
    const [isLoading ,setIsLoading] = useState(false)
    const [imageBase64 , setImageBase64] = useState(null)
    const navigate = useNavigate()

    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const emailRef = useRef(null)
    const userNameRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const errorRef = useRef(null)

    const {signupUser , signinUser , signoutUser } = useUser()

    useEffect(() => {
        signoutUser()
    } , [])


    let logInfo;

    const handleFileChoosen = (event) => {
        const file = event.target.files[0]

        if(file){
            const reader = new FileReader()

            reader.onloadend = () => {
                const base64 = reader.result
                setImageBase64(base64)
            }

            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!handleClientValidation()) return


        setIsLoading(true)

        let errorAnswer;

        try{

            switch(loginMethod){
                case LOGIN_METHOD.SIGNUP:
                    logInfo = {
                        'usertype' : 'regular' ,
                        'firstname' : firstNameRef.current.value ,
                        'lastname' : lastNameRef.current.value ,
                        'email' : emailRef.current.value ,
                        'username' : userNameRef.current.value ,
                        'password' : passwordRef.current.value ,
                        'image' : imageBase64
                    }
                    errorAnswer = await signupUser(logInfo)
                    if(errorAnswer){
                        errorRef.current.innerHTML = errorAnswer
                        errorRef.current.classList.add("show")
                    }
                    else navigate(MAIN_ROUTES.COMMENT_SECTION)
                    break;
                case LOGIN_METHOD.SIGNIN:
                    logInfo = {
                        'usertype' : 'regular' ,
                        'email' : emailRef.current.value ,
                        'password' : passwordRef.current.value 
                    }
                    errorAnswer = await signinUser(logInfo)
                    if(errorAnswer){
                        errorRef.current.innerHTML = errorAnswer
                        errorRef.current.classList.add("show")
                    }
                    else navigate(MAIN_ROUTES.COMMENT_SECTION)
                    break;
            }
        }
        catch(error){
            AddErrorSign()
            errorRef.current.innerHTML = "Something Went Wrong."
            errorRef.current.classList.add("show")
        }
        finally{
            setIsLoading(false)
        }

    }

    const handlePasswordToggle = (e , ref) => {
        if(ref.current.type === "password")
        {
            ref.current.type = "text"
            e.target.src = showPasswordIcon
        }
        else{
            ref.current.type = "password"
            e.target.src = hidePasswordIcon
        }
    }

    const AddErrorSign = (ref) => {
        !ref.current.classList.contains("errorInput") && ref.current.classList.add("errorInput")
    }

    const handleClientValidation = () => {
        
        let res = true



        const validateEmpty = (ref) => {
            if(ref.current && ref.current.value.trim() === ""){
                AddErrorSign(ref)
                res = false
            }
        }
        const validateUsername = () => {
            if(userNameRef.current && userNameRef.current.value.length < 3){
                AddErrorSign(userNameRef)
                res = false
            }
        }
        const validateEmail = () => {
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailRef.current.value)){
                AddErrorSign(emailRef)
                res = false 
            }
        }
        const validatePassword = () => {
            if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,18}$/.test(passwordRef.current.value)){
                AddErrorSign(passwordRef)
                res = false
            }
        }
        const validateConfirmPassword = () => {
            if (confirmPasswordRef.current && confirmPasswordRef.current.value !== passwordRef.current.value){
                AddErrorSign(confirmPasswordRef)
                res = false
            }
        }

        resetErrorSigns()

        validateEmpty(firstNameRef)
        validateEmpty(lastNameRef)
        validateEmpty(userNameRef)
        validateEmpty(emailRef)
        validateEmpty(passwordRef)
        validateEmpty(confirmPasswordRef)
        
        if(!res) {
            errorRef.current.innerHTML = "Please fill out all required fields."
            errorRef.current.classList.add("show")
            return false
        }

        validateUsername()

        if(!res){
            errorRef.current.innerHTML = "Username has to be at least 3 letters"
            errorRef.current.classList.add("show")
            return false
        }


        validateEmail()

        if(!res){
            errorRef.current.innerHTML = "Please fill out an existing email."
            errorRef.current.classList.add("show")
            return false
        }

        validatePassword()

        if(!res){
            errorRef.current.innerHTML = "Your password must meet the following criteria:<br>- at least 1 lower case,<br>- at least 1 upper case,<br>- at least 1 number,<br>- and at least 1 special character <br>- between 6 and 18 characters";
            errorRef.current.classList.add("show")
            return false
        }

        validateConfirmPassword()

        if(!res){
            errorRef.current.innerHTML = "Passwords do not match. Please try again."
            errorRef.current.classList.add("show")
            return false
        }

        return res
        
    }

    const resetErrorSigns = () => {
        loginMethod === LOGIN_METHOD.SIGNUP && firstNameRef.current.classList.contains("errorInput") && firstNameRef.current.classList.remove("errorInput")
        loginMethod === LOGIN_METHOD.SIGNUP && lastNameRef.current.classList.contains("errorInput") && lastNameRef.current.classList.remove("errorInput")
        loginMethod === LOGIN_METHOD.SIGNUP && userNameRef.current.classList.contains("errorInput") && userNameRef.current.classList.remove("errorInput")
        emailRef.current.classList.contains("errorInput") && emailRef.current.classList.remove("errorInput")
        emailRef.current.innerHTML = ""
        passwordRef.current.classList.contains("errorInput") && passwordRef.current.classList.remove("errorInput")
        loginMethod === LOGIN_METHOD.SIGNUP && confirmPasswordRef.current.classList.contains("errorInput") && confirmPasswordRef.current.classList.remove("errorInput")
        errorRef.current.classList.contains("show") && errorRef.current.classList.remove("show")
    }



    return (
        <div className={"Wrapper"}>
                            <form className={"login"} onSubmit={handleSubmit}>
                        <h3 className = {"login__title"} data-testid={"login__title"}>{loginMethod===LOGIN_METHOD.SIGNIN ? 'Sign In' : 'Sign Up'}</h3>
                        {loginMethod === LOGIN_METHOD.SIGNUP && (<>
                        <input type="text" placeholder={"First Name *: max"} className={"firstName"} name={"firstName"} ref={firstNameRef} />
                        <input type="text" placeholder={"Last Name *: blagun"} className={"lastName"} name={"lastName"} ref={lastNameRef}/>
                        <input type="text" placeholder={"User Name *: maxblagun123"} className={"userName"} name={"userName"} ref={userNameRef}/> </>)} 
                        <input type="text" placeholder={"Email *: maxblagun123@gmail.com"} className={"email"} name={"email"} ref={emailRef}/>
                        <div className={"passwordContainer"}>
                            <input type="password" placeholder={"Password *: maxblagun123@MB"} className={"password"} name={"password"} ref={passwordRef}/>
                            <img src={hidePasswordIcon} className={"passwordIcon"} data-testid={"passwordIcon"} onClick={(e) => handlePasswordToggle(e , passwordRef)}/>
                        </div>
                        {loginMethod === LOGIN_METHOD.SIGNUP &&  <>
                            <div className={"passwordContainer"}>
                                <input type="password" placeholder={"Repeat Password *"} className={"confirmPassword"} name={"confirmPassword"} ref={confirmPasswordRef}/>
                                <img src={hidePasswordIcon} className={"passwordIcon"} onClick={(e) => handlePasswordToggle(e , confirmPasswordRef)}/>
                            </div>
                            <div className={"file"}>
                                <input type="file"
                                        accept="image/*"
                                        onChange={handleFileChoosen}/>
                            </div>
                            
                            </>}
                        <label className={"errorLabelLogin"} data-testid={"errorLabel"} ref={errorRef} />
                        <button type="submit">{!isLoading ? (loginMethod===LOGIN_METHOD.SIGNIN ? 'Sign In' : 'Sign Up') : <svg className={"Spinner"} data-testid={"Spinner"} width="15" height="15" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                            d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
                            stroke="white"
                            />
                        </svg>}</button>
                        {loginMethod===LOGIN_METHOD.SIGNIN ?
                        <p className = {"login__change"}>Don't have an account? <a data-testid={"switch-signUp"} onClick={() => {resetErrorSigns(); setLoginMethod(LOGIN_METHOD.SIGNUP)}}>Sign Up</a></p> :
                        <p className = {"login__change"}>Already have an account? <a data-testid={"switch-signIn"} onClick={() => {resetErrorSigns(); setLoginMethod(LOGIN_METHOD.SIGNIN)}}>Sign In</a></p>}
                </form>
        </div>
    )
}

export default Login