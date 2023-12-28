import {useState , useEffect} from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { MAIN_ROUTES } from "../../GlobalConstants/globalConstants.js";
import { TYPE_MODAL , ACTIONS } from "../../Components/Modal/Constants/constants.js"; 
import { ERROR_MODAL_SOMETHING_WENT_WRONG , ERROR_MODAL_USER_NOT_LOGGED_IN } from "../../GlobalConstants/globalConstants.js";
import {PROFILE_SECTION} from "./Constants/constants.js";

import "./Profile.scss"
import CommentReadOnly from "./Components/CommentReadOnly.jsx";
import Modal from "../../Components/Modal/Modal.jsx";
import Pagination from "./Components/Pagination/Pagination.jsx";
import Filter from "./Components/Filter/Filter.jsx";
import ActivityChart from "./Components/ActivityChart/ActivityChart.jsx";
import { useProfile} from "../../Hooks/useProfile.jsx";
import { useUser } from "../../Hooks/useUser.jsx";


/*
    @breif: This is the profile page, contains:
            - Details about the user
            - Statistics on sending posts and replies in the application
            - Post history and replies written, consisting of personal search and filter options
*/
function Profile(){
    const {user} = useUser()
    const navigate = useNavigate()
    if(!user) return (
        <Modal
            title={ERROR_MODAL_USER_NOT_LOGGED_IN.TITLE}
            description={ERROR_MODAL_USER_NOT_LOGGED_IN.DESC}
            modalType={TYPE_MODAL.ACKNOWLEDGE}
            setClickAction={(action) => {
                switch(action){
                    case ACTIONS.YES:
                        navigate(MAIN_ROUTES.LOGIN)
                }
            }} />
    )


    const {id} = useParams()
    
    const [profileSection , setProfileSection] = useState(PROFILE_SECTION.PROFILE_DETAILS)
    const {profileUser , profileUserPosts , profileUserPostsLength , profileUserRepliesLength , profileUserReplies , profileUserPostsDates , 
        profileUserRepliesDates , profileUserPostsCurrentPage , profileUserRepliesCurrentPage , profileUserPostsSortOptions , profileUserRepliesSortOptions ,
        loadProfileMainPage , loadProfilePostPage , loadProfileReplyPage , resetProfilePages} = useProfile(id)

    const [isErrorOnLoad , setIsErrorOnLoad] = useState(false)
    const [isLoadingProfile , setIsLoadingProfile] = useState(false)
    const [isFetchingPosts , setIsFetchingPosts] = useState(false)
    const [isFetchingReplies , setIsFetchingReplies] = useState(false)
    const isUserPostsEmpty = profileUserPostsLength === 0
    const isUserRepliesEmpty = profileUserRepliesLength === 0
    const limit = 10;

    
    useEffect(() => {
        const fetch = async() => {
            let answer = true
            
            if(!profileUser){
                setIsLoadingProfile(true)
                answer =  await loadProfileMainPage(id)
            }

            if(!answer) setIsErrorOnLoad(true)
            setIsLoadingProfile(false)
        }
        fetch()
    } , [])

    useEffect(() => {
      const fetch = async() => {

        if(!profileUser) return
        
        resetProfilePages()
        
        setIsLoadingProfile(true)
        let answer = await loadProfileMainPage(id)

        if(!answer) setIsErrorOnLoad(true)
        setIsLoadingProfile(false)
    }
    fetch()
    moveProfileSection(PROFILE_SECTION.PROFILE_DETAILS)
    } , [id])



    if(isErrorOnLoad) return (
        <Modal 
            title={ERROR_MODAL_SOMETHING_WENT_WRONG.TITLE}
            description={ERROR_MODAL_SOMETHING_WENT_WRONG.DESC}
            modalType={TYPE_MODAL.ACKNOWLEDGE}
            setClickAction={(action) => {
                switch(action){
                    case ACTIONS.YES:
                        setIsErrorOnLoad(false)
                        if(profileSection === PROFILE_SECTION.PROFILE_DETAILS) navigate(MAIN_ROUTES.HOME)
                        else setProfileSection(PROFILE_SECTION.PROFILE_DETAILS)
                }
            }}/>
    )

    const moveProfileSection = async(newSection , pageNumber , newProfileSortOptions) => {
        let answer = true
        setProfileSection(newSection)
        switch(newSection){
            case PROFILE_SECTION.PROFILE_DETAILS:
                answer = true
                break;
            case PROFILE_SECTION.PROFILE_POSTS:
                if(!profileUserPosts && !isUserPostsEmpty){
                    setIsFetchingPosts(true)
                    answer = await loadProfilePostPage(1 , limit , profileUserPostsSortOptions)
                }
                else if(pageNumber !== profileUserPostsCurrentPage) {
                    setIsFetchingPosts(true)
                    answer  = await loadProfilePostPage(pageNumber , limit , profileUserPostsSortOptions)
                }
                else if(newProfileSortOptions){
                    setIsFetchingPosts(true)
                    answer = await loadProfilePostPage(pageNumber , limit , newProfileSortOptions)
                }
                break;
            case PROFILE_SECTION.PROFILE_REPLIES:
                if(!profileUserReplies && !isUserRepliesEmpty){
                    setIsFetchingReplies(true)
                    answer = await loadProfileReplyPage(1 , limit , profileUserRepliesSortOptions)
                }
                else if(pageNumber !== profileUserRepliesCurrentPage) {
                    setIsFetchingReplies(true)
                    answer = await loadProfileReplyPage(pageNumber , limit , profileUserRepliesSortOptions)
                }
                else if(newProfileSortOptions){
                    setIsFetchingReplies(true)
                    answer = await loadProfileReplyPage(pageNumber , limit , newProfileSortOptions)
                }
                break;
        }
        if(!answer) setIsErrorOnLoad(true)
        setIsFetchingPosts(false)
        setIsFetchingReplies(false)
    }

    if(!profileUser || isLoadingProfile) return (
        <div className={"Wrapper"}>
            <div className={"skeleton-load-profileContainer"}>
                  <div className={'skeleton-load'} data-testid={'skeleton-load'}></div>
            </div>
        </div> 
      );

    const profileDetailsJSX = 
        <>

                    <div className={"Profile__detailsgrid"}>
                        <div className={"Profile__container Profile__username"}>
                            <h2>User name</h2>
                            <p>{profileUser.username}</p>
                        </div>
                        <div className={"Profile__container Profile__firstname"}>
                            <h2>First name</h2>
                            <p>{profileUser.firstname}</p>
                        </div>
                        <div className={"Profile__container Profile__lastname"}>
                            <h2>Last name</h2>
                            <p>{profileUser.lastname}</p>
                        </div>
                        <div className={"Profile__container Profile__email"}>
                            <h2>Email</h2>
                            <p>{profileUser.email}</p>
                        </div>
                    </div>
                    <div className={"Profile__statistics"}>
                            <div className={"Profile__container Profile__activesince"}>
                                <h2>Active Since</h2>
                                <p>11\11\11</p>
                            </div>
                            <div className={"Profile__container Profile__postAmount"}>
                                <h2>Posts Written</h2>
                                <p data-cy={"postsWritten"}>{profileUserPostsLength}</p>
                            </div>
                            <div className={"Profile__container Profile__replyAmount"}>
                                <h2>Replies Written</h2>
                                <p>{profileUserRepliesLength}</p>
                            </div>
                        </div>
                      {(profileUserPostsDates.length !== 0 || profileUserRepliesLength !== 0) ? (
                        <div className={"Profile__activity"}>
                          <h2>Posts Activity</h2>
                          <ActivityChart postDates={profileUserPostsDates}
                                         replyDates={profileUserRepliesDates}/>
                        </div>
                      ) : (<></>)}
             
        </>;

const profilePostsJSX = profileUserPosts ? (
    <div className={"Profile__posts"}>
                <Filter search = {profileUserPostsSortOptions.search}
                  option = {profileUserPostsSortOptions.option}
                  setSortChange = {(action) => {
                          moveProfileSection(PROFILE_SECTION.PROFILE_POSTS , 1 , {...profileUserPostsSortOptions , option : {...profileUserPostsSortOptions.option , sortOption : action}})}}
                  setOrderChange = {(action) => {
                           moveProfileSection(PROFILE_SECTION.PROFILE_POSTS , 1 , {...profileUserPostsSortOptions , option : {...profileUserPostsSortOptions.option , orderOption : action}})}}
                  setSearchChange= {(action) => {
                          moveProfileSection(PROFILE_SECTION.PROFILE_POSTS , 1 , {...profileUserPostsSortOptions , search : action})
                  }}/>
      {isFetchingPosts ? (
        <svg
        className={"profile-content-load"} data-testid={"profile-content-load"}
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
      >
        <circle cx="18" cy="12" r="0" fill="hsl(238, 40%, 52%)">
          <animate
            attributeName="r"
            begin=".67"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle cx="12" cy="12" r="0" fill="hsl(238, 40%, 52%)">
          <animate
            attributeName="r"
            begin=".33"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle cx="6" cy="12" r="0" fill="hsl(238, 40%, 52%)">
          <animate
            attributeName="r"
            begin="0"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
      </svg>
      ) : (
        isUserPostsEmpty ? (
            <h2 className={"Profile__error-msg"}>No Posts Found</h2>
        ) : (
          <>
            <div className={"Profile__posts-grid"}>
              {profileUserPosts.map((userPost) => (
                <CommentReadOnly
                  key={userPost.key}
                  type={'Post'}
                  converationId={userPost.key}
                  replyId={null}
                  content={userPost.content}
                  createdAt={userPost.createdAt}
                  score={userPost.score}
                  likes={userPost.likes}
                  dislikes={userPost.dislikes}
                  writer={userPost.user}
                  replyingTo={null}
                />
              ))}
            </div>
            <Pagination
              currentPage={profileUserPostsCurrentPage}
              totalPages={Math.ceil(profileUserPostsLength / limit)}
              setClickAction={(page) => {
                moveProfileSection(PROFILE_SECTION.PROFILE_POSTS, page);
              }}
            />
          </>
        )
      )}
    </div>
  ) : (
    <div className={"Profile__posts"}>
      {isUserPostsEmpty ? (
        <h2 className={"Profile__error-msg"}>No Posts Found</h2>
      ) : (
        isFetchingPosts ? (
          <svg
            className={"profile-content-load"} data-testid={"profile-content-load"}
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 24 24"
          >
            <circle cx="18" cy="12" r="0" fill="hsl(238, 40%, 52%)">
              <animate
                attributeName="r"
                begin=".67"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="12" cy="12" r="0" fill="hsl(238, 40%, 52%)">
              <animate
                attributeName="r"
                begin=".33"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="6" cy="12" r="0" fill="hsl(238, 40%, 52%)">
              <animate
                attributeName="r"
                begin="0"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
          </svg>
        ) : null
      )}
    </div>
  );
  
  
    

  const profileRepliesJSX = profileUserReplies ? (
    <div className={"Profile__replies"}>
          <Filter
              search={profileUserRepliesSortOptions.search}
              option={profileUserRepliesSortOptions.option}
              setSortChange={(action) => {
                moveProfileSection(PROFILE_SECTION.PROFILE_REPLIES, 1, {
                  ...profileUserRepliesSortOptions,
                  option: { ...profileUserRepliesSortOptions.option, sortOption: action },
                });
              }}
              setSearchChange={(action) => {
                moveProfileSection(PROFILE_SECTION.PROFILE_REPLIES , 1 , {
                  ...profileUserRepliesSortOptions,
                  search : action
                })
              }}
              setOrderChange={(action) => {
                moveProfileSection(PROFILE_SECTION.PROFILE_REPLIES, 1, {
                  ...profileUserRepliesSortOptions,
                  option: { ...profileUserRepliesSortOptions.option, orderOption: action },
                });
              }}
          />
      {isFetchingReplies ? (
        <svg
        className={"profile-content-load"} data-testid={"profile-content-load"}
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
      >
        <circle cx="18" cy="12" r="0" fill="hsl(238, 40%, 52%)">
          <animate
            attributeName="r"
            begin=".67"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle cx="12" cy="12" r="0" fill="hsl(238, 40%, 52%)">
          <animate
            attributeName="r"
            begin=".33"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle cx="6" cy="12" r="0" fill="hsl(238, 40%, 52%)">
          <animate
            attributeName="r"
            begin="0"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
      </svg>
      ) : (
        isUserRepliesEmpty ? (
          <h2 className={"Profile__error-msg"}>No Replies Found</h2>
        ) : (
          <>
            <div className={"Profile__replies-grid"}>
              {profileUserReplies.map((userReply) => (
                <CommentReadOnly
                  key={userReply.key}
                  type={'Reply'}
                  converationId={userReply.key}
                  replyId={null}
                  content={userReply.content}
                  createdAt={userReply.createdAt}
                  score={userReply.score}
                  likes={userReply.likes}
                  dislikes={userReply.dislikes}
                  writer={userReply.user}
                  replyingTo={userReply.replyingTo}
                />
              ))}
            </div>
            <Pagination
              currentPage={profileUserRepliesCurrentPage}
              totalPages={Math.ceil(profileUserRepliesLength / limit)}
              setClickAction={(page) => {
                moveProfileSection(PROFILE_SECTION.PROFILE_REPLIES, page);
              }}
            />
          </>
        )
      )}
    </div>
  ) : (
    <div className={"Profile__replies"}>
      {isUserRepliesEmpty ? (
        <h2 className={"Profile__error-msg"}>No Replies Found</h2>
      ) : (
        isFetchingReplies ? (
          <svg
            className={"profile-content-load"} data-testid={"profile-content-load"}
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 24 24"
          >
            <circle cx="18" cy="12" r="0" fill="hsl(238, 40%, 52%)">
              <animate
                attributeName="r"
                begin=".67"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="12" cy="12" r="0" fill="hsl(238, 40%, 52%)">
              <animate
                attributeName="r"
                begin=".33"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="6" cy="12" r="0" fill="hsl(238, 40%, 52%)">
              <animate
                attributeName="r"
                begin="0"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
          </svg>
        ) : null
      )}
    </div>
  );
  

        const profileSectionDict = {
            [PROFILE_SECTION.PROFILE_DETAILS] : profileDetailsJSX ,
            [PROFILE_SECTION.PROFILE_POSTS] : profilePostsJSX ,
            [PROFILE_SECTION.PROFILE_REPLIES] : profileRepliesJSX
        }
    
    
    return(
        <div className={"Wrapper"}>
            <div className={"Profile__card"}>
                <aside className={"Profile__aside"}>
                            <div className={"Profile__pictureContainer"}>
                              <img className={"Profile__picture"} src={profileUser.image}/>
                              <h1 className={"Profile__username--mobile"}>{profileUser.username}</h1>
                            </div>
                            <nav className={"Profile__navbar"}>
                                <ul>
                                    <li onClick={() => moveProfileSection(PROFILE_SECTION.PROFILE_DETAILS)}><button>Profile Details</button></li>
                                    <li onClick={() => moveProfileSection(PROFILE_SECTION.PROFILE_POSTS , profileUserPostsCurrentPage)}><button>Post History</button></li>
                                    <li onClick={() => moveProfileSection(PROFILE_SECTION.PROFILE_REPLIES , profileUserRepliesCurrentPage)}><button>Reply History</button></li>
                                </ul>
                            </nav>
                </aside>
                {profileSectionDict[profileSection]}
            </div>
        </div>
    )
}

export default Profile;