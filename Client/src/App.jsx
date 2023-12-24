import React from 'react';
import CommentSection from "./Pages/CommentSection/CommentSection.jsx";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import About from "./Pages/About/About.jsx";
import Contact from "./Pages/Contact/Contact.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import InvalidPage404 from './Pages/InvalidPage404/InvalidPage404.jsx';
import Header from  "./Layout/Header/Header.jsx";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {fetchRefreshToken } from './Api/get.js';
import {API} from "./Api/index.js";
import {PostProvider} from './Hooks/usePost.jsx';
import {useTheme} from "./Hooks/useTheme.jsx";
import { useUser } from './Hooks/useUser.jsx';
import { useEffect } from 'react';


import {LOCAL_STORAGE, MAIN_ROUTES , HTTP_STATUS_CODES} from './GlobalConstants/globalConstants.js';



import "./App.scss";

/*
  @breif: - This is the main component of the application, which performs setup for all the existing routes and 
            links between the component and the url that the user wants
          - Dealing with the setup of the application's theme by the user's preferences settings in his browser
          - Dealing with Axois library interceptors setup
          - On each render, if user already logged-in an authentication check is required 

  @return: - Matched page JSX
*/
function App() {
  const {theme} = useTheme()
  const {user , signoutUser} = useUser()

  useEffect(() => {


    API.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        switch (error.response.status) {
          case HTTP_STATUS_CODES.UNAUTHORIZED:
            const refreshRequest = await fetchRefreshToken();

            if (!refreshRequest.data.hasOwnProperty('message')) {
              localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, JSON.stringify(refreshRequest.data.accessToken));
              return API(error.config);
            } else {
              signoutUser();
            }
            break;
          case HTTP_STATUS_CODES.NOT_ACCEPTABLE:
            signoutUser();
            break;
        }
        return Promise.reject(error);
      }
    );
    

    async function isAuthenticated(){
      if(user){
        const refreshRequest = await fetchRefreshToken()

        if (!refreshRequest.data.hasOwnProperty('message')) {
          localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, JSON.stringify(refreshRequest.data.accessToken));
        }
      }
    }

    isAuthenticated()
    
  } , [])
  return (
    <Router>
        <div className={"App"} theme={theme}>
          <Routes>
              <Route path={MAIN_ROUTES.HOME} element={<Home />} />
              <Route path={MAIN_ROUTES.LOGIN} element={<><Header /><Login /></>}/>
              <Route path={MAIN_ROUTES.ABOUT} element={<><Header /><About /></>}/>
              <Route path={MAIN_ROUTES.CONTACT} element={<><Header /><Contact /></>}/>
              <Route path={MAIN_ROUTES.COMMENT_SECTION} element={<PostProvider><Header /><CommentSection /></PostProvider>}/>
              <Route path={MAIN_ROUTES.PROFILE} element={<><Header /><Profile/></>}/>
              <Route path={MAIN_ROUTES.INVALID_PAGE} element={<><Header /><InvalidPage404 /></>}/>
          </Routes>
        </div>
    </Router>
  )
}

export default App
