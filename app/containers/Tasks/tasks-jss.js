const styles = theme => ({
  root: {
    marginTop: theme.spacing(2),
    overflowX: 'auto'
  },
  tabRoot: {
    backgroundColor: theme.palette.background.paper
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  marginLeft2u: {
    marginLeft: theme.spacing(2)
  },
  paddingBottom2u: {
    paddingBottom: theme.spacing(2)
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  margin: {
    margin: theme.spacing.unit
  },
  error: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
  gray: {
    color: 'gray'
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: theme.spacing(3, 0, 1, 1)
  },
  nameDiv: {
    paddingBottom: '2%'
  },
  name: {
    paddingBottom: '1%'
  },
  midmargin: {
    paddingLeft: '25%'
  },
  rightmargin: {
    paddingLeft: '25%'
  },
  errorChip: {
    display: 'inline-block',
    width: '100px',
    height: '20px',
    'font-size': '15px',
    'line-height': '20px',
    color: 'white',
    'padding-left': '20%',
    'border-radius': '25px',
    'background-color': '#d32f2f',
  },
  greenChip: {
    display: 'inline-block',
    width: '100px',
    height: '20px',
    'font-size': '15px',
    'line-height': '20px',
    color: 'white',
    'padding-left': '3%',
    'border-radius': '25px',
    'background-color': '#43a047',
  },
  grayChip: {
    display: 'inline-block',
    width: '100px',
    height: '20px',
    'font-size': '15px',
    'line-height': '20px',
    color: 'white',
    'padding-left': '10%',
    'border-radius': '25px',
    'background-color': '#607d8b',
  }
});

export default styles;
