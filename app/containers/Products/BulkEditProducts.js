import React from 'react';
import PropTypes from 'prop-types';
import { PapperBlock } from 'dan-components';
import PageHeader from 'dan-containers/Common/PageHeader';
import Wizard from 'dan-components/Products/bulkEdit/Wizard';

function BulkEditProducts(props) {
  const { history, appStore } = props;

  return (
    <div>
      <PageHeader title="Bulk edit products" history={history} />
      <PapperBlock title="Wizard" icon="ios-card" desc="At this point you can get the products by integration and category in order to do a bulk edit properties. Keep in mind not all the integrations have categories.">
        <Wizard shop={appStore.name} history={history} />
      </PapperBlock>
    </div>
  );
}

BulkEditProducts.propTypes = {
  history: PropTypes.object.isRequired,
  appStore: PropTypes.object.isRequired,
};

export default BulkEditProducts;
