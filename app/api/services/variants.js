import history from 'utils/history';
import get from 'lodash/get';
import api, { CENIT_APP } from 'dan-containers/Utils/api';

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
  const { store, integrationId, categoryId, enqueueSnackbar } = payload;
  let response;
  try {
    const url = `/request_products?shop=${store}&integration_id=${integrationId}&category_id=${categoryId}&task=get_product_properties`;
    const resp = await CENIT_APP.get(url);
    const { variant_properties: data } = resp.data;
    response = { data };
  } catch (error) {
    response = error;
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  return response;
};

export const bulkEditProperties = async (payload) => {
  const { store, remoteIds, basicProperties, integrationProperties, enqueueSnackbar } = payload;
  let response;
  try {
    const url = `/request_products?shop=${store}&task=bulk_variant_properties`;
    const resp = await CENIT_APP.post(url, {
      data:
      {
        remotes_variants_id: remoteIds,
        basic_properties: basicProperties,
        integration_properties: integrationProperties
      }
    });
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

export default deleteVariant;
