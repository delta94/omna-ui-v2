import { sha256 } from 'js-sha256';

class Utils {
  constructor() {
    this.URL_DEV = 'http://127.0.0.1:4000';
    this.URL_PROD = 'app.omna.io';
  }

  static fullChannelName(channel) {
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
  }

  static urlLogo(channel) {
    switch (channel && channel.substring(0, channel.length - 2)) {
      case 'Lazada':
        return '/images/lazada_logo.png';
      case 'Qoo10':
        return '/images/qoo10_logo.png';
      case 'Shopee':
        return '/images/shopee_logo.png';
      default:
        return '/images/lazada_logo.png';
    }
  }

  getURL() {
    const url = window.location.href;
    if (url.includes('127.0.0.1') || url.includes('localhost')) {
      return this.URL_DEV;
    }
    return this.URL_PROD;
  }

  static getHeaders(url) {
    const currentTenant = JSON.parse(sessionStorage.getItem('currentTenant'));
    const params = {};
    params.token = currentTenant.token;
    params.timestamp = Date.now();
    params.redirect_uri = this.returnAfterAuthorization();

    // Join the service path and the ordered sequence of characters, excluding the quotes,
    // corresponding to the JSON of the parameters that will be sent.
    const msg = url + JSON.stringify(params).replace(/["']/g, '').split('').sort()
      .join('');

    // Generate the corresponding hmac using the js-sha256 or similar library.
    params.hmac = sha256.hmac.update(currentTenant.secret, msg).hex();

    // const queryParams = `&token=${params.token}&timestamp=${Date.now()}&hmac=${params.hmac}`;
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    return queryString;
  }

  static logout() {
    if (sessionStorage.getItem('currentTenant')) {
      sessionStorage.removeItem('currentTenant');
    }
    window.location.replace(`${this.baseAPIURL()}/sign_out?redirect_uri=${new Utils().getURL()}`);
  }

  static handleAuthorization(path) {
    window.location.replace(`${this.baseAPIURL()}/${path}?redirect_uri=${this.returnAfterAuthorization()}&${this.getHeaders(path)}`);
  }

  static returnAfterAuthorization() {
    return `${new Utils().getURL()}/app/settings/integrations`;
  }

  static baseAPIURL() {
    return 'https://cenit.io/app/ecapi-v1';
  }

  static baseAppUrl() {
    return new Utils().getURL();
  }

  static getUser() {
    if (sessionStorage.getItem('currentTenant')) {
      return JSON.parse(sessionStorage.getItem('currentTenant'));
    }
    return null;
  }

  static setUser(user) {
    sessionStorage.setItem('currentTenant', JSON.stringify(user));
  }

  static isAuthenticated() {
    if (sessionStorage.getItem('currentTenant')) {
      return true;
    }
    return false;
  }

  static iconVariants() {
    const variantIcon = {
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
      view: 'md-eye',
    };

    return variantIcon;
  }
}

export default Utils;
