/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
// core
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// icons
import StorageIcon from '@material-ui/icons/Storage';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import StoreIcon from '@material-ui/icons/Store';
import TasksIcon from '@material-ui/icons/Assignment';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

const DEFAULT_MENU_ITEMS = [
  {
    text: 'Data',
    icon: <StorageIcon />,
    link: '',
    expandableItem: true,
    subItems: [{ icon: <VerticalSplitIcon />, text: 'Orders', link: '/orders' }]
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    link: '',
    expandableItem: true,
    subItems: [
      { icon: <StoreIcon />, text: 'Stores', link: '/settings/stores' },
      { icon: <SwapCallsIcon />, text: 'Workflows', link: '/settings/flows' },
      { icon: <TasksIcon />, text: 'Tasks', link: '/settings/tasks' }
    ]
  },
  {
    text: 'Notifications',
    icon: <NotificationsIcon />,
    link: '/notifications',
    expandableItem: false
  }
];

const Item = ({
  icon,
  text,
  link,
  classes,
  open,
  expandableItem,
  subItems = [],
  onClick
}) => (
  <Fragment>
    {expandableItem ? (
      <ListItem button onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText inset primary={text} />
        {expandableItem ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItem>
    ) : (
      <ListItem button onClick={onClick} component={Link} to={link}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText inset primary={text} />
        {expandableItem ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItem>
    )}

    <Collapse in={open} timeout="auto" unmountOnExit>
      {subItems
        && subItems.map(({ subItemIcon, subItemText, subItemLink }, key) => (
          <List key={key} component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              component={subItemLink}
              to={subItemLink}
            >
              <ListItemIcon>{subItemIcon}</ListItemIcon>
              <ListItemText inset primary={subItemText} />
            </ListItem>
          </List>
        ))}
    </Collapse>
  </Fragment>
);

class MenuItems extends Component {
  state = {
    openItems: {}
  };

  handleExpandItem = (key, expandableItem) => () => {
    if (expandableItem) {
      const { openItems } = this.state;
      openItems[key] = !openItems[key];
      this.setState({ openItems: { ...openItems } });
    }
  };

  render() {
    const { classes } = this.props;
    const { openItems } = this.state;

    return (
      <div>
        <List>
          {DEFAULT_MENU_ITEMS
            && DEFAULT_MENU_ITEMS.map(
              ({
                text, icon, link, expandableItem, subItems
              }, index) => (
                <Item
                  key={index}
                  icon={icon}
                  text={text}
                  link={link}
                  classes={classes}
                  subItems={subItems}
                  expandableItem={expandableItem}
                  open={openItems[index]}
                  onClick={this.handleExpandItem(index, expandableItem)}
                />
              )
            )}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(MenuItems);
