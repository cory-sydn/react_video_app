import axios from "axios"

export const axiosInstance = axios.create({
  baseURL : "https://cory-youtube.herokuapp.com/api"
})