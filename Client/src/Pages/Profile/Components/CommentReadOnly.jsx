import { useUser } from "../../../Hooks/useUser";
import "../../../Components/Comment/Comment.scss";

function CommentReadOnly({type , converationId , replyId , content , createdAt , score , likes , dislikes , writer , replyingTo}){
    const {user} = useUser()
    if(user===null) return (<></>); 

    const isLiked = likes.includes(user._id)
    const isDisliked = dislikes.includes(user._id)
    
    const isOwn = user.email === writer.email;
    const isOwnModerator = user.usertype === "moderator";
    const isOtherModerator = writer.usertype === "moderator";

    
    const OwnPostJSX =
    <>
        <div className={"Post__Details"}>
            <div className={"Post__Bar"}>
                <img className={"Post__Bar--image"} src={writer.image}/>
                <h4 className={"Post__Bar--username"}>{writer.username}</h4>
                {isOwnModerator && isOwn && <div className={`Post__Bar--tag mod`}>mod</div>}
                {isOwn && <div className={`Post__Bar--tag you`}>you</div>}
                <p className={"Post__Bar--createdAt"}>{createdAt}</p>
            </div>

            <div className={"Post__Text"}>
                {content}
            </div>
        </div>
    </>;

    const OwnReplyJSX = 
        <>
            <div className={"Post__Details"}>
                <div className={"Post__Bar"}>
                <img className={"Post__Bar--image"} src={writer.image} />
                    <h4 className={"Post__Bar--username"}>{writer.username}</h4>
                    {isOwnModerator && isOwn && <div className={`Post__Bar--tag mod`}>mod</div>}
                    {isOwn && <div className={`Post__Bar--tag you`}>you</div>}
                    <p className={"Post__Bar--createdAt"}>{createdAt}</p>
                </div>

                <div className={"Post__Text"}>
                {replyingTo !== undefined && <strong className={"Post__Tag"}>{`@${replyingTo} `}</strong>}
                {content}
            </div>
            </div>
        </>
    ;

    const OtherPostJSX = 
    <>
        <div className={"Post__Details"}>
            <div className={"Post__Bar"}>
                <img className={"Post__Bar--image"} src={writer.image} />
                <h4 className={"Post__Bar--username"}>{writer.username}</h4>
                {isOtherModerator && <div className={"Post__Bar--tag mod"}>mod</div>}
                <p className={"Post__Bar--createdAt"}>{createdAt}</p>
            </div>

            <div className={"Post__Text"}>
                {content}
            </div>
        </div>
    </>;

    const OtherReplyJSX =
        <>
            <div className={"Post__Details"}>
                <div className={"Post__Bar"}>
                    <img className={"Post__Bar--image"} src={writer.image} />
                    <h4 className={"Post__Bar--username"}>{writer.username}</h4>
                    {isOtherModerator && <div className={"Post__Bar--tag mod"}>mod</div>}
                    <p className={"Post__Bar--createdAt"}>{createdAt}</p>
                </div>

                <div className={"Post__Text"}>
                    {replyingTo !== undefined && <strong className={"Post__Tag"}>{`@${replyingTo} `}</strong>}
                    {content}
                </div>
           </div>
        </>;




    return (
        user &&     
        <>
            <div className={"Post"}>

                <div className={"Post__Upvotes"}>
                <p className={isLiked? "Post__Upvotes--up Post__Voted" : "Post__Upvotes--up"}>+</p>
                <p className={"Post__Upvotes--count"}>{score}</p>
                <p className={isDisliked? "Post__Upvotes--down Post__Voted" : "Post__Upvotes--down"}>-</p>
                </div>

                {type==='Post' && (isOwn || isOwnModerator) && OwnPostJSX}
                {type==='Post' && (!isOwn && !isOwnModerator) && OtherPostJSX}
                {type==='Reply' && (isOwn || isOwnModerator) && OwnReplyJSX}
                {type==='Reply' && (!isOwn && !isOwnModerator) && OtherReplyJSX}
            </div>
        </>
    );
}




export default CommentReadOnly;