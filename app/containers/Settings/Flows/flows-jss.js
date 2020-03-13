const styles = theme => ({
  inputWidth: {
    width: '300px'
  },
  marginTop: {
    marginTop: theme.spacing.unit
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  padding: {
    padding: theme.spacing.unit
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    padding: '5px'
  },
  actions: {
    // padding: theme.spacing(1)
  },
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  icon: {
    color: '#9e9e9e'
  },
  pageTitle: {
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    },
    '& h4': {
      fontWeight: 600,
      textTransform: 'capitalize',
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(3)
      }
    }
  },
  darkTitle: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.primary.main
        : theme.palette.primary.dark
  },
  lightTitle: {
    color: theme.palette.common.white
  }
});

export default styles;
