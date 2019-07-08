class Utils {
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

  static uri4Back2SPA() {
    return 'http://omna-ui.s3-website-us-west-2.amazonaws.com/settings/stores';
  }

  static baseAPIURL() {
    return 'https://cenit.io/app/ecapi-v1';
  }

  static baseAppUrl() {
    return 'http://127.0.0.1:4000';
  }

  static isAuthenticated() {
    if (localStorage.getItem('user')) {
      return true;
    }

    return false;
  }

  static isAuthenticated2() {
    return true;
  }
}

export default Utils;
