import InfoCard from "../../Components/InfoCard/InfoCard"

import ConfettiForm from "/images/ConfettiForm.png"


import {CONTACT_SUBJECT , INFO_CARD_DATA} from "./Constants/constants"

import { useUser } from "../../Hooks/useUser"
import {useState , useRef} from "react"
import { postEmail } from "../../Api/post"

import "./Contact.scss"

/*
    @breif: Contains effective information on how to contact the website team, on which subjects it is worth contacting, 
            as well as a form to fill in additional details that guides the user to enter the necessary details in order to establish contact.
    @return: InfoCard data components and Contact Form 
*/
function Contact(){
    const {user} = useUser()
    const [subject , setSubject] = useState(CONTACT_SUBJECT.GENERAL)
    const [isLoading , setIsLoading] = useState(false)
    const [isFormSent , setIsFormSent] = useState(false)
    const firstnameRef = useRef()
    const lastnameRef = useRef()
    const emailRef = useRef()
    const descRef = useRef()
    const [imageBase64 , setImageBase64] = useState(null)
    const errorRef = useRef()


    const changeSubject = (value) => {
        setSubject(value)
    }
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
    const createErrorMessage = (message) => {
        if(!errorRef.current) return
        errorRef.current.classList.add("show")
        errorRef.current.innerHTML = message
    }
    const resetErrorMessage = () => {
        errorRef.current.classList.contains("show") && errorRef.current.classList.remove("show")
        errorRef.current.innerHTML = ""
    }
    const handleClientValidation = () => {
        const isEmpty = (value) => {return value.length === 0}
        const isEmail = (value) => {return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)}
        
        if(isEmpty(firstnameRef.current.value) || isEmpty(lastnameRef.current.value) ||
           isEmpty(emailRef.current.value) || isEmpty(descRef.current.value))
           {
                createErrorMessage("Please fill out all required fields.")
                return false
           }
        if(descRef.current.value.length > 200){
            createErrorMessage("Description has to be below 200 letters.")
            return false
        }
        if(!isEmail(emailRef.current.value)){
            createErrorMessage("Please fill out an existing email.")
            return false
        }

        return true

    }
    const handleSubmit = async(event) => {
        event.preventDefault()
        
        resetErrorMessage()

        if(!handleClientValidation()) return


        const formDetails = {
            firstname : firstnameRef.current.value ,
            lastname : lastnameRef.current.value ,
            email : emailRef.current.value ,
            image : imageBase64 ,
            description : descRef.current.value ,
            subject : subject
        }
        
        setIsLoading(true)
        
        try{
            const response = await postEmail(formDetails)

            if(response.status !== 200){
                createErrorMessage(response.data.message)
            }
            else{
                setIsFormSent(true)
            }
        }
        catch(error){
            console.log(error)
            createErrorMessage("Something Went Wrong. Please Try Again Later!")
        }
        finally{
            setIsLoading(false)
        }
    }

    return(
        <div className={"Wrapper"}>
            <div className={"ContactContainer"}>
                <div className={"ContactItems"}>
                        {INFO_CARD_DATA.map((CARD_DATA , index) => (
                            <InfoCard
                                key={index}
                                title={CARD_DATA.TITLE}
                                titleImage={CARD_DATA.TITLE_IMAGE}
                                desc={CARD_DATA.DESC}
                                onTitleClick={() => changeSubject(CARD_DATA.MATCHED_SUBJECT)}
                                additionalClassName={"ContactItem"}
                            />
                        ))}
                </div>

                {!isFormSent ? <form className={"ContactForm"} onSubmit={handleSubmit}>
                    <h2>Contact Form</h2>
                    <div className={"Form"}>
                        <div className={"Form__firstname Form__item"}>
                            <label for={"firstName"}>First name*</label>
                            <input type="text" id={"firstName"} defaultValue={user ? user.firstname : ""} ref={firstnameRef}/>
                        </div>

                        <div className={"Form__lastname Form__item"}>
                            <label for={"lastName"}>Last name*</label>
                            <input type="text" id={"lastName"} defaultValue={user ? user.lastname : ""} ref={lastnameRef}/>
                        </div>

                        <div className={"Form__email Form__item"}>
                            <label for={"email"}>Email*</label>
                            <input type="text" id={"email"} defaultValue={user ? user.email : ""} ref={emailRef}/>
                        </div>

                        <div className={"Form__subject Form__item"}>
                            <label for={"subject"}>Subject*</label>
                            <select id={"subject"} onChange={(event) => changeSubject(event.target.value)} value={subject}>
                                <option value="General">{CONTACT_SUBJECT.GENERAL}</option>
                                <option value="Technical Support">{CONTACT_SUBJECT.TECHNICAL_SUPPORT}</option>
                                <option value="Feedback and Suggestions">{CONTACT_SUBJECT.FEEDBACK_AND_SUGGESTIONS}</option>
                            </select>
                        </div>

                        <div className={"Form__desc Form__item"}>
                            <label for={"description"}>Description*</label>
                            <textarea type="text" id={"description"} ref={descRef}/>
                        </div>

                        <div className={"Form__file Form__item"}>
                            <input type="file"
                                    accept="image/*"
                                    onChange={handleFileChoosen}
                                    name={"file"}
                                    data-testid={"File"}/>
                        </div>

                        <label className={"errorLabelContact"} data-testid={"errorLabel"} ref={errorRef}/>

                        <button type="submit" className={"Form__button"}>{!isLoading ? 'Submit' : <svg data-testid={"Spinner"} className={"Spinner"} width="25" height="25" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
                        stroke="white"
                        />
                    </svg>}</button>
                    </div>
                </form> :
                <div className={"SuccessForm"}>
                    <h2 className={"SuccessForm__title"}>Thank you!</h2>
                    <img className={"SuccessForm__image"} src={ConfettiForm}/>
                    <p className={"SuccessForm__desc"}>You will get a response soon.</p></div>}
            </div>
        </div>
    )
}
export default Contact