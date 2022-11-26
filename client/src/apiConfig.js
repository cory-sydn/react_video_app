import axios from "axios"

// const BASE_URL = process.env.REACT_APP_VERCEL_URL
//   ? `https://${process.env.REACT_APP_VERCEL_URL}/api`
//   : 'http://localhost:8800/api';

export const axiosInstance = axios.create({
  baseURL : `${window.location.origin}/api`
})