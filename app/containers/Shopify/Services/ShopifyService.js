import axios from 'axios';
import Utils from '../../Common/Utils';

const ShopifyService = {
  async getSettingsInfo(props) {
    const {
      location,
      changeTenantStatus,
      changeTenantId,
      changeEnabledTenant,
      changeTenantName
    } = props;
    const { store } = location.state;

    try {
      const response = await axios.get(
        `https://cenit.io/app/omna-dev/request_tenant_info?search=${store}`
      );

      if (response) {
        console.log(response);
        const { data } = response.data;
        Utils.setTenant(data);
        changeTenantStatus(data.isReadyToOmna);
        changeTenantId(data.tenantId);
        changeTenantName(data.name);
        changeEnabledTenant(data.enabled);
        // const collectionsInstalled = await this.installCollections();
        // if (collectionsInstalled) {
        //   const integrationInstalled = await this.installIntegration(data);
        //   if (integrationInstalled) {
        //     return true;
        //   }
        // }

      }
    } catch (error) {
      console.log(error);
    }
    return store;
  },

  // async installCollections() {
  //   // const {
  //   //  collections, fetchCollections, total, loading, /* task */
  //   // } = props;
  //   // const [page, setPage] = useState(0);
  //   // const [_params, _setParams] = useState({
  //   //   limit: 10,
  //   //   offset: 0,
  //   //   searchTerm: ''
  //   // });

  //   try {
  //     // fetchCollections({ ..._params });


  //     let collections = await API.get('/collections', {
  //       params: { limit: 100, offset: 0 }
  //     });

  //     // console.log(collections);

  //     if (collections) {
  //       collections = collections.data.data;
  //       const ids = collections.filter(item => item.status === 'no_installed');

  //       const collectionsInstalled = [];

  //       ids.forEach(async id => {
  //         const resp = await API.patch(`/collections/${id}`);
  //         collectionsInstalled.push(resp);
  //       });

  //       if (collectionsInstalled.lenght === collections.lenght) {
  //         return true;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   return false;
  // },

  // async installIntegration(data) {
  //   await API.post('/integrations', {
  //     data: { name: data.shop, channel: 'Ov2Shopify' }
  //   }).catch(error => {
  //     if (error) {
  //       if (
  //         error.response.data.message ===
  //         'Already exists an integration with the same name'
  //       ) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });

  //   return true;
  // },

  async getPlanInfoAvailablePlans(store) {
    try {
      const response = await axios.get(
        `https://cenit.io/app/omna-dev/plan?task=get&shop=${store}`
      );
      if (response) {
        const availablePlans = response.data.available_plans;
        const currentPlan = response.data.current_plan;
        return [availablePlans, currentPlan];
      }
    } catch (error) {
      console.log(error);
    }
    return [];
  },

  async CreatePlan(name, store) {
    try {
      const response = await axios.get(
        `https://cenit.io/app/omna-dev/plan?task=create&plan_name=${name}&shop=${store}`
      );
      if (response) {
        console.log(response.data.plan_created);
        return response.data.plan_created;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  },

  async ActivatePlan(planId, store) {
    try {
      const response = await axios.get(
        `https://cenit.io/app/omna-dev/plan?task=activate&plan_id=${planId}&shop=${store}`
      );
      if (response) {
        const plan = await this.getPlanInfoAvailablePlans(store);
        if (plan) {
          return plan[1];
        }
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  async CancelPlan(planId, store) {

    try {
      const response = await axios.get(
        `https://cenit.io/app/omna-dev/plan?task=cancel&plan_id=${planId}&shop=${store}`
      );
      if (response) {
        const plan = await this.getPlanInfoAvailablePlans(store);
        if (plan) {
          return plan[1];
        }
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  async getClientSettings(){
    try {
      const response = await axios.get(
        `https://cenit.io/app/omna-dev/client_settings`
      );
      if (response) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
    return [];
  }
  // getStoreName() {
  //   const name =  JSON.parse(localStorage.getItem('currentTenant')).name;
  //   console.log(name);
  //   return name;
  // }

};

// const mapStateToProps = state => ({
//   collections: state.getIn(['collections', 'collections']).toJS(),
//   task: state.getIn(['collections', 'task']),
//   total: state.getIn(['collections', 'total']),
//   loading: state.getIn(['collections', 'loading']),
//   ...state
// });

// const mapDispatchToProps = (dispatch) => ({
//   fetchCollections: bindActionCreators(setCollectionList, dispatch),
//   // onInstallCollection: bindActionCreators(installCollection, dispatch),
//   // onUninstallCollection: bindActionCreators(uninstallCollection, dispatch),
// });

// const ShopifyServiceMapped = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ShopifyService);

export default ShopifyService;
