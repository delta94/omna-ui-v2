import axios from 'axios';

const API = axios.create({
    baseURL: `https://cenit.io/app/ecapi`

});

export default API;