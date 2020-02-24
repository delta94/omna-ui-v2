import React from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// import LoadingState from 'dan-containers/Common/LoadingState';
// import Utils from '../Common/Utils';
// import API from '../Utils/api';
// import { setEnabledTenant } from '../../actions/TenantActions';

function InstallShopify() {
  // const {
  //   history,
  //   location,
  //   // changeTenantId,
  //   // changeEnabledTenant,
  //   // changeTenantName,
  //   enabled,
  //   store
  // } = props;
  // const [loading, setloading] = useState(true);
  /*  useEffect(() => {
    // console.log(this.context.store.fromShopifyApp);
    if (store) {
      axios
        .get(
          `https://cenit.io/app/omna-dev/request_tenant_info?search=${
            location.search
          }`
        )
        .then(response => {
          const { data } = response.data;
          setloading(false);
          Utils.setTenant(data);
          changeTenantId(data.tenantId);
          changeTenantName(data.name);
          changeEnabledTenant(data.enabled);

          API.post('/integrations', {
            data: { name: data.shop, channel: 'Ov2Shopify' }
          })
            .then(responseIntegration => {
              // const { data } = responseIntegration.data;
              console.log(responseIntegration);
            })
            .catch(error => {
              console.log(error);
            })
            .then(() => {
              // history.push('/');
              // get product
            });
        });
    }
  }, []); */

  return (
    <div>
      <h1>Hi</h1>
      {/* {loading && (
        <LoadingState
          loading={loading}
          text="Loading OMNA settings from Shopify"
        />
      )} */}
    </div>
  );
}

// InstallShopify.propTypes = {
//   history: PropTypes.object.isRequired,
//   store: PropTypes.string.isRequired,
//   location: PropTypes.object.isRequired,
//   changeEnabledTenant: PropTypes.bool.isRequired,
//   changeTenantId: PropTypes.func.isRequired,
//   changeTenantName: PropTypes.func.isRequired
// };

// const mapStateToProps = state => ({
//   enabled: state.getIn(['tenant', 'enabled']),
//   ...state
// });

// const mapDispatchToProps = dispatch => ({
//   changeEnabledTenant: bindActionCreators(setEnabledTenant, dispatch)
// });

// const InstallShopifyMapped = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(InstallShopify);

// export default InstallShopifyMapped;

export default InstallShopify;
