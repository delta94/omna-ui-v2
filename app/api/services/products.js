import history from 'utils/history';
import get from 'lodash/get';
import { CENIT_APP } from 'dan-containers/Utils/api';

export const getBulkEditProperties = async (payload) => {
  const {
    store, integration, category, enqueueSnackbar
  } = payload;
  let response;
  const integrationId = integration ? integration.value || integration : '';
  const categoryId = category ? category.value || category : '';
  try {
    const url = `/request_products?shop=${store}&integration_id=${integrationId}&category_id=${categoryId}&task=get_product_properties`;
    const resp = await CENIT_APP.get(url);
    const { product_properties: props } = resp.data;
    response = { data: props };
  } catch (error) {
    response = { error };
    enqueueSnackbar(get(response, ['error', 'message'], 'Error getting properties'), {
      variant: 'error'
    });
  }
  return response;
};

export const bulkEditProperties = async (payload) => {
  const {
    store, data, enqueueSnackbar
  } = payload;
  let response;
  try {
    const url = `/request_products?shop=${store}&task=bulk_product_properties`;
    const resp = await CENIT_APP.post(url, { data });
    response = resp.data;
    enqueueSnackbar('Updating products', { variant: 'info' });
    history.push(`/tasks/${response.data.id}`);
  } catch (error) {
    response = { error };
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return response;
};
