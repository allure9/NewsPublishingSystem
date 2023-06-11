import axios from 'axios'

const request = axios.create({
  // baseURL: process.env.REACT_APP_BASE_API,
  baseURL: import.meta.env.VITE_REACT_APP_BASE_API,
  timeout: 3000,
  headers: {
    'content-Type': 'application/x-www-form-urlencoded',
  },
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

request.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default request
