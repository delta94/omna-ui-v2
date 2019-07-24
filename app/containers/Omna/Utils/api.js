import axios from 'axios';
import { sha256 } from 'js-sha256';
import get from 'lodash/get';

function setParams(config) {
  const params = get(config, 'params', {});
  const currentTenant = JSON.parse(sessionStorage.getItem('currentTenant'));
  params.token = currentTenant.token;
  params.timestamp = Date.now();
  if (config.data) {
    params.data = { ...config.data.data };
  }
  // Join the service path and the ordered sequence of characters, excluding the quotes,
  // corresponding to the JSON of the parameters that will be sent.
  const msg = config.url + JSON.stringify(params).replace(/["']/g, '').split('').sort()
    .join('');

  // Generate the corresponding hmac using the js-sha256 or similar library.
  params.hmac = sha256.hmac.update(currentTenant.secret, msg).hex();

  return Object.assign(config, { params });
}

const API = axios.create({
  baseURL: 'https://cenit.io/app/ecapi-v1'
});

API.interceptors.request.use(
  (config) => setParams(config),
  (error) => Promise.reject(error)
);

export default API;
