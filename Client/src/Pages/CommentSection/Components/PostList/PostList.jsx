import React, { useState, useRef, useEffect  } from 'react';
import Converation from "../Conversation/Conversation.jsx";
import Modal from '../../../../Components/Modal/Modal.jsx';
import downArrow from "/images/downArrow.svg";
import { usePost } from '../../../../Hooks/usePost.jsx';
import { useNavigate } from 'react-router-dom';

import { MAIN_ROUTES } from '../../../../GlobalConstants/globalConstants.js';
import { ERROR_MODAL_SOMETHING_WENT_WRONG } from '../../../../GlobalConstants/globalConstants.js';
import { TYPE_MODAL , ACTIONS } from '../../../../Components/Modal/Constants/constants.js';
import './PostList.scss';

function PostList() {
  const { posts , postsOffset , loadNewPage , hasMorePosts , isError , setIsError } = usePost();
  const containerRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastScrollHeight , setLastScrollHeight] = useState(null);

  const [latestPostsKey , setLatestPostsKey] = useState(null)
  const [latestPostsLength , setLatestPostsLength] = useState(0)

  const nagivate = useNavigate()
  

  useEffect(() => {
    postsOffset.current = 0;
  } , [])

  useEffect(() => {
    const handleScrollTop = async() => {
        if(containerRef.current.scrollTop !== 0 || isLoadingMore) return
        if(!hasMorePosts) return

        setIsLoadingMore(true)
        const response = await loadNewPage()


        if(response===false) setIsError(true)

        setLastScrollHeight(containerRef.current.scrollHeight)
        setIsLoadingMore(false)



    }

    if(!containerRef.current) return

    containerRef.current.addEventListener('scroll' , handleScrollTop)

    return () => {
        if(containerRef.current){
            containerRef.current.removeEventListener('scroll' , handleScrollTop)
        }}

  } , [containerRef.current , hasMorePosts , isLoadingMore])

  useEffect(() => {
    if(!lastScrollHeight || !containerRef.current) return
    const scrollDiff = containerRef.current.scrollHeight - lastScrollHeight
    containerRef.current.scrollTop = scrollDiff
  } , [lastScrollHeight])

  useEffect(() => {
    if(containerRef.current){
        containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  } , [containerRef.current])

  useEffect(() => {
    if(!posts) return
    if(!latestPostsKey || !latestPostsLength){
      setLatestPostsLength(posts.length)
      setLatestPostsKey(posts[posts.length - 1].key)
      return
    }
    if(posts.length > latestPostsLength && latestPostsKey !== posts[posts.length - 1].key){
        containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
    setLatestPostsLength(posts.length)
    setLatestPostsKey(posts[posts.length - 1].key)
  } , [posts])





  if(isError){
    return (
      <Modal
         title={ERROR_MODAL_SOMETHING_WENT_WRONG.TITLE}
         description={ERROR_MODAL_SOMETHING_WENT_WRONG.DESC}
         modalType={TYPE_MODAL.ACKNOWLEDGE}
         setClickAction={(action) => {
            switch(action){
              case ACTIONS.YES:
                setIsError(false)
                nagivate(MAIN_ROUTES.HOME)
                break;
            }
         }}/>
    );
  }
  if (!posts) {
    return (
      <div className={'PostList'}>
        {Array.from({ length: 4 }, (_, index) => (
          <div className={"skeleton-load-postContainer"}
               data-cy={"skeleton-load-postContainer"} 
               key={index} >
              <div className={'skeleton-load'}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={'PostList'} ref={containerRef}>
      {isLoadingMore && <svg className={"post-content-load"} xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="hsl(238, 40%, 52%)"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="hsl(238, 40%, 52%)"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="hsl(238, 40%, 52%)"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>}
      {posts.map((post, postIndex) => (
            <Converation
            key={postIndex}
            converationId={post.key} 
            post={post}
          />
        ))}
        <div className={"moveDown"}>
          <img className={"moveDown__image"} src={downArrow} onClick={() => containerRef.current.scrollTop = containerRef.current.scrollHeight}/>
        </div>
    </div>
  );
}

export default PostList;
