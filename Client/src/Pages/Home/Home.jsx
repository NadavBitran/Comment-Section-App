import {Link} from 'react-router-dom';
import { useUser } from '../../Hooks/useUser'; 

import {MAIN_ROUTES} from "../../GlobalConstants/globalConstants";

import "./Home.scss";

/*
    @breif: This is the main page for the application, which contains links to the relevant places
    @return: Links to app's pages
*/
function Home(){
    const {user} = useUser()

    return (
        <div className={"home"}>
            <div className={"home__info"}>
                <h1 className={"home__title"}>Interactive Comment Section Demo</h1>
                <div className={"buttons"}>
                    {user && <Link to={MAIN_ROUTES.COMMENT_SECTION} className={"link"}><button>Continue as {user.username}</button></Link>}
                    <Link to={MAIN_ROUTES.LOGIN} className={"link"}><button>{user? 'Login from another user' : 'Login'}</button></Link>
                    <Link to={MAIN_ROUTES.ABOUT} className={"link"}><button>About</button></Link>
                    <Link to={MAIN_ROUTES.CONTACT} className={"link"}><button>Contact</button></Link>
                </div>
            </div>
            <h3 className={"home__credentials"}>Built By: Nadav Bitran Numa</h3>
        </div>
    )
}

export default Home;