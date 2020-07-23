import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import Avatar from '@material-ui/core/Avatar';

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: 'pointer'
      }
    }
  }
});

function EcommerceList(props) {
  const {
    data, rowsPerPage, page, count, integration, selectableRows, onChangeRowsPerPage, onChangePage, onSelectedItemsChange, onRemoteIdListChange
  } = props;

  const [rowsSelected, setRowsSelected] = useState([]);
  const [rowsSelectedIds, setRowsSelectedIds] = useState([]);
  const [rowsSelectedRemoteIds, setRowsSelectedRemoteIds] = useState([]);

  useEffect(() => {
    onSelectedItemsChange ? onSelectedItemsChange(rowsSelectedIds) : null;
  }, [rowsSelectedIds]);

  const updateRowsSelectedIds = () => {
    const list = [];
    const remoteIds = [];
    rowsSelected.forEach(index => {
      list.push(data[index] ? data[index].id : null);
      if (onRemoteIdListChange) {
        const filteredIntegration = data[index].integrations.find(item => item.id === integration);
        const { product } = filteredIntegration;
        remoteIds.push(product.remote_product_id);
        setRowsSelectedRemoteIds(remoteIds);
      }
    });
    setRowsSelectedIds(list);
  };

  useEffect(() => {
    updateRowsSelectedIds();
  }, [rowsSelected]);

  useEffect(() => {
    onRemoteIdListChange ? onRemoteIdListChange(rowsSelectedRemoteIds) : null;
  }, [rowsSelectedRemoteIds]);


  const handleChangeRowsPerPage = _rowsPerPage => onChangeRowsPerPage(_rowsPerPage);

  const handleChangePage = (pageValue) => onChangePage(pageValue);


  const columns = [
    {
      name: 'id',
      options: {
        filter: false,
        display: 'excluded'
      }
    },
    {
      name: 'images',
      label: 'Image',
      options: {
        filter: false,
        customBodyRender: (value, { columnIndex, rowData }) => {
          const [image] = rowData[columnIndex];
          const imgSrc = image || '/images/image_placeholder_listItem.png';
          return (
            <Avatar
              src={imgSrc}
              style={{
                height: 72,
                width: 72,
                marginRight: 16,
                borderRadius: 0
              }}
              alt="variant-avatar"
            />
          );
        }
      }
    },
    {
      name: 'name',
      label: 'name',
      options: {
        filter: false,
      }
    }
  ];

  const options = {
    filter: false,
    selectableRows,
    selectableRowsOnClick: true,
    rowsSelected,
    responsive: 'vertical',
    sort: false,
    download: false,
    print: false,
    search: false,
    viewColumns: false,
    serverSide: true,
    rowsPerPage,
    count,
    page,
    rowHover: true,
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          handleChangePage(tableState.page);
          break;
        case 'changeRowsPerPage':
          handleChangeRowsPerPage(tableState.rowsPerPage);
          break;
        default:
          break;
      }
    },
    customToolbarSelect: () => undefined,
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelectedIndex) => {
      setRowsSelected(rowsSelectedIndex);
    },
  };

  return (
    <div>
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable columns={columns} data={data} options={options} />
      </MuiThemeProvider>
    </div>
  );
}

EcommerceList.defaultProps = {
  selectableRows: 'multiple',
  rowsPerPage: 10,
  page: 0,
  count: 0,
  data: null,
  integration: undefined,
  onSelectedItemsChange: undefined,
  onRemoteIdListChange: undefined
};

EcommerceList.propTypes = {
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  count: PropTypes.number,
  selectableRows: PropTypes.string,
  data: PropTypes.any,
  integration: PropTypes.any,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onSelectedItemsChange: PropTypes.func,
  onRemoteIdListChange: PropTypes.func
};

/* const mapStateToProps = state => ({
  variantList: state.getIn(['variant', 'variantList']).toJS(),
  integrations: state.getIn(['integration', 'integrations']).toJS(),
  loading: state.getIn(['variant', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetVariants: bindActionCreators(getVariantList, dispatch),
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch),
  onDeleteVariant: bindActionCreators(deleteVariant, dispatch)
});

const VariantListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantList);

export default withSnackbar(VariantListMapped); */


export default EcommerceList;
