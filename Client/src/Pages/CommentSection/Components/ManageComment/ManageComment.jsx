import Modal from "../../../../Components/Modal/Modal";


import  { useRef , useState} from 'react';

import { COMMENT_TYPE } from "../../../../Components/Comment/Constants/constants";
import { OPERATION_TYPE , ERROR_MODAL_DELETE_WARNING } from "./Constants/constants";
import { ACTIONS , TYPE_MODAL } from "../../../../Components/Modal/Constants/constants";

import { useUser } from "../../../../Hooks/useUser";
import { usePost } from "../../../../Hooks/usePost";

import "./ManageComment.scss";

function ManageComment({commentType,operationType   , contentToEdit , converationId , replyId , replyTo , setCommentStatus}) {
    
    const sendInput = useRef(null)
    const replyInput = useRef(null)
    const editInput = useRef(null)
    

    const [isLoading , setIsLoading] = useState(false)
    const [isError , setIsError] = useState(false)
    const [isErrorDesc , setIsErrorDesc] = useState('')


    const {user} = useUser()
    const {setNewPost , setNewReply , setExistingPost , setExistingReply , setRemovePost , setRemoveReply} = usePost()


    if(user===null) (<></>) 

    const HandleUserTagInput = (inputRef) => {
        if(operationType===OPERATION_TYPE.EDIT && commentType === COMMENT_TYPE.POST) return
        if(inputRef.current.value.length < replyTo.length + 2)
            inputRef.current.value = "@" + replyTo + " ";
    }

    const handleClientValidation = (value) => {
        const isEmpty = (value) => {return value.replace(/\s/g, '').length === 0}
        if(isEmpty(value))
        {
            return false
        }
        return true
    }

    const SendCommentJSX = 
    <>
        <div className={"ManageComment Send"}>
        <img className={"ManageComment__image"} src={user.image} alt={"user-profile-picture"} />

                <textarea 
                    className={"ManageComment__input"} 
                    type="text"
                    ref={sendInput}
                    placeholder={"Add A Comment..."}/>

                <button className={"ManageComment__button"}
                        onClick={async() => {
                            if(!handleClientValidation(sendInput.current.value)) {
                                setIsError(true)
                                setIsErrorDesc("You can't send an empty field!.")
                                return
                            }
                            setIsLoading(true)
                            try{
                                await setNewPost(user , sendInput.current.value);
                                sendInput.current.value = '';
                            }
                            catch(error){
                                setIsError(true)
                                setIsErrorDesc("It looks like something went wrong.")
                            }
                            finally{
                                setIsLoading(false)
                            }
                        }}>{!isLoading ? "Send" :<svg className={"Spinner"} data-testid={"Spinner"} width="25" height="25" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                    d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
                                                    stroke="white"
                                                    />
                            </svg>}
                </button>
        </div>
    </>;

    const EditCommentJSX = 
    <>
        <div className={"ManageComment Edit"}>
            <textarea 
                    className={"ManageComment__input"} 
                    type="text"
                    ref={editInput}
                    defaultValue={commentType===COMMENT_TYPE.POST ? contentToEdit : `@${replyTo} ${contentToEdit}`}
                    onChange={() => HandleUserTagInput(editInput)} />

                <button className={"ManageComment__button"}
                        onClick={async() => {
                            switch(commentType)
                            {
                                case COMMENT_TYPE.POST:
                                    if(!handleClientValidation(editInput.current.value)) {
                                        setIsError(true)
                                        setIsErrorDesc("You can't send an empty field!.")
                                        return
                                    }
                                    break;
                                case COMMENT_TYPE.REPLY:
                                    if(!handleClientValidation(editInput.current.value.slice(replyTo.length + 1))) {
                                        setIsError(true)
                                        setIsErrorDesc("You can't send an empty field!.")
                                        return
                                    }
                                    break;
                            }
                            setIsLoading(true)
                            try{
                                switch(commentType){
                                    case COMMENT_TYPE.POST:
                                        await setExistingPost(converationId , 'content' , editInput.current.value)
                                        editInput.current.value = '';
                                        break;
                                    case COMMENT_TYPE.REPLY:
                                        await setExistingReply(converationId , replyId , 'content' , editInput.current.value.slice(replyTo.length + 2))
                                        editInput.current.value = '';
                                        break;

                                }
                                setCommentStatus(operationType,false)
                            }
                            catch(error){
                                setIsError(true)
                                setIsErrorDesc("It looks like something went wrong.")
                            }
                            finally{
                                setIsLoading(false)
                            }
                        }}>{!isLoading ? "Update" : <svg className={"Spinner"} data-testid={"Spinner"} width="25" height="25" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                            d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
                            stroke="white"
                            />
                        </svg>}</button>
        </div>
    </>

    const ReplyCommentJSX =     
    <>
        <div className={"ManageComment Reply"}>
            <img className={"ManageComment__image"} src={user.image} alt={"user-profile-picture"} />

                <textarea className={"ManageComment__input"} 
                        type="text"
                        ref={replyInput}
                        defaultValue={`@${replyTo} `}
                        onChange={() => HandleUserTagInput(replyInput)} />

                <button className={"ManageComment__button"}
                        onClick={async() => {
                            if(!handleClientValidation(replyInput.current.value.slice(replyTo.length + 1))) {
                                setIsError(true)
                                setIsErrorDesc("You can't send an empty field!.")
                                return
                            }
                            setIsLoading(true)
                            try{
                                    await setNewReply(converationId , replyTo , user , replyInput.current.value.slice(replyTo.length + 2))
                                    replyInput.current.value = '';
                                    setCommentStatus(operationType,false)
                            }
                            catch(error){
                                setIsError(true)
                                setIsErrorDesc("It looks like something went wrong.")
                            }
                            finally{
                                setIsLoading(false)
                            }

                        }}>{!isLoading ? 'Reply' : <svg className={"Spinner"} data-testid={"Spinner"} width="25" height="25" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
                        stroke="white"
                        />
                    </svg>}</button>
        </div>
    </>;


    const DeleteCommentJSX = 
    <>
        <Modal 
            title={ERROR_MODAL_DELETE_WARNING.TITLE}
            description={ERROR_MODAL_DELETE_WARNING.DESC}
            modalType={TYPE_MODAL.WARNING}
            loading={isLoading}
            setClickAction={async(buttonClicked) => {
                if(buttonClicked === ACTIONS.NO){
                    setCommentStatus(operationType,false)
                    return
                }
                setIsLoading(true)
                try{
                    switch(commentType){
                        case COMMENT_TYPE.POST:
                            await setRemovePost(converationId)
                            break;
                        case COMMENT_TYPE.REPLY:
                            await setRemoveReply(converationId , replyId)
                            break;
                    }
                }
                catch(error){
                    setIsError(true)
                    setIsErrorDesc("It looks like something went wrong.")
                }
                finally{
                    setIsLoading(false)
                    setCommentStatus(operationType,false)
                }
            }}/>
    </>;

    const Manager = {
        [OPERATION_TYPE.SEND]: SendCommentJSX ,
        [OPERATION_TYPE.EDIT]: EditCommentJSX ,
        [OPERATION_TYPE.REPLY]: ReplyCommentJSX ,
        [OPERATION_TYPE.DELETE]: DeleteCommentJSX
    }

    return (<>
    {(!isError || operationType!==OPERATION_TYPE.DELETE) && Manager[operationType]}
    {isError && <Modal title={"Oops..."}
                        description={[isErrorDesc]}
                        modalType={TYPE_MODAL.ACKNOWLEDGE}
                        setClickAction={(action) => {
                        switch(action){
                            case ACTIONS.YES:
                                setIsError(false)
                                if(operationType !== OPERATION_TYPE.SEND){
                                    setCommentStatus(operationType,false)
                                }
                                break;
                        }
    }}/>}
    </>)
}

export default ManageComment;