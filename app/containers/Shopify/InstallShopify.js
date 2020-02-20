import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Utils from '../Common/Utils';

function InstallShopify(props) {
  const { history, location, store } = props;

  if (store) {
    axios
      .get(
        `https://cenit.io/app/omna-dev/request_tenant_info?search=${
          location.search
        }`
      )
      .then(response => {
        Utils.setTenant(response.data);
        history.push('/');
      });
  }

  return <h1>Installation OMNA v1 Shopify app is in progress...</h1>;
}

InstallShopify.propTypes = {
  history: PropTypes.string.isRequired,
  store: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired
};

export default InstallShopify;
