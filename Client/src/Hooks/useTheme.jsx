import { useState , useEffect , useContext, createContext } from "react";

import { APP_THEME , LOCAL_STORAGE} from "../GlobalConstants/globalConstants";

import iconMoon from "/images/icon-moon.svg";
import iconSun from "/images/icon-sun.svg";



export function useThemeSource(){

    const [theme , setTheme] = useState()
    const [themeIcon , setThemeIcon] = useState()

    useEffect(() => {
        const detectCurrentBrowsersPreferedScheme = () => {
            if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            {
                setToLight()
            }
            else 
            {
                setToDark()
            }
        }

        const currentUserPreferedScheme = localStorage.getItem(LOCAL_STORAGE.THEME)

        if(currentUserPreferedScheme){
            currentUserPreferedScheme === APP_THEME.DARK && setToLight()
            currentUserPreferedScheme === APP_THEME.LIGHT && setToDark()
        }
        else{
            detectCurrentBrowsersPreferedScheme()
        }
    } , [] )

    const changeTheme = () => {
        switch(theme){
            case APP_THEME.DARK:
                setToDark()
                break;
            case APP_THEME.LIGHT:
                setToLight()
                break;
        }
    }

    const setToDark = () => {
        localStorage.setItem(LOCAL_STORAGE.THEME , APP_THEME.DARK)
        setTheme(APP_THEME.LIGHT)
        setThemeIcon(iconMoon)

    }
    const setToLight = () => {
        localStorage.setItem(LOCAL_STORAGE.THEME , APP_THEME.LIGHT)
        setTheme(APP_THEME.DARK)
        setThemeIcon(iconSun)
    }


    return {theme : theme ,
            displayTheme : theme === APP_THEME.LIGHT ? APP_THEME.DARK : APP_THEME.LIGHT ,
            themeIcon : themeIcon , 
            changeTheme : changeTheme}
}

const ThemeContext = createContext()

export const useTheme = () => {
    return useContext(ThemeContext)
}

export function ThemeProvider({children}){
    return (
        <ThemeContext.Provider value={useThemeSource()}>
            {children}
        </ThemeContext.Provider>
    )
}