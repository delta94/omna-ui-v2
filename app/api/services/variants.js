import get from 'lodash/get';
import api from 'dan-containers/Utils/api';

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

export default deleteVariant;
