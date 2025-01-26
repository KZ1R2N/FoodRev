import axios from 'axios';
import { baseURL } from '../Context'; 

const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your server’s base URL
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
