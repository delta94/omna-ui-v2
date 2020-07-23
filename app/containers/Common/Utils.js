import { sha256 } from 'js-sha256';

const URL_LOCAL = 'http://127.0.0.1:4000';
const URL_DEV = 'https://develop.d2px3nipkhew1t.amplifyapp.com';
const URL_PROD = 'https://app.omna.io';
export const SECRET_SHOPIFY_APP = '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';

export const baseApiUrl = 'https://cenit.io/app/ecapi-v1';

const currentLocation = window.location.href;

export const baseAppUrl = currentLocation.includes('app.omna.io')
  ? URL_PROD
  : currentLocation.includes('https://develop.d2px3nipkhew1t.amplifyapp.com')
  ? URL_DEV
  : URL_LOCAL;

export const fullChannelName = channel => {
  if (channel) {
    const name = channel.substring(0, channel.length - 2);
    const acronym = channel.substring(channel.length - 2, channel.length);

    switch (acronym) {
      case 'SG':
        return `${name} Singapore`;
      case 'MY':
        return `${name} Malaysia`;
      case 'ID':
        return `${name} Indonesia`;
      case 'TH':
        return `${name} Thailand`;
      case 'TW':
        return `${name} Taiwan`;
      case 'PH':
        return `${name} Philippines`;
      case 'VN':
        return `${name} Vietnam`;
      default:
        return channel;
    }
  }
  return channel;
};

export const getCurrencySymbol = currency => {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'CNY':
      return '¥';
    case 'RUB':
      return '₽';
    case 'JPY':
      return '¥';
    default:
      return '$';
  }
};

export const returnAfterAuthorization = () => {
  return `${baseAppUrl}/installed-integrations`;
};

export const getHeaders = url => {
  const currentTenant = JSON.parse(localStorage.getItem('currentTenant'));
  const params = {};
  params.token = currentTenant.token;
  params.timestamp = Date.now();
  params.redirect_uri = returnAfterAuthorization();

  // Join the service path and the ordered sequence of characters, excluding the quotes,
  // corresponding to the JSON of the parameters that will be sent.
  const msg =
    url +
    JSON.stringify(params)
      .replace(/["']/g, '')
      .split('')
      .sort()
      .join('');

  // Generate the corresponding hmac using the js-sha256 or similar library.
  params.hmac = sha256.hmac.update(currentTenant.secret, msg).hex();

  // const queryParams = `&token=${params.token}&timestamp=${Date.now()}&hmac=${params.hmac}`;
  const queryString = Object.keys(params)
    .map(key => key + '=' + params[key])
    .join('&');

  return queryString;
};

export const handleAuthorization = path => {
  window.open(
    `${baseApiUrl}/${path}?redirect_uri=${returnAfterAuthorization()}&${getHeaders(
      path
    )}`
  );
};

export const setTenant = tenant => {
  localStorage.setItem('currentTenant', JSON.stringify(tenant));
};

export const delay = (_search, callBack, _delay = 1000) => {
  if (_search) {
    const timer = setTimeout(() => {
      callBack(_search);
      clearTimeout(timer);
    }, _delay);
    window.addEventListener('keydown', () => {
      clearTimeout(timer);
    });
  }
};

export const variantIcon = {
  success: 'md-checkmark-circle',
  warning: 'md-warning',
  error: 'md-alert',
  info: 'ios-information-circle',
  delete: 'md-trash',
  add: 'md-add-circle',
  schedule: 'md-time',
  refresh: 'md-refresh',
  arrowBack: 'md-arrow-back',
  play: 'md-play',
  filter: 'md-funnel',
  print: 'md-print',
  view: 'md-eye'
};

export const currentTenant = localStorage.getItem('currentTenant')
  ? JSON.parse(localStorage.getItem('currentTenant'))
  : null;

export const isAuthenticated = currentTenant;

export const getDeactivationDate = deactivationDate => {
  if (deactivationDate) {
    const time = new Date(deactivationDate).getTime() - new Date().getTime();
    return Math.round(time / (1000 * 3600 * 24));
  }

  return -1;
};

export const isTenantEnabled = deactivationDate => {
  const deactivation = getDeactivationDate(deactivationDate);
  return deactivation >= 1;
};

export const logout = () => {
  if (currentTenant) {
    localStorage.removeItem('currentTenant');
  }
  window.location.replace(`${baseApiUrl}/sign_out?redirect_uri=${baseAppUrl}`);
};

const URL_SHOPIFY = `https://${shopifyStoreName}/`;

export const logoutShopify = () => {
  if (currentTenant) {
    localStorage.removeItem('currentTenant');
  }
  window.location.replace(`${baseApiUrl}/sign_out?redirect_uri=${URL_SHOPIFY}`);
};

export const isOmnaShopify = currentTenant
  ? currentTenant.fromShopifyApp
  : null;

export const getLogo = channel => {
  const option = channel.replace(/[A-Z]{2}$/, '');
  switch (option) {
    case 'Amazon':
      return '/images/logo/amazon_logo.png';
    case 'Lazada':
      return '/images/logo/lazada_logo.png';
    case 'Qoo10':
      return '/images/logo/qoo10_logo.png';
    case 'Shopee':
      return '/images/logo/shopee_logo.png';
    case 'Shopify':
      return '/images/logo/shopify_logo.png';
    case 'MercadoLibre':
      return '/images/logo/mercadolibre_logo.png';
    default:
      return '/images/logo/marketplace_placeholder.jpg';
  }
};

export const getResourceOptions = () => {
  const options = [
    { value: 'products', name: 'Products' },
    { value: 'orders', name: 'Orders' },
    { value: 'brands', name: 'Brands' },
    { value: 'categories', name: 'Categories' }
  ];
  return options;
};

export const checkTypes = values => {
  if (values) {
    const obj = {};
    Object.keys(values).forEach(key => {
      obj[key] = values[key] || undefined;
    });
    return obj;
  }
  return undefined;
};
