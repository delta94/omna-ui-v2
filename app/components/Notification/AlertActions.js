import history from 'utils/history';
import { baseAppUrl } from 'dan-containers/Common/Utils';

export const subscribeAction = () => window.open('https://cenit.io/billing');

export const goToTaskAction = (id) => window.open(`${baseAppUrl}/tasks/${id}`);

export const subscribeShopifyPlanAction = () => history.push('shopify');
