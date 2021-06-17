import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const DEV_URL =  "https://dev.test.com";
const PRD_URL = 'https://test.com';

const API = axios.create({
  baseURL: __DEV__ ? DEV_URL : PRD_URL,
  responseType: "json",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

API.interceptors.request.use(async (config: AxiosRequestConfig) => {
  // Can add adition auth headers here
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
})

API.interceptors.response.use((response: AxiosResponse) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request.url);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
});

export default API;

const TEST_ENDPOINT = '/test';

export const UserAPI = {
  create: (data: any): Promise<AxiosResponse> => {
    return API.post(TEST_ENDPOINT, data);
  },
  read: (): Promise<AxiosResponse> => {
    return API.get(TEST_ENDPOINT);
  },
  update: (data: any): Promise<AxiosResponse> => {
    return API.put(TEST_ENDPOINT, data);
  },
  delete: (): Promise<AxiosResponse> => {
    return API.delete(TEST_ENDPOINT);
  }
}