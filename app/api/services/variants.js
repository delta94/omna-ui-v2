import history from 'utils/history';
import get from 'lodash/get';
import api, { CENIT_APP } from 'dan-containers/Utils/api';

export const getVariant = async (payload) => {
  const { productId, variantId, enqueueSnackbar } = payload;
  let response;
  try {
    const resp = await api.get(`/products/${productId}/variants/${variantId}`);
    response = resp.data;
  } catch (error) {
    response = { error };
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return response;
};

const deleteVariant = async (payload) => {
  const { productId, variantId, enqueueSnackbar } = payload;
  let response;
  try {
    response = await api.delete(`/products/${productId}/variants/${variantId}`);
    enqueueSnackbar('Variant deleted successfuly', {
      variant: 'success'
    });
  } catch (error) {
    response = error;
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return response;
};

export const getBulkEditProperties = async (payload) => {
  const { store, integration, category, enqueueSnackbar } = payload;
  let response;
  try {
    const integrationId = integration ? integration.value || integration : '';
    const categoryId = category ? category.value || category : '';
    const url = `/request_products?shop=${store}&integration_id=${integrationId}&category_id=${categoryId}&task=get_product_properties`;
    const resp = await CENIT_APP.get(url);
    const { variant_properties: data } = resp.data;
    response = { data };
  } catch (error) {
    response = { error };
    enqueueSnackbar(get(response, ['error', 'message'], 'Error getting properties'), {
      variant: 'error'
    });
  }
  return response;
};

export const bulkEditProperties = async (payload) => {
  const { store, data, enqueueSnackbar } = payload;
  let response;
  try {
    const url = `/request_products?shop=${store}&task=bulk_variant_properties`;
    const resp = await CENIT_APP.post(url, { data });
    response = resp.data;
    history.push(`/tasks/${response.data.id}`);
    enqueueSnackbar('Updating variants', { variant: 'info' });
  } catch (error) {
    response = error;
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return response;
};

export const getVariantsFromIntegration = async (payload) => {
  const { integrationId, remoteProductId, enqueueSnackbar } = payload;
  let response;
  try {
    const resp = await api.get(`/integrations/${integrationId}/products/${remoteProductId}/variants`, { params: { offset: 0, limit: 25, with_details: true } });
    response = resp.data;
  } catch (error) {
    response = { error };
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return response;
};

export const updateIntegrationVariant = async (payload) => {
  const { integrationId, remoteProductId, remoteVariantId, data, enqueueSnackbar } = payload;
  let response;
  try {
    const resp = await api.post(`integrations/${integrationId}/products/${remoteProductId}/variants/${remoteVariantId}`, { data });
    response = resp.data;
    enqueueSnackbar ? enqueueSnackbar('Variant edited successfuly', {
      variant: 'success'
    }) : null;
  } catch (error) {
    response = { error };
    enqueueSnackbar ? enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    }) : null;
  }
  return response;
};

export default deleteVariant;
