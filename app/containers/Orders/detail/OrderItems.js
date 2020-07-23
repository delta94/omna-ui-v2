import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MUIDataTable from 'mui-datatables';
import { getCurrencySymbol } from 'dan-containers/Common/Utils';

class OrderItems extends Component {
  state = {
    limit: 10,
    page: 0
  };

  handleChangeRowsPerPage = event => {
    this.setState({ limit: parseInt(event.target.value, 10) });
  };

  render() {
    const { order } = this.props;
    const { limit, page } = this.state;

    const columns = [
      {
        name: 'id',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          filter: false
        }
      },
      {
        name: 'sku',
        label: 'SKU',
        options: {}
      },
      {
        name: 'price',
        label: 'Price',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const { currency } = tableMeta.rowData;

            return (
              <div>
                {`${getCurrencySymbol(currency)}
                  ${value.toFixed(2)} ${currency || ''}`}
              </div>
            );
          }
        }
      },
      {
        name: 'quantity',
        label: 'Amount',
        options: {
          filter: false
        }
      },
      {
        name: 'price',
        label: 'Total',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const { currency } = tableMeta.rowData;
            return (
              <div>
                {`${getCurrencySymbol(currency)}
                  ${(tableMeta.rowData[3] * tableMeta.rowData[4]).toFixed(
                    2
                  )} ${currency || ''}`}
              </div>
            );
          }
        }
      },
      {
        name: 'currency',
        options: {
          filter: false,
          display: 'excluded'
        }
      }
    ];

    const options = {
      filter: 'false',
      responsive: 'stacked',
      viewColumns: false,
      download: false,
      print: false,
      search: false,
      selectableRows: 'none',
      rowsPerPage: limit,
      count: order.data.line_items.length,
      page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.handleChangePage(tableState.page);
            break;
          case 'changeRowsPerPage':
            this.handleChangeRowsPerPage(tableState.rowsPerPage);
            break;
          default:
            break;
        }
      }
    };

    return (
      <MUIDataTable
        title="Items"
        data={order.data.line_items}
        columns={columns}
        options={options}
      />
      // <Card className={classes.subRoot}>
      //   <Typography variant="subtitle1" className={classes.marginLeft}>
      //     <strong>Items</strong>
      //   </Typography>
      //   <div>
      //     {order.data.line_items
      //       ? order.data.line_items.map(row => (
      //           <div key={get(row, 'id', 0)}>
      //             <div className="display-flex justify-content-space-between">
      //               <div className={classes.marginLeft2u}>
      //                 <Typography variant="caption">{row.id}</Typography>
      //               </div>
      //               <div>
      //                 <Typography variant="caption" color="primary">
      //                   <strong>Name:</strong> {get(row, 'name', null)}
      //                 </Typography>
      //                 <Typography variant="caption" color="secondary">
      //                   <strong>SKU:</strong> {get(row, 'sku', null)}
      //                 </Typography>
      //               </div>
      //               <div>
      //                 <Typography variant="caption" color="inherit">
      //                   ${get(row, 'price', 0) + 'x' + get(row, 'quantity', 0)}
      //                 </Typography>
      //               </div>
      //               <div className={classes.marginRight}>
      //                 <Typography variant="caption">
      //                   ${row.price * row.quantity}
      //                 </Typography>
      //               </div>
      //             </div>
      //             <Divider />
      //           </div>
      //         ))
      //       : null}
      //   </div>
      // </Card>
    );
  }
}

OrderItems.propTypes = {
  order: PropTypes.object.isRequired
};

export default OrderItems;
