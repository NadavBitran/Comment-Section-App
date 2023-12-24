import Comment from "../../../../Components/Comment/Comment.jsx";

import "./ReplyList.scss";

import { COMMENT_TYPE } from "../../../../Components/Comment/Constants/constants.js";


function ReplyList({replies , converationId}) {
    return (
        <div className={"ReplyList"}>
            {replies.map((reply , replyId) => {
                return <Comment 
                            key={replyId}
                            type={COMMENT_TYPE.REPLY}

                            converationId={converationId}
                            replyId = {reply.key}

                            content={reply.content}
                            createdAt={reply.createdAt}
                            score={reply.score}
                            likes = {reply.likes}
                            dislikes = {reply.dislikes}
                            writer={reply.user}
                            replyingTo={reply.replyingTo}
                        />
            } )}
        </div>
    );
}


export default ReplyList;