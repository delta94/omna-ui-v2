
import get from 'lodash/get';
import { CENIT_APP } from 'dan-containers/Utils/api';
import { setLocalStorage } from 'dan-containers/Common/Utils';

export function planStatusNotification(planName, planStatus, subscribeAction) {
  let notification = null;

  switch (planStatus) {
    case 'expired':
      notification = {
        message: `The ${planName} plan is ${planStatus}, please select a plan to use the app completely`,
        variant: 'error',
        action: subscribeAction
      };
      break;
    case 'pending':
      notification = {
        message: `The ${planName} plan is ${planStatus}, please confirm the plan to use the app completely`,
        variant: 'warning',
        action: subscribeAction
      };
      break;
    case 'cancelled':
      notification = {
        message: `The ${planName} plan is ${planStatus}, please select a plan to use the app completely`,
        variant: 'error',
        action: subscribeAction
      };
      break;
    case '':
      notification = {
        message: 'Please select a plan to could use the app',
        variant: 'error',
        action: subscribeAction
      };
      break;
    default:
      return null;
  }

  return notification;
}

export async function getSettingsInfo(store, admin, enqueueSnackbar) {
  try {
    const response = await CENIT_APP.get(`/request_tenant_info?search=${store}&admin=${admin}`);
    const { data } = response.data;
    return data;
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', `Error: ${error}`), {
      variant: 'error'
    });
  }
  return null;
}

async function reloadTenantInfo(store, admin, enqueueSnackbar) {
  try {
    const response = await CENIT_APP.get(`/request_tenant_info?search=${store}&admin=${admin}`);
    const { data } = response.data;
    if (data) {
      setLocalStorage(data);
      // enqueueSnackbar('Reload app information successfully', {
      //   variant: 'success'
      // });
      return data;
    }
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', `Error reloading tenant info: ${error}`), {
      variant: 'error'
    });
  }
  return null;
}

export async function getPlanInfoAvailablePlans(store, enqueueSnackbar) {
  try {
    const { data } = await CENIT_APP.get(`/plan?task=get&shop=${store}`);

    if (data) {
      const availablePlans = data.available_plans;
      const currentPlan = data.current_plan;
      return { availablePlans, currentPlan };
    }
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error getting the tenant information'), {
      variant: 'error'
    });
  }
  return null;
}

export async function createPlan(name, store, enqueueSnackbar) {
  try {
    const response = await CENIT_APP.get(`/plan?task=create&plan_name=${name}&shop=${store}`);
    if (response) {
      await reloadTenantInfo(store, false, enqueueSnackbar);
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
}

export async function activatePlan(planId, store, enqueueSnackbar) {
  try {
    const { data } = await CENIT_APP.get(`/plan?task=activate&plan_id=${planId}&shop=${store}`);

    if (data) {
      const { currentPlan } = await getPlanInfoAvailablePlans(store);
      await reloadTenantInfo(store, false, enqueueSnackbar);
      enqueueSnackbar('Plan was activated successfully', {
        variant: 'success'
      });
      return currentPlan;
    }
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return null;
}

export async function cancelPlan(planId, store, enqueueSnackbar) {
  try {
    const { data } = await CENIT_APP.get(`/plan?task=cancel&plan_id=${planId}&shop=${store}`);

    if (data) {
      const { currentPlan } = await getPlanInfoAvailablePlans(store);
      if (currentPlan) {
        await reloadTenantInfo(store, false, enqueueSnackbar);
        enqueueSnackbar('Plan was cancelled successfully', {
          variant: 'success'
        });
        return currentPlan;
      }
    }
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return null;
}

export async function getClientSettings(enqueueSnackbar) {
  try {
    const response = await CENIT_APP.get('/client_settings');
    if (response) {
      return response.data;
    }
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return [];
}
