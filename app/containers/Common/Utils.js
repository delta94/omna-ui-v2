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

// Authentication
export const getLocalStorage = () => {
  if (localStorage.getItem('currentTenant')) {
    return JSON.parse(localStorage.getItem('currentTenant'));
  }
  return null;
};

export const setLocalStorage = tenant => {
  const currentTenant = JSON.stringify(tenant);
  localStorage.setItem('currentTenant', currentTenant);
};

export const getter = {
  get IS_AUTHENTICATED() {
    if (getLocalStorage()) {
      return true;
    }
    return false;
  },
  get TENANT_ID() {
    if (getLocalStorage()) {
      const { tenantId } = getLocalStorage();
      return tenantId;
    }
    return '';
  },
  get STORE() {
    if (getLocalStorage()) {
      const { store } = getLocalStorage();
      return store;
    }
    return '';
  }
};

export const logout = () => {
  if (getter.IS_AUTHENTICATED) {
    localStorage.removeItem('currentTenant');
  }
  window.location.replace(`${baseApiUrl}/sign_out?redirect_uri=${baseAppUrl}`);
};

export const logoutShopify = () => {
  if (getter.IS_AUTHENTICATED) {
    window.location.replace(`https://${getter.STORE}/`);
    localStorage.removeItem('currentTenant');
  }
};

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

export const returnAfterAuthorization = () => `${baseAppUrl}/installed-integrations`;

export const getHeaders = url => {
  const currentTenant = JSON.parse(localStorage.getItem('currentTenant'));
  const params = {};
  params.token = currentTenant.token;
  params.timestamp = Date.now();
  params.redirect_uri = returnAfterAuthorization();

  // Join the service path and the ordered sequence of characters, excluding the quotes,
  // corresponding to the JSON of the parameters that will be sent.
  const msg = url
    + JSON.stringify(params)
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

export const delay = (callBack, _delay = 1000) => {
  const timer = setTimeout(() => {
    callBack();
    clearTimeout(timer);
  }, _delay);
  window.addEventListener('keydown', () => {
    clearTimeout(timer);
  });
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

export const getLogo = channel => {
  const option = channel.replace(/\s*\[.*?\]\s*/g, '').trim();
  switch (option) {
    case 'Amazon':
      return '/images/avatars/amazon_logo.png';
    case 'Lazada':
      return '/images/avatars/lazada_logo.png';
    case 'Qoo10':
      return '/images/avatars/qoo10_logo.png';
    case 'Shopee':
      return '/images/avatars/shopee_logo.png';
    case 'Shopify':
      return '/images/avatars/shopify_logo.png';
    case 'MercadoLibre':
      return '/images/avatars/mercadolibre_logo.png';
    default:
      return '/images/avatars/marketplace_placeholder.jpg';
  }
};

export const getImage = channel => {
  const option = channel.replace(/\s*\[.*?\]\s*/g, '').trim();
  switch (option) {
    case 'Lazada':
      return '/images/logo/__lazada.svg';
    case 'Shopee':
      return '/images/logo/__shopee.svg';
    case 'Shopify':
      return '/images/logo/__shopify.svg';
    default:
      return '/images/avatars/marketplace_placeholder.jpg';
  }
};

export const getChannelGroup = channelTitle => channelTitle.replace(/\s*\[.*?\]\s*/g, '').trim();

export const getIntegrationCardOptions = () => {
  const options = [
    { value: 'import products', name: 'Import products' },
    { value: 'import orders', name: 'Import orders' },
    { value: 'import brands', name: 'Import brands' },
    { value: 'import categories', name: 'Import categories' },
    { value: 'view categories', name: 'View categories' },
    { value: 'view brands', name: 'View brands' },
    { value: 'authorize', name: 'Authorize' },
    { value: 'unauthorize', name: 'Unauthorize' },
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

export const emptyArray = list => (list && (list.size === 0 || list.length === 0)) || false;

export function convertListToString(items, max = 2) {
  if (items && items.length > 0) {
    const list = items.slice(0, max).map(item => item.name || item);
    const more = items.length - max;
    more > 0 ? list.push(`+${more}`) : null;
    return list.join(', ');
  }
  return [];
}

export const hasCategories = (integrations, selectedIntegration) => {
  const integrationsWithNoCategory = ['Ov2Shopify'];
  const selected = selectedIntegration ? selectedIntegration.value || selectedIntegration : null;
  if (selected) {
    const integration = integrations ? integrations.data.find(item => item.id === selected) : null;
    if (integration) {
      const founded = integrationsWithNoCategory.find(item => item === integration.channel);
      if (founded) return false;
    }
  }
  return true;
};

export const getRemoteIds = (data, selectedIndexList, integration, type = 'product') => {
  const remoteIds = [];
  const selectedIntegration = integration ? integration.value || integration : null;
  if (selectedIntegration) {
    selectedIndexList.forEach(index => {
      const filteredIntegration = data[index].integrations.find(item => item.id === selectedIntegration);
      if (filteredIntegration) {
        if (type === 'product') {
          const { product } = filteredIntegration;
          remoteIds.push(product.remote_product_id);
        } else {
          const { variant } = filteredIntegration;
          remoteIds.push(variant.remote_variant_id);
        }
      }
    });
  }
  return remoteIds;
};

export const getCategoryVariant = (data, selectedIndexList, integration) => {
  const integrationValue = integration ? integration.value || integration : null;
  const variantItem = selectedIndexList && selectedIndexList.length > 0 ? data[selectedIndexList[0]] : null;
  const filteredIntegration = variantItem.integrations.find(item => item.id === integrationValue);
  const { category_id: categoryId } = filteredIntegration.variant;
  return categoryId;
};

export const editDynamicPropsHelper = (event, properties) => {
  const { name: nme, value: val } = event.target;
  const index = properties.findIndex(item => item.id === nme);
  if (index >= 0) {
    const property = properties[index];
    if (property.input_type !== 'single_select_with_remote_options') {
      property.value = val;
    } else {
      property.value = val ? val.id : '';
      property.options = val ? [val] : [];
    }
  }
  return [...properties];
};

export const updateRowsSelected = (data, indexList, currentSelectedIdsFromState, setStateIdsCallback, setStateIndexesCallback) => {
  const ids = [];
  const indexes = [];
  if (indexList) {
    if (indexList.length > 0) {
      indexList.forEach(index => ids.push(data[index].id));
      setStateIdsCallback(ids);
    } else {
      setStateIdsCallback([]);
    }
    setStateIndexesCallback(indexList);
  } else {
    data.forEach((item, index) => {
      if (currentSelectedIdsFromState.includes(item.id)) {
        ids.push(item.id);
        indexes.push(index);
      }
    });
    setStateIdsCallback(ids);
    setStateIndexesCallback(indexes);
  }
};
