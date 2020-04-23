import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import ShopifyService from '../../Services/ShopifyService';

function ClientSettings() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getSettings() {
    const result = await ShopifyService.getClientSettings();
    if (result){
      setData(result.data);
      setLoading(false);
    }
  }

  useEffect(()=>{
    if (data.length === 0){
      getSettings();
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
      {loading && <Loading />}
      <MUIDataTable
        title="Client Settings"
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  )

}

export default ClientSettings;
