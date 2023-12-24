import axios from 'axios'
import {LOCAL_STORAGE , SERVER_DEV_URL} from "../GlobalConstants/globalConstants"
export const URL = SERVER_DEV_URL;
export const API = axios.create({baseURL : URL ,withCredentials: true})

API.interceptors.request.use((req) => {
    if(localStorage.getItem(LOCAL_STORAGE.USER)){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN))}`
    }
    return req
})