import axios from 'axios';

const http = axios.create ({
  baseURL: process.env.VUE_APP_FB_URL
})


export default http