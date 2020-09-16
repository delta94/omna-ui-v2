import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import { getClientSettings } from '../../Services/ShopifyService';

function ClientSettings(props) {

  const {
    location,
    enqueueSnackbar
  } = props;

  const { admin } = location.state;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getSettings() {
    const result = await getClientSettings(enqueueSnackbar);
    if (result){
      setData(result.data);
      setLoading(false);
    }
  }

  useEffect(()=>{

    if (admin === true){
      if (data.length === 0){
        getSettings();
      }
    }


  })

  const columns = ["Store Name", "Token", "App status", "Trial days", "Access token", "Plan id"];

  const options = {
    filter: true,
    selectableRows: 'none',
    download: false,
    print: false
  }
  return(
    <div>
      {admin ?
      <Fragment>
        {loading && <Loading />}
        <MUIDataTable
          title="Client Settings"
          data={data}
          columns={columns}
          options={options}
        />
      </Fragment>
      :
      <h1>No esta en admin</h1>
      }

    </div>
  )

}

ClientSettings.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  location: PropTypes.object
};

export default withSnackbar(ClientSettings);
