import { COMMENT_TYPE } from "./Components/Comment/Constants/constants"

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

const generateFakeUser = () => ({
    firstname: `First_${Math.floor(Math.random() * 100)}`,
    lastname: `Last_${Math.floor(Math.random() * 100)}`,
    username: `user_${Math.floor(Math.random() * 100)}`,
    email: `user_${Math.floor(Math.random() * 100)}@example.com`,
    image: "/images/avatarTest.png",
    usetype: Math.random() < 0.5 ? "regular" : "mod",
    _id: uuidv4(),
    key: uuidv4(),
    encryptedPassword: "s0m3Str0ngP@ssw0rd", 
  });
  
  const generateFakePost = (test_user) => {
    const user = test_user || generateFakeUser();
    const likes = Array.from({ length: Math.floor(Math.random() * 10) }, () => uuidv4())
    const dislikes = Array.from({ length: Math.floor(Math.random() * 5) }, () => uuidv4())
    const replies_length = Array.from({length : Math.floor((Math.random() * 4) + 1)})
    return {
      type: COMMENT_TYPE.POST,
      converationId: uuidv4(),
      content: `Post content ${Math.floor(Math.random() * 100)}`,
      createdAt: `${Math.floor(Math.random() * 30)} days ago`,
      likes: likes,
      dislikes: dislikes,
      score : likes.length - dislikes.length,
      writer: {
        username: user.username,
        email: user.email,
        image: user.image,
        _id: user._id,
      },
      replies : Array.from({ length : replies_length } , generateFakeReply)
    };
  };

  const generateFakeReply = (test_user) => {
    const user = test_user || generateFakeUser();
    const likes = Array.from({ length: Math.floor(Math.random() * 10) }, () => uuidv4())
    const dislikes = Array.from({ length: Math.floor(Math.random() * 5) }, () => uuidv4())
    return {
      type: COMMENT_TYPE.REPLY,
      converationId: uuidv4(),
      replyId: uuidv4(),
      content: `Post content ${Math.floor(Math.random() * 100)}`,
      createdAt: `${Math.floor(Math.random() * 30)} days ago`,
      likes: likes,
      dislikes: dislikes,
      score : likes.length - dislikes.length,
      replyingTo : `user_${Math.floor(Math.random() * 100)}`,
      writer: {
        username: user.username,
        email: user.email,
        image: user.image,
        _id: user._id,
      },
    };
  };

export const TEST_USER  = generateFakeUser()
export const TEST_USER_POST_LIST = (length) => Array.from({ length : length} , () => generateFakePost(TEST_USER))
export const TEST_USER_REPLY_LIST = (length) => Array.from({ length : length} , () => generateFakeReply(TEST_USER))
export const TEST_POST_LIST = (length) => Array.from({ length : length} , generateFakePost)
export const TEST_OWN_POST = generateFakePost(TEST_USER)
export const TEST_OWN_REPLY = generateFakeReply(TEST_USER)
export const TEST_OTHER_POST = generateFakePost()
export const TEST_OTHER_REPLY = generateFakeReply()