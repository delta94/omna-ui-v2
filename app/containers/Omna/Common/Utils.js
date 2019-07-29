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

  static returnAfterAuthorization() {
    return 'http://omna-ui-v2.s3-website-us-west-2.amazonaws.com/settings/integrations';
  }

  static baseAPIURL() {
    return 'https://cenit.io/app/ecapi-v1';
  }

  static baseAppUrl(url) {
    if (url.includes('127.0.0.1') || url.includes('localhost')) {
      return 'http://127.0.0.1:4000';
    }

    return 'https://master.d3voub2ei4aaze.amplifyapp.com';
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
