import ManageComment from '../../Pages/CommentSection/Components/ManageComment/ManageComment';

import {useState , useCallback , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { MAIN_ROUTES } from '../../GlobalConstants/globalConstants';
import { COMMENT_TYPE , REACTION_TYPE } from './Constants/constants';
import { OPERATION_TYPE } from '../../Pages/CommentSection/Components/ManageComment/Constants/constants';

import { useUser  } from '../../Hooks/useUser';
import { usePost } from "../../Hooks/usePost";


import "./Comment.scss";

// COMMENT COMPONENT
// This Comment Component Includes Both Structures to: Post Comments && Reply Comments with 4 possible options:
// 1) Own Post
// 2) Own Reply
// 3) Other Post
// 4) Other Reply
function Comment({type , converationId , replyId , content , createdAt , score , likes , dislikes , writer , replyingTo}){

    const [isReplying , setIsReplying] = useState(false);
    const [isEditing , setIsEditing] = useState(false);
    const [isDeleting , setIsDeleting] = useState(false);
    const [isLiked , setIsLiked] = useState();
    const [isDisliked , setIsDisliked] = useState();
    const [isVoteRequestInProgress , setIsVoteRequestInProgress] = useState(false)
    const {user} = useUser();
    const {setExistingPostLikes , setExistingReplyLikes } = usePost();
    const navigate = useNavigate();


    useEffect(() => {
        if(!user) return
        setIsLiked(likes.includes(user._id))
        setIsDisliked(dislikes.includes(user._id))
    } , [likes , dislikes])

    const HandleCRUD = useCallback((CRUDoperation , value) => {
        switch(CRUDoperation)
        {
            case OPERATION_TYPE.REPLY:
                setIsReplying(value);
                break;
            case OPERATION_TYPE.EDIT:
                setIsEditing(value);
                break;
            case OPERATION_TYPE.DELETE:
                setIsDeleting(value);
                break;
        }
    }, [])



    if(user===null) return (<></>); 


    
    const isOwn = user.email === writer.email;
    const isOwnModerator = user.usertype === "moderator";
    const isOtherModerator = writer.usertype === "moderator";

    
    const HandleVote = async(operationType) => {

        if(isVoteRequestInProgress) return

        setIsVoteRequestInProgress(true)

        if(isLiked && operationType === REACTION_TYPE.LIKE) {
            setIsVoteRequestInProgress(false)
            return
        }
        if(isDisliked && operationType === REACTION_TYPE.DISLIKE) {
            setIsVoteRequestInProgress(false)
            return
        } 

        let response;

            switch(type){
                case COMMENT_TYPE.POST : 
                    response = await setExistingPostLikes(converationId , operationType)
                    break;
                case COMMENT_TYPE.REPLY :
                    response = await setExistingReplyLikes(converationId , replyId , operationType)
                    break;
            }
        

        if(response === "Success"){
            if(isLiked && operationType === REACTION_TYPE.DISLIKE) {
                setIsLiked(false)
            }
            
            if(isDisliked && operationType === REACTION_TYPE.LIKE) {
                setIsDisliked(false)
            }
    
            if(!isLiked && !isDisliked && operationType === REACTION_TYPE.DISLIKE) {
                setIsDisliked(true)
            }
    
            if(!isLiked && !isDisliked && operationType === REACTION_TYPE.LIKE) {
                setIsLiked(true)
            }
        }

        setIsVoteRequestInProgress(false)
    }
    
    const OwnPostJSX =
    <>
        <div className={"Post__Details"}>
            <div className={"Post__Bar"}>
                <img className={"Post__Bar--image"} src={writer.image}/>
                <h4 className={"Post__Bar--username"} onClick={() => navigate(MAIN_ROUTES.PROFILE.replace(":id" , user._id))}>{writer.username}</h4>
                {isOwnModerator && isOwn && <div className={`Post__Bar--tag mod`}>mod</div>}
                {isOwn && <div className={`Post__Bar--tag you`}>you</div>}
                <p className={"Post__Bar--createdAt"}>{createdAt}</p>
            </div>

                {isEditing && <ManageComment
                                            commentType={type} 
                                            operationType={OPERATION_TYPE.EDIT}
                                            writer={user}
                                            converationId={converationId}
                                            contentToEdit={content}
                                            setCommentStatus={HandleCRUD}/>}
                
                {!isEditing && <div className={"Post__Text"}>
                                    {content}
                                </div>}

        </div>

        
        <div className={"Post__Icons"}>
                    <div className={"Post__Delete"} onClick={() => {HandleCRUD(OPERATION_TYPE.DELETE,!isDeleting)}}>
                        <img className={"Post__Delete--Image"} src={"/images/icon-delete.svg"}/>
                        <h4 className={"Post__Delete--Text"}>Delete</h4>
                    </div>
                    <div className={"Post__Edit"} onClick={() => {HandleCRUD(OPERATION_TYPE.EDIT,!isEditing)}}>
                        <img className={"Post__Edit--Image"} src={"/images/icon-edit.svg"}/>
                        <h4 className={"Post__Edit--Text"}>Edit</h4>
                    </div>
                    {isOwnModerator && <div className={"Post__Reply"} onClick={() => {HandleCRUD(OPERATION_TYPE.REPLY,!isReplying)}}>
                        <img className={"Post__Reply--Image"} src={"/images/icon-reply.svg"}/>
                        <h4 className={"Post__Reply--Text"}>Reply</h4>
                    </div>}
        </div>
    </>;

    const OwnReplyJSX = 
        <>
            <div className={"Post__Details"}>
                <div className={"Post__Bar"}>
                <img className={"Post__Bar--image"} src={writer.image} />
                <h4 className={"Post__Bar--username"} onClick={() => navigate(MAIN_ROUTES.PROFILE.replace(":id" , user._id))}>{writer.username}</h4>
                    {isOwnModerator && isOwn && <div className={`Post__Bar--tag mod`}>mod</div>}
                    {isOwn && <div className={`Post__Bar--tag you`}>you</div>}
                    <p className={"Post__Bar--createdAt"}>{createdAt}</p>
                </div>

                    {isEditing && <ManageComment
                                                commentType={type} 
                                                operationType={OPERATION_TYPE.EDIT}
                                                writer={user}
                                                converationId={converationId}
                                                replyId={replyId}
                                                replyTo={replyingTo}
                                                setCommentStatus={HandleCRUD}
                                                contentToEdit={content}/>}
                    
                    {!isEditing && <div className={"Post__Text"}>
                                        {replyingTo !== undefined && <strong className="Post__Tag">{`@${replyingTo} `}</strong>}
                                        {content}
                                    </div>}

            </div>

            
            <div className={"Post__Icons"}>
                    <div className={"Post__Delete"} onClick={() => {HandleCRUD(OPERATION_TYPE.DELETE,!isDeleting)}}>
                        <img className={"Post__Delete--Image"} src={"/images/icon-delete.svg"}/>
                        <h4 className={"Post__Delete--Text"}>Delete</h4>
                    </div>
                    <div className={"Post__Edit"} onClick={() => {HandleCRUD(OPERATION_TYPE.EDIT,!isEditing)}}>
                        <img className={"Post__Edit--Image"} src={"/images/icon-edit.svg"}/>
                        <h4 className={"Post__Edit--Text"}>Edit</h4>
                    </div>
                    {isOwnModerator && <div className={"Post__Reply"} onClick={() => {HandleCRUD(OPERATION_TYPE.REPLY,!isReplying)}}>
                        <img className={"Post__Reply--Image"} src={"/images/icon-reply.svg"}/>
                        <h4 className={"Post__Reply--Text"}>Reply</h4>
                    </div>}
        </div>
        </>
    ;

    const OtherPostJSX = 
    <>
        <div className={"Post__Details"}>
            <div className={"Post__Bar"}>
                <img className={"Post__Bar--image"} src={writer.image} />
                <h4 className={"Post__Bar--username"} onClick={() => navigate(MAIN_ROUTES.PROFILE.replace(":id" , writer._id))}>{writer.username}</h4>
                {isOtherModerator && <div className={"Post__Bar--tag mod"}>mod</div>}
                <p className={"Post__Bar--createdAt"}>{createdAt}</p>
            </div>

            <div className={"Post__Text"}>
                {content}
            </div>
        </div>


    
        <div className={"Post__Icons"}>
                    <div className={"Post__Reply"} onClick={() => {HandleCRUD(OPERATION_TYPE.REPLY,!isReplying)}}>
                        <img className={"Post__Reply--Image"} src={"/images/icon-reply.svg"}/>
                        <h4 className={"Post__Reply--Text"}>Reply</h4>
                    </div>
        </div>
    </>;

    const OtherReplyJSX =
        <>
            <div className={"Post__Details"}>
                <div className={"Post__Bar"}>
                    <img className={"Post__Bar--image"} src={writer.image} />
                    <h4 className={"Post__Bar--username"} onClick={() => navigate(MAIN_ROUTES.PROFILE.replace(":id" , writer._id))}>{writer.username}</h4>
                    {isOtherModerator && <div className={"Post__Bar--tag mod"}>mod</div>}
                    <p className={"Post__Bar--createdAt"}>{createdAt}</p>
                </div>

                <div className={"Post__Text"}>
                    {replyingTo !== undefined && <strong className={"Post__Tag"}>{`@${replyingTo} `}</strong>}
                    {content}
                </div>
           </div>


           
           <div className={"Post__Icons"}>
                            <div className={"Post__Reply"} onClick={() => {HandleCRUD(OPERATION_TYPE.REPLY,!isReplying)}}>       
                            <img className={"Post__Reply--Image"} src={"/images/icon-reply.svg"}/>
                            <h4 className={"Post__Reply--Text"}>Reply</h4>
                        </div>
             </div>
        </>;




    return (
        user &&     
        <>
            <div className={"Post"}>

                <div className={"Post__Upvotes"}>
                <p className={isLiked? "Post__Upvotes--up Post__Voted" : "Post__Upvotes--up"} onClick={() => HandleVote(REACTION_TYPE.LIKE)}>+</p>
                <p className={"Post__Upvotes--count"}>{score}</p>
                <p className={isDisliked? "Post__Upvotes--down Post__Voted" : "Post__Upvotes--down"} onClick={() => HandleVote(REACTION_TYPE.DISLIKE)}>-</p>
                </div>

                {type===COMMENT_TYPE.POST && (isOwn || isOwnModerator) && OwnPostJSX}
                {type===COMMENT_TYPE.POST && (!isOwn && !isOwnModerator) && OtherPostJSX}
                {type===COMMENT_TYPE.REPLY && (isOwn || isOwnModerator) && OwnReplyJSX}
                {type===COMMENT_TYPE.REPLY && (!isOwn && !isOwnModerator) && OtherReplyJSX}
            </div>

            {isReplying && <ManageComment
                                        commentType={type} 
                                        operationType={OPERATION_TYPE.REPLY}
                                        writer={user}
                                        converationId={converationId}
                                        setCommentStatus={HandleCRUD}
                                        replyTo={writer.username}/>}

            {isDeleting && <ManageComment 
                                        commentType={type}
                                        operationType={OPERATION_TYPE.DELETE}
                                        converationId={converationId}
                                        replyId = {replyId}
                                        setCommentStatus={HandleCRUD}/>}
        </>
    );
}




export default Comment;