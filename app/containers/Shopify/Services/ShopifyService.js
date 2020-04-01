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

      }
    } catch (error) {
      console.log(error);
    }
    return store;
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

};

export default ShopifyService;
