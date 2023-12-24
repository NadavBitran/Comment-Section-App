import Comment from "../../../../Components/Comment/Comment";
import ReplyList from "../ReplyList/ReplyList";

import { COMMENT_TYPE } from "../../../../Components/Comment/Constants/constants";

import "./Conversation.scss";

function Converation({converationId, post  }) {
    return (
        <div className={"Converation"}>
            <Comment 
                type={COMMENT_TYPE.POST}

                converationId={converationId}
                replyId={null}

                content = {post.content}
                createdAt = {post.createdAt}
                score = {post.score}
                likes = {post.likes}
                dislikes = {post.dislikes}
                writer = {post.user}
                replyingTo={null}
            />
            {post.replies.length !== 0 && 
            <ReplyList 
                converationId={converationId}
                replies={post.replies}
            />
            }
        </div>
    );
}

export default Converation;