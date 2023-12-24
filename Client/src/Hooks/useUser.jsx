// -------------------
// IMPORTS
import { createContext , useContext , useState , useCallback , useEffect } from 'react';
import { postSigninUser , postSignupUser} from "../Api/post";
import { fetchSignOutUser } from '../Api/get';

import { LOCAL_STORAGE } from '../GlobalConstants/globalConstants';

// -------------------

function useUserSource(){

    const getUserFromLocalStorage = () => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE.USER);
        return storedUser ? JSON.parse(storedUser) : null;
    };


    const [user , setUser] = useState(getUserFromLocalStorage())
    
    useEffect(() => {
        
        const forceSignoutUser = (event) => {
            if(event.key === LOCAL_STORAGE.USER){
                signoutUser()
            }
        }
        
            window.addEventListener("storage" , forceSignoutUser)

            return () => window.removeEventListener("storage" , forceSignoutUser)
    
    } , [])

    const signoutUser = useCallback(async() => {
        await fetchSignOutUser();
        localStorage.removeItem(LOCAL_STORAGE.USER)
        localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN)
        setUser(null)
    } , [])

    const signupUser = useCallback(async (newUser) => {
        try{
            const response = await postSignupUser(newUser)
            if(response.status === 200) {
                localStorage.setItem(LOCAL_STORAGE.USER , JSON.stringify(response.data.result))
                localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN , JSON.stringify(response.data.accessToken))
                setUser(response.data.result)
                return null
            }
            else return response.response.data.message
        }
        catch(error){
            return "Something Went Wrong"
        }
    } , [])

    const signinUser = useCallback(async (existingUser) => {
        let response
        try{
            response = await postSigninUser(existingUser)

            if(response.status === 200)
            {
                localStorage.setItem(LOCAL_STORAGE.USER , JSON.stringify(response.data.result))
                localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN , JSON.stringify(response.data.accessToken))
                setUser(response.data.result)
                return null
            }
            else return response.response.data.message
        }
        catch(error){
            return "Something Went Wrong"
        }
    } , [])



    return {user: user ,
            signupUser : signupUser , 
            signinUser : signinUser ,
            signoutUser : signoutUser
        }

}

const UserContext = createContext()

export function useUser(){
    return useContext(UserContext)
}


export function UserProvider({children}){
    return(
    <UserContext.Provider value={useUserSource()}>
        {children}
    </UserContext.Provider>
    );
}