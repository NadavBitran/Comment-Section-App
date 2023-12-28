import {Link} from 'react-router-dom';
import { useUser } from '../../Hooks/useUser'; 

import {MAIN_ROUTES} from "../../GlobalConstants/globalConstants";

import heroBg from "/images/hero-Image.png";
import githubIcon from "/images/icons8-github.svg";
import linkedinIcon from "/images/icons8-linkedin.svg";
import youtubeIcon from "/images/icons8-youtube.svg";

import "./Home.scss";

/*
    @breif: This is the main page for the application, which contains links to the relevant places
    @return: Links to app's pages
*/
function Home(){
    const {user} = useUser()

    return (
        <div className={"home"}>
            <div className={"home__details"}>
                <h1 className={"home__title"}>Interactive Comment Section</h1>
                <p className={"home__desc"}>Engage in lively discussions, share your thoughts, and connect with others through a dynamic and interactive comment section. a real-time environment where users can post comments, reply to each other, and express opinions.</p>
                <div className={"buttons"}>
                    {user && <Link to={MAIN_ROUTES.COMMENT_SECTION} className={"link"}><button>Continue as {user.username}</button></Link>}
                    <Link to={MAIN_ROUTES.LOGIN} className={"link"}><button>{user? 'Login from another user' : 'Login'}</button></Link>
                    <Link to={MAIN_ROUTES.ABOUT} className={"link"}><button>About</button></Link>
                    <Link to={MAIN_ROUTES.CONTACT} className={"link"}><button>Contact</button></Link>
                </div>
            </div>
            <div className={"home__image"}>
                <img src={heroBg} alt={"hero__banner"}/>
            </div>
            <div className={"home__icons"}>
                <ul>
                    <li><a href={"https://github.com/NadavBitran"} target={"_blank"}><img src={githubIcon}/></a></li>
                    <li><a href={"https://www.linkedin.com/in/nadavbitran/"} target={"_blank"}><img src={linkedinIcon}/></a></li>
                    <li><img src={youtubeIcon}/></li>
                </ul>
            </div>
        </div>
    )
}

export default Home;