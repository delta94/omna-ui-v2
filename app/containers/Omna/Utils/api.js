import axios from 'axios';

const API = axios.create({
  baseURL: 'https://cenit.io/app/ecapi-v1'
});

export default API;
