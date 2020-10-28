const styles = theme => ({
  numericTableBodyCell: {
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(2)
    },
  },
  avatar: {
    height: 80,
    width: 80,
    marginRight: 16,
    borderRadius: 5,
    '& img': {
      objectFit: 'fill',
    }
  }
});

export default styles;
