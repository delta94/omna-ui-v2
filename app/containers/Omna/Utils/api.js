import axios from 'axios';
import { sha256 } from 'js-sha256';
import get from 'lodash/get';

function setParams(config) {
  const params = get(config, 'params', {});
  const data = get(config, 'data', {});
  const currentTenant = JSON.parse(sessionStorage.getItem('currentTenant'));
  if (config.method === 'post' || config.method === 'delete') {
    data.token = currentTenant.token;
    data.timestamp = Date.now();

    const msg = config.url + JSON.stringify(data).replace(/["']/g, '').split('').sort()
      .join('');

    // Generate the corresponding hmac using the js-sha256 or similar library.
    data.hmac = sha256.hmac.update(currentTenant.secret, msg).hex();
    return Object.assign(config, { data });
  }
  params.token = currentTenant.token;
  params.timestamp = Date.now();

  // Join the service path and the ordered sequence of characters, excluding the quotes,
  // corresponding to the JSON of the parameters that will be sent.
  const msg = config.url + JSON.stringify(params).replace(/["']/g, '').split('').sort()
    .join('');

  // Generate the corresponding hmac using the js-sha256 or similar library.
  params.hmac = sha256.hmac.update(currentTenant.secret, msg).hex();

  return Object.assign(config, { params });
}

const API = axios.create({
  baseURL: 'https://cenit.io/app/ecapi-v1',
});

API.interceptors.request.use(setParams, Promise.reject);

export default API;
