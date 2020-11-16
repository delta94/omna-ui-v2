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
    color: 'white',
    backgroundColor: '#d32f2f',
  },
  greenChip: {
    color: 'white',
    backgroundColor: '#43a047',
  },
  grayChip: {
    color: 'white',
    backgroundColor: '#607d8b',
  }
});

export default styles;
