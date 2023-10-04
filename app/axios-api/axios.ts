import storageHelper from "@/lib/storage-helper";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/",
});
const ResponseInterceptor = (response: AxiosResponse) => {
  return response;
};
const RequestInterceptor = async (config: AxiosRequestConfig) => {
  const accessToken = await storageHelper.getItem(
    storageHelper.StorageKeys.Access_Token,
  );
  config!.headers!.Authorization =  "Bearer" + accessToken;
  console.log(config!.headers!.Authorization);
  return config;
};
//@ts-ignore
axiosInstance.interceptors.request.use(RequestInterceptor);
axiosInstance.interceptors.response.use(
  ResponseInterceptor,
  async (error: any) => {
    if (error?.message === "Network Error") {
      alert("Please Connect To Internet");
    }
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedErrors) {
      console.log("error", error);
      return;
    } else {
      if (error.response.status === 401) {
        // await storageHelper.removeItem(storageHelper.StorageKeys.Access_Token);
        // await storageHelper.removeItem(storageHelper.StorageKeys.USER_ID);
      }
      return Promise.reject(error);
    }
  },
);
