import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import PageHeader from 'dan-containers/Common/PageHeader';
import { getClientSettings } from '../../Services/ShopifyService';

function ClientSettings(props) {
  const { enqueueSnackbar, history } = props;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getSettings() {
    const result = await getClientSettings(enqueueSnackbar);
    if (result) {
      setData(result.data);
      setLoading(false);
    }
  }

  useEffect(() => {
    getSettings();
  }, []);

  const columns = ['Store Name', 'Token', 'App status', 'Trial days', 'Access token', 'Plan id'];

  const options = {
    filter: true,
    selectableRows: 'none',
    download: false,
    print: false
  };

  return (
    <div>
      <PageHeader title="Client Settings" history={history} />
      {loading && <Loading />}
      <MUIDataTable
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
}

ClientSettings.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(ClientSettings);
