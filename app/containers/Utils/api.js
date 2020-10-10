import axios from 'axios';
import { sha256 } from 'js-sha256';
import get from 'lodash/get';
import qs from 'qs';
import { SECRET_SHOPIFY_APP, getLocalStorage } from 'dan-containers/Common/Utils';

function setParams(config) {
  const params = get(config, 'params', {});
  const data = get(config, 'data', {});
  const currentTenant = getLocalStorage();
  if (config.data) {
    if (config.url !== 'get_access_token') {
      data.token = currentTenant.token;
      data.timestamp = Date.now();

      const msg = config.url
        + JSON.stringify(data)
          .replace(/["']/g, '')
          .split('')
          .sort()
          .join('');

      // Generate the corresponding hmac using the js-sha256 or similar library.
      data.hmac = sha256.hmac.update(currentTenant.secret, msg).hex();
    }
    return Object.assign(config, { data });
  }
  params.token = currentTenant.token;
  params.timestamp = Date.now();

  // Join the service path and the ordered sequence of characters, excluding the quotes,
  // corresponding to the JSON of the parameters that will be sent.

  const msg = config.url
    + JSON.stringify(params)
      .replace(/["']/g, '')
      .split('')
      .sort()
      .join('');

  // Generate the corresponding hmac using the js-sha256 or similar library.
  params.hmac = sha256.hmac.update(currentTenant.secret, msg).hex();
  return Object.assign(config, {
    paramsSerializer: param => qs.stringify(param),
    params
  });
}

function setShopifyParams(config) {
  const params = get(config, 'params', {});
  const currentTenant = getLocalStorage();

  if (config.url.includes('request_tenant_info')) {
    return Object.assign(config, {
      paramsSerializer: param => qs.stringify(param),
      params
    });
  }
  params.token = currentTenant.token;
  params.timestamp = Date.now();

  const string = `timestamp=${params.timestamp}&token=${params.token}`;
  const secret = SECRET_SHOPIFY_APP;
  params.hmac = sha256.hmac.update(secret, string).hex();

  return Object.assign(config, {
    paramsSerializer: param => qs.stringify(param),
    params
  });
}

const API = axios.create({
  baseURL: 'https://cenit.io/app/ecapi-v1'
});

export const CENIT_APP = axios.create({
  baseURL: 'https://cenit.io/app/omnav1v2'
});

API.interceptors.request.use(setParams, Promise.reject);
CENIT_APP.interceptors.request.use(setShopifyParams, Promise.reject);


export default API;
