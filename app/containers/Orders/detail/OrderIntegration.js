import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { getLogo } from 'dan-containers/Common/Utils';

class OrderIntegration extends Component {
  render() {
    const { classes, integration } = this.props;
    const logo = getLogo(integration.channel);

    return (
      <Card className={classes.subRoot} style={{ flex: '1 1 auto' }}>
        <CardHeader
          avatar={
            logo ? (
              <Avatar
                src={logo}
                alt="logo"
                aria-label="Recipe"
                className={classes.avatar}
              />
            ) : null
          }
          title="Integration"
          subheader={integration.channel}
        />

        <List className={classes.root} dense>
          <ListItem>
            <Typography variant="subtitle2">ID:</Typography>
            <ListItemText primary={integration.id} />
          </ListItem>
          <ListItem>
            <Typography variant="subtitle2">Name:</Typography>
            <ListItemText primary={integration.name} />
          </ListItem>
          {/* <ListItem>
            <Typography variant="subtitle2">Authorized:</Typography>
            <ListItemText primary={integration.authorized} />
          </ListItem>
          <ListItem>
            <Typography variant="subtitle2">
              Last Import Orders Date:
            </Typography>
            <ListItemText
              primary={
                integration.last_import_orders_date != null
                  ? moment(integration.last_import_orders_date).format(
                    'Y-MM-DD H:mm:ss'
                  )
                  : '--'
              }
            />
          </ListItem> */}
          <ListItem>
            <Typography variant="subtitle2">Created at:</Typography>
            <ListItemText
              primary={
                integration.created_at != null
                  ? moment(integration.created_at).format('Y-MM-DD H:mm')
                  : '--'
              }
            />
          </ListItem>
          <ListItem>
            <Typography variant="subtitle2">Updated at:</Typography>
            <ListItemText
              primary={
                integration.updated_at != null
                  ? moment(integration.updated_at).format('Y-MM-DD H:mm')
                  : '--'
              }
            />
          </ListItem>
        </List>
      </Card>
    );
  }
}

OrderIntegration.propTypes = {
  classes: PropTypes.object.isRequired,
  integration: PropTypes.object.isRequired
};

export default OrderIntegration;
