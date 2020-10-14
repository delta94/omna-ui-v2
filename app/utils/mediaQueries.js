import { createMuiTheme } from '@material-ui/core/styles';

const filterDlgSizeHelper = () => {
  const theme = createMuiTheme();
  const width = theme.breakpoints.up('lg') ? '40%' : '100%';
  return width;
};

export default filterDlgSizeHelper;
