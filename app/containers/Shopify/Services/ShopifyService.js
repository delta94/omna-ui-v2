import axios from 'axios';
import API from '../../Utils/api';
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
      const { data } = response.data;
      Utils.setTenant(data);
      changeTenantStatus(data.isReadyToOmna);
      changeTenantId(data.tenantId);
      changeTenantName(data.name);
      changeEnabledTenant(data.enabled);
      if (response) {
        const collectionsInstalled = await this.installCollections();
        if (collectionsInstalled) {
          const integrationInstalled = await this.installIntegration(data);
          if (integrationInstalled) {
            return true;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  },

  async installCollections() {
    try {
      let collections = await API.get('/collections', {
        params: { limit: 100, offset: 0 }
      });
      if (collections) {
        collections = collections.data.data;
        const ids = collections.filter(item => item.status === 'no_installed');

        const collectionsInstalled = [];

        ids.forEach(async id => {
          const resp = await API.patch(`/collections/${id}`);
          collectionsInstalled.push(resp);
        });

        if (collectionsInstalled.lenght === collections.lenght) {
          return true;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  },

  async installIntegration(data) {
    await API.post('/integrations', {
      data: { name: data.shop, channel: 'Ov2Shopify' }
    }).catch(error => {
      if (error) {
        if (
          error.response.data.message
          === 'Already exists an integration with the same name'
        ) {
          return true;
        }
      }
      return false;
    });

    return true;
  },

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
  }
};

export default ShopifyService;
