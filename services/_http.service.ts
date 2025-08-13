import axios, { AxiosError, AxiosRequestConfig } from "axios";

type Method = "get" | "post" | "put" | "delete" | "patch";

const baseURL = "https://api.themoviedb.org/3/";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("TMDB API: Unauthorized access. Check your API token.");
    }
    if (error.response && error.response.status === 429) {
      console.warn("TMDB API: Rate limit exceeded. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export type apiError = {
  isConnectionError: boolean;
  message: string;
};

const ApiRequest = async (
  method: Method,
  path: string,
  options = {},
  customConfig: AxiosRequestConfig = {}
) => {
  try {
    const request = await api[method](path, options, customConfig);
    return request.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      const connectionError: apiError = {
        isConnectionError: true,
        message: "Network error. Please check your internet connection."
      };
      throw connectionError;
    }

    throw axiosError?.response?.data ?? "An unknown error occurred";
  }
};

export const apiGet = async (
  path: string,
  options = {},
  customConfig: AxiosRequestConfig = {}
) => await ApiRequest("get", path, options, customConfig);

export const apiPost = async (
  path: string,
  options = {},
  customConfig: AxiosRequestConfig = {}
) => await ApiRequest("post", path, options, customConfig);

export const apiPut = async (
  path: string,
  options = {},
  customConfig: AxiosRequestConfig = {}
) => await ApiRequest("put", path, options, customConfig);

export const apiDelete = async (
  path: string,
  options = {},
  customConfig: AxiosRequestConfig = {}
) => await ApiRequest("delete", path, options, customConfig);

export const apiPatch = async (
  path: string,
  options = {},
  customConfig: AxiosRequestConfig = {}
) => await ApiRequest("patch", path, options, customConfig);

export const appendMovieQueryParams = (
  url: string,
  params: { [key: string]: string | number | boolean | undefined }
): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value !== "undefined") searchParams.set(key, String(value));
  });
  return searchParams.toString() ? `${url}?${searchParams.toString()}` : url;
};
