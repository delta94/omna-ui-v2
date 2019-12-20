import React from 'react';
import { lighten, darken } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit}px 0`,
  },
  total: {
    fontWeight: '700',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  orderSummary: {
    [theme.breakpoints.up('md')]: {
      width: 600,
      margin: '0 auto'
    },
  },
  paper: {
    background: theme.palette.type === 'dark' ? darken(theme.palette.secondary.main, 0.5) : lighten(theme.palette.secondary.light, 0.5),
    /* padding: theme.spacing(2), */
    /* height: 550, */
    overflow: 'auto',
    '& h6': {
      textAlign: 'center',
    }
  },
  thumb: {
    width: 120,
    height: 70,
    overflow: 'hidden',
    borderRadius: theme.rounded.small,
    '& img': {
      maxWidth: '100%'
    }
  },
  totalPrice: {
    '& h6': {
      textAlign: 'right',
      width: '100%',
      '& span': {
        color: theme.palette.primary.main,
        fontSize: 28
      }
    },
  },
  bigAvatar: {
    width: 80,
    height: 80,
    boxShadow: theme.glow.light
  },
});

function SideVariantlist(props) {
  const {
    classes, index, sku, price, images, quantity, selectedIndex, onClick
  } = props;
  return (
    <Paper className={classes.paper} elevation={0}>
      <List component="ul">
        <ListItem selected={selectedIndex === index} onClick={() => { onClick(); }}>
          <Avatar
            alt="avatar"
            src={images.length > 0 ? images[0] : '/images/screen/no-image.png'}
            className={classes.bigAvatar}
          />
          <ListItemText
            primary={sku}
            secondary={`Quantity: ${quantity} Item(s) - ${price}$`}
            className={classes.itemText}
          />
        </ListItem>
        <li>
          <Divider />
        </li>
      </List>
    </Paper>
  );
}

SideVariantlist.propTypes = {
  classes: PropTypes.object.isRequired,
  sku: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  images: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(SideVariantlist);
