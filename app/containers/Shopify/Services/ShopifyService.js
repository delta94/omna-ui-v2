
import { CENIT_APP } from 'dan-containers/Utils/api'
import get from 'lodash/get';

  export async function getSettingsInfo(store, enqueueSnackbar) {
    try {
     const response = await CENIT_APP.get(`/request_tenant_info?search=${store}`);
     const { data } = response.data;
     return data;
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    return null;
  };

  export async function getPlanInfoAvailablePlans(store, enqueueSnackbar) {
    try {
      const response = await CENIT_APP.get(`/plan?task=get&shop=${store}`);
      if (response) {
        const availablePlans = response.data.available_plans;
        const currentPlan = response.data.current_plan;
        return { availablePlans, currentPlan };
      }
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    return null;
  };

  export async function createPlan(name, store, enqueueSnackbar) {
    try {
      const response = await CENIT_APP.get(`/plan?task=create&plan_name=${name}&shop=${store}`);
      if (response) {
        enqueueSnackbar('Plan was created successfully, please confirm it', {
          variant: 'success'
        });
        return response.data.plan_created;
      }
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    return false;
  };

  export async function activatePlan(planId, store, enqueueSnackbar) {
    try {
      const response = await CENIT_APP.get(`/plan?task=activate&plan_id=${planId}&shop=${store}`);
      if (response) {
        const plan = await getPlanInfoAvailablePlans(store);
        if (plan) {
          enqueueSnackbar('Plan was activated successfully', {
            variant: 'success'
          });
          return plan[1];
        }
      }
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    return null;
  };

  export async function cancelPlan(planId, store, enqueueSnackbar) {
    try {
      const response = await CENIT_APP.get(`/plan?task=cancel&plan_id=${planId}&shop=${store}`);
      if (response) {
        const plan = await getPlanInfoAvailablePlans(store);
        if (plan) {
          enqueueSnackbar('Plan was cancelled successfully', {
            variant: 'success'
          });
          return plan[1];
        }
      }
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    return null;
  };

  export async function getClientSettings(enqueueSnackbar) {
    try {
      const response = await CENIT_APP.get('/client_settings');
      if (response) {
        return response;
      }
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    return [];
  };
