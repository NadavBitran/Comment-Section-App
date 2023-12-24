import { useState , useEffect , useContext, createContext } from "react";

import { APP_THEME } from "../GlobalConstants/globalConstants";

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
        detectCurrentBrowsersPreferedScheme()
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
        setTheme(APP_THEME.LIGHT)
        setThemeIcon(iconMoon)

    }
    const setToLight = () => {
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