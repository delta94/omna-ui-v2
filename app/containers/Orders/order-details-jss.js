const styles = theme => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    overflowX: 'auto'
  },
  subRoot: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    overflowX: 'auto'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  marginLeft2u: {
    marginLeft: theme.spacing(2)
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  marginRight: {
    marginRight: theme.spacing.unit
  },
  orderDetailContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  orderItem: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
});

export default styles;
