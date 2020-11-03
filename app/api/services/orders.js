// import history from 'utils/history';
// import get from 'lodash/get';
import { CENIT_APP } from 'dan-containers/Utils/api';

export default async function reExportOrder(params) {

  const { id, number, store, enqueueSnackbar } = params;

  try {
    const url = `/request_order?task=re_export_shopify_order&shop=${store}&id=${id}`;
    const response = await CENIT_APP.post(url);
    const { data } = response;
    enqueueSnackbar(`Order ${number} was sent to export`, { variant: 'info' });
    if (data) {
      this.callAPI();
    }
  } catch (error) {
    // enqueueSnackbar(`Error re-exporting the order ${number}`, { variant: 'error' });
  }

}
