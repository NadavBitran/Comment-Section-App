
import ManageComment from "./Components/ManageComment/ManageComment.jsx";
import PostList from "./Components/PostList/PostList.jsx";
import Modal from "../../Components/Modal/Modal.jsx";
import { useUser } from "../../Hooks/useUser.jsx";
import { useNavigate } from "react-router-dom";


import { MAIN_ROUTES } from "../../GlobalConstants/globalConstants.js";
import { TYPE_MODAL , ACTIONS } from "../../Components/Modal/Constants/constants.js"; 
import {COMMENT_TYPE} from "../../Components/Comment/Constants/constants.js"
import {OPERATION_TYPE} from "./Components/ManageComment/Constants/constants.js"
import { ERROR_MODAL_USER_NOT_LOGGED_IN } from "../../GlobalConstants/globalConstants.js";

import "./CommentSection.scss";




function CommentSection(){
    const {user} = useUser()
    const navigate = useNavigate()

    return(<div className={"Wrapper"}>
        { user ?    <>
                        <PostList />
                    
                        <ManageComment
                            commentType={COMMENT_TYPE.POST}
                            operationType={OPERATION_TYPE.SEND} />
                    </>
                        
                :
                <Modal
                    title={ERROR_MODAL_USER_NOT_LOGGED_IN.TITLE}
                    description={ERROR_MODAL_USER_NOT_LOGGED_IN.DESC}
                    modalType={TYPE_MODAL.ACKNOWLEDGE}
                    setClickAction={(action) => {
                        switch(action){
                            case ACTIONS.YES:
                                navigate(MAIN_ROUTES.LOGIN)
                                break;
                        }}}
                     />
        }
            </div>
    );
}

export default CommentSection;