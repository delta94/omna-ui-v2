import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getLogo } from 'dan-containers/Common/Utils';
import styles from './order-detail-jss';

const OrderIntegration = ({ classes, integration }) => {
  const logo = getLogo(integration.channel);

  return (
    <Card
      className={classes.subRoot}
      style={{ flex: '1 1 auto', marginTop: 8 }}
    >
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
          <ListItemText
            primary={
              <Fragment>
                <Typography className={classes.inline} variant="subtitle2">
                  {`ID: `}
                </Typography>
                {integration.id}
              </Fragment>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Fragment>
                <Typography className={classes.inline} variant="subtitle2">
                  {`Name: `}
                </Typography>
                {integration.name}
              </Fragment>
            }
          />
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
          <ListItemText
            primary={
              <Fragment>
                <Typography className={classes.inline} variant="subtitle2">
                  {`Created at: `}
                </Typography>
                {integration.created_at != null
                  ? moment(integration.created_at).format('Y-MM-DD H:mm')
                  : ''}
              </Fragment>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Fragment>
                <Typography className={classes.inline} variant="subtitle2">
                  {`Updated at: `}
                </Typography>
                {integration.updated_at != null
                  ? moment(integration.updated_at).format('Y-MM-DD H:mm')
                  : ''}
              </Fragment>
            }
          />
        </ListItem>
      </List>
    </Card>
  );
};

OrderIntegration.propTypes = {
  classes: PropTypes.object.isRequired,
  integration: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderIntegration);
