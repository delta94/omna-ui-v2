import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import filterDlgSizeHelper from 'utils/mediaQueries';

function DataTable(props) {
  const { columns, options, data } = props;

  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          cursor: 'pointer'
        }
      },
      MUIDataTableToolbar: {
        filterPaper: {
          width: filterDlgSizeHelper,
          minWidth: '345px'
        },
      },
      MUIDataTableFilter: {
        gridListTile: {
          '&:only-child': {
            maxWidth: '100%',
            flexBasis: '100%',
          }
        }
      }
    }
  });

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable columns={columns} data={data} options={options} />
    </MuiThemeProvider>
  );
}

DataTable.defaultProps = {
  data: undefined
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  data: PropTypes.any,
};

export default DataTable;
