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

export const axiosClient = axios.create({
  baseURL:process.env.REACT_APP_SERVER_BASE_URL
  //   withCredentials: true,
});

//Interceptors used to call refresh token once access token is expired
//The process is done silently.User Experience is not distrubed and auth is maintain

//Request Interceptors
axiosClient.interceptors.request.use((request) => {
  store.dispatch(setLoading(true));
  const accessToken = getItem(ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

//Response Interceptors
axiosClient.interceptors.response.use(
  async (response) => {
    store.dispatch(setLoading(false));
    const data = response.data;
    console.log("response interceptor data", data);
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

    if (statusCode === 401) {
      const response = await axiosClient.post("/auth/refresh", {
        refreshToken: getItem(REFRESH_TOKEN),
      });

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
