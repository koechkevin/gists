import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

import { ServerEnv } from '../env';

const serverEnv = ServerEnv();

export const CancelToken = axios.CancelToken;

export const source = CancelToken.source();

interface CustomizeConfig extends AxiosRequestConfig {
  retry: number;
  retryDelay: number;
}

// axios config options
const options: CustomizeConfig = {
  retry: 0,
  timeout: 100000,
  retryDelay: 1000,
  paramsSerializer: (params: any) => qs.stringify(params),
};

const AxiosInstance = axios.create(options);

// Set retry mechanism
AxiosInstance.interceptors.response.use(undefined, (err) => {
  const config = err.config;

  if (!config || !config.retry) {
    return Promise.reject(err);
  }

  config.__retryCount = config.__retryCount || 0;
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }

  config.__retryCount += 1;
  return new Promise((resolve) => {
    setTimeout(() => resolve(), config.retryDelay);
  }).then(() => axios(config));
});

// GET
// Note: this method is not exported because it should be used from wrapper methods only.
const GET = (url: string, params?: any, config?: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    AxiosInstance.get(url, { params, ...config })
      .then((res: AxiosResponse) => {
        if (res.data._meta) {
          const {
            total_count: totalCount,
            page_count: pageCount,
            current_page: currentPage,
            per_page: perPage,
          } = res.data._meta;

          const pagination = {
            currentPage: Number(currentPage),
            perPage: Number(perPage),
            totalCount: Number(totalCount),
            pageCount: Number(pageCount),
          };

          resolve({ ...res, pagination });
        }
        resolve(res);
      })
      .catch((error: any) => reject(error));
  });
};

// Aurora API
export const GET_API = (url: string, params?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.apiUrl;
  return GET(url, params, c);
};

// Aurora Chat API
export const GET_CHAT_API = (url: string, params?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.chatApiUrl;
  return GET(url, params, c);
};

// Aurora File Server API
export const GET_FILES_API = (url: string, params?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.fileServerApiUrl;
  return GET(url, params, c);
};

// POST
// Note: this method is not exported because it should be used from wrapper methods only.
const POST = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    AxiosInstance.post(url, data, config)
      .then((res: AxiosResponse) => resolve(res))
      .catch((error: any) => reject(error));
  });
};

// Aurora API
export const POST_API = (url: string, data?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.apiUrl;
  return POST(url, data, c);
};

// Aurora Chat API
export const POST_CHAT_API = (url: string, data?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.chatApiUrl;
  return POST(url, data, c);
};

// Aurora File Server API
export const POST_FILES_API = (url: string, data?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.fileServerApiUrl;
  return POST(url, data, c);
};

// PUT
// Note: this method is not exported because it should be used from wrapper methods only.
const PUT = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    AxiosInstance.put(url, data, config)
      .then((res: AxiosResponse) => resolve(res))
      .catch((error: any) => reject(error));
  });
};

// Aurora API
export const PUT_API = (url: string, data?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.apiUrl;
  return PUT(url, data, c);
};

// Aurora Chat API
export const PUT_CHAT_API = (url: string, data?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.chatApiUrl;
  return PUT(url, data, c);
};

// Aurora File Server API
export const PUT_FILES_API = (url: string, data?: any, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.fileServerApiUrl;
  return PUT(url, data, c);
};

// DELETE
// Note: this method is not exported because it should be used from wrapper methods only.
const DELETE = (url: string, config?: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    AxiosInstance.delete(url, config)
      .then((res: AxiosResponse) => resolve(res))
      .catch((error: any) => reject(error));
  });
};

// Aurora API
export const DELETE_API = (url: string, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.apiUrl;
  return DELETE(url, c);
};

// Aurora Chat API
export const DELETE_CHAT_API = (url: string, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.chatApiUrl;
  return DELETE(url, c);
};

// Aurora File Server API
export const DELETE_FILES_API = (url: string, config?: AxiosRequestConfig) => {
  const c: AxiosRequestConfig = config || {};
  c.baseURL = serverEnv.fileServerApiUrl;
  return DELETE(url, c);
};

export default AxiosInstance;
