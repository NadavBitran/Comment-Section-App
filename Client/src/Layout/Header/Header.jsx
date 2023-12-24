import { Link, useNavigate , useLocation } from "react-router-dom";

import { useRef } from "react";

import {MAIN_ROUTES , APP_THEME} from "../../GlobalConstants/globalConstants";

import { useUser } from "../../Hooks/useUser";
import { useTheme } from "../../Hooks/useTheme";


import "./Header.scss"

function Header(){
    const {user , signoutUser} = useUser()
    const {theme , themeIcon , changeTheme} = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const iconRef = useRef()

    const handleHamburgerMenuClose = () =>{
        iconRef.current.checked = false
    }
    const HandleThemeChange = () => {
        changeTheme()
    }

    
    return(    
    <header>
        <ul className={"menu"}>
            <li><Link to={MAIN_ROUTES.HOME}><button><h3>Home</h3></button></Link></li>
            {user && <li><Link to={MAIN_ROUTES.COMMENT_SECTION}><button><h3>Comment Section</h3></button></Link></li>}
            <li><Link to={MAIN_ROUTES.CONTACT}><button><h3>Contact</h3></button></Link></li>
            <li><Link to={MAIN_ROUTES.ABOUT}><button><h3>About</h3></button></Link></li>
        </ul>

        <div className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <input type="checkbox" ref={iconRef}/>
            </div>

            
            <div className="hamburger-menu">
                <div className="hamburger-bar wrapper">
                    {location.pathname!==MAIN_ROUTES.HOME && <Link to={MAIN_ROUTES.HOME} onClick={handleHamburgerMenuClose}><h3>Home</h3></Link> }
                    {user && location.pathname!==MAIN_ROUTES.COMMENT_SECTION && <Link to={MAIN_ROUTES.COMMENT_SECTION} onClick={handleHamburgerMenuClose}><h3>Comment Section</h3></Link>}
                    {location.pathname!==MAIN_ROUTES.CONTACT && <Link to={MAIN_ROUTES.CONTACT} onClick={handleHamburgerMenuClose}><h3>Contact</h3></Link>}
                    {location.pathname!==MAIN_ROUTES.ABOUT && <Link to={MAIN_ROUTES.ABOUT} onClick={handleHamburgerMenuClose}><h3>About</h3></Link>}
                </div>
            </div>

        <div className={"barDetails"}>
            <div className={"themeDetails"} onClick={HandleThemeChange}>
                <h3 className={"themeDetails__title"}>{theme === APP_THEME.DARK ? APP_THEME.LIGHT : APP_THEME.DARK}</h3>
                <img className={"themeDetails__image"} src={themeIcon}/>
            </div>
            {user ? <><div className={"userDetails"} onClick={() => {navigate(MAIN_ROUTES.PROFILE.replace(":id" , user._id))}}>
                <img className={"userImage"} src={user.image}/>
                <h3 className={"userName"}>{user.username}</h3>
                </div>
                <button className={"logoutBtn"} onClick={() => {signoutUser(); navigate(MAIN_ROUTES.HOME)}}>Logout</button></> : 
                
                <Link to="/login"><button className={"loginBtn"}>Login</button></Link>}
        </div>
    </header>)
}

export default Header;