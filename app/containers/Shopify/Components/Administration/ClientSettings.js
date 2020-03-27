import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import ShopifyService from '../../Services/ShopifyService';

function ClientSettings() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(async ()=>{

    const result = await ShopifyService.getSettingsInfo();
    if (result){
      setData(data);
      setLoading(false);
    }
  })

  const columns = ["Store Name", "Token", "App status", "Trial days", "Access token", "Plan id"];

  // const data = [
  // ["Joe James", "Test Corp", "Yonkers", "NY", "1", "1"]
  // ];

  const options = {
    filterType: 'checkbox',
  };

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
