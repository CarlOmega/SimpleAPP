import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import auth from '@react-native-firebase/auth';

const URL =  "http://localhost:5001/toptal-d15b0/us-central1/app";

const API = axios.create({
  baseURL: URL,
  responseType: "json",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

API.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const firebaseUser = auth().currentUser;
  if (firebaseUser)
    config.headers['Authorization'] = 'JWT ' + await firebaseUser.getIdToken();
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
})

API.interceptors.response.use((response: AxiosResponse) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
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
  return Promise.reject(error);
});

export default API;

const USER_ENDPOINT = '/users';
const RESTAURANT_ENDPOINT = '/restaurants';
const REVIEW_ENDPOINT = '/reviews';

export const UserAPI = {
  create: (user: User): Promise<AxiosResponse> => {
    return API.post(USER_ENDPOINT, {user});
  },
  read: (): Promise<AxiosResponse>  => {
    return API.get(USER_ENDPOINT);
  },
  update: (uid: string, data: any): Promise<AxiosResponse> => {
    return API.put(USER_ENDPOINT + `/${uid}`, data);
  },
  delete: (uid: string): Promise<AxiosResponse> => {
    return API.delete(USER_ENDPOINT + `/${uid}`);
  }
}

export const RestaurantAPI = {
  create: (restaurant: {name: string, description: string}): Promise<AxiosResponse> => {
    return API.post(RESTAURANT_ENDPOINT, {restaurant});
  },
  read: (offset: number, rating?: number): Promise<AxiosResponse>  => {
    return API.get(RESTAURANT_ENDPOINT, {params: {offset, rating}});
  },
  update: (restaurantId: string, data: any): Promise<AxiosResponse> => {
    return API.put(RESTAURANT_ENDPOINT + `/${restaurantId}`, data);
  },
  delete: (restaurantId: string): Promise<AxiosResponse> => {
    return API.delete(RESTAURANT_ENDPOINT + `/${restaurantId}`);
  }
}

export const ReviewAPI = {
  create: (restaurantId: string, review: {rating: number, comment: string, dateOfVisit: number}): Promise<AxiosResponse> => {
    return API.post(REVIEW_ENDPOINT + `/${restaurantId}`, {review});
  },
  read: (restaurantId: string, offset: number): Promise<AxiosResponse>  => {
    return API.get(REVIEW_ENDPOINT + `/${restaurantId}`, {params: {offset}});
  },
  reply: (restaurantId: string, reviewId: string, reply: string): Promise<AxiosResponse> => {
    return API.put(REVIEW_ENDPOINT + `/${restaurantId}/${reviewId}/reply`, {reply});
  },
  delete: (restaurantId: string, reviewId: string): Promise<AxiosResponse> => {
    return API.delete(REVIEW_ENDPOINT + `/${restaurantId}/${reviewId}`);
  },
  preview: (restaurantId: string): Promise<AxiosResponse>  => {
    return API.get(REVIEW_ENDPOINT + `/${restaurantId}/preview`);
  },
  pending: (): Promise<AxiosResponse> => {
    return API.get(REVIEW_ENDPOINT + `/pending`);
  }
}