import axios from "axios";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  getItem,
  setItem,
  removeItem,
} from "./localStorageManager";
import store from "../redux/store";
import { setLoading, showToast } from "../redux/slice/appConfigSlice";
import { TOAST_FAILURE } from "../App";

let baseURL = 'http://localhost:4000/';
console.log('env is ', process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
    baseURL = process.env.REACT_APP_SERVER_BASE_URL
}
export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

//Interceptors used to call refresh token once access token is expired
//The process is done silently.User Experience is not distrubed and auth is maintain

//Request Interceptors
axiosClient.interceptors.request.use((request) => {
  store.dispatch(setLoading(true));
  const accessToken = getItem(ACCESS_TOKEN);
  console.log("accessToken...",accessToken)
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

//Response Interceptors
axiosClient.interceptors.response.use(
  async (response) => {
    store.dispatch(setLoading(false));
    const data = response.data;
    console.log("response interceptor data",response, data);
    if (data.status === "ok") {
      return data;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;

    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );

    //If Refresh Token Expired then User need to Login Again to have secure expirence...
    // if (
    //   statusCode === 401 &&
    //   originalRequest.url === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
    // ) {
    //   // removeItem(ACCESS_TOKEN);
    //   // removeItem(REFRESH_TOKEN);
    //   // console.log("Hi Tushar")
    //   // window.location.replace(`${process.env.REACT_APP_CLIENT_BASE_URL}/login`);
    //   // return Promise.reject(error);
    // }

    if (statusCode === 401 && !originalRequest._retry) {
      // const response = await axiosClient.post("/auth/refresh", {
      //   refreshToken: getItem(REFRESH_TOKEN),
      // });

       // means the access token has expired
       originalRequest._retry = true;

       const response = await axios
           .create({
               withCredentials: true,
           })
           .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

      if (response.status === "ok") {
        setItem(ACCESS_TOKEN, response.result.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.result.accessToken}`;
        return axios(originalRequest);
      } else {
        removeItem(ACCESS_TOKEN);
        removeItem(REFRESH_TOKEN);
        console.log("Hi Tushar");
        window.location.replace(
          `${process.env.REACT_APP_SERVER_BASE_URL}/login`
        );
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
  async (error) => {
    store.dispatch(setLoading(false));
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );
    return Promise.reject(error);
  }
);
