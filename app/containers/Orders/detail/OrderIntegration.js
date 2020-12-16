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

const OrderIntegration = ({ classes, integration, updatedAt, lastImport }) => {
  const logo = getLogo(integration.channel_title);

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
        subheader={integration.name}
      />

      <List className={classes.root} dense>
        <ListItem>
          <ListItemText
            primary={
              <Fragment>
                <Typography className={classes.inline} variant="subtitle2">
                  {'Channel: '}
                </Typography>
                {integration.channel_title}
              </Fragment>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary={
              <Fragment>
                <Typography className={classes.inline} variant="subtitle2">
                  {'Order updated at: '}
                </Typography>
                {updatedAt != null
                  ? moment(updatedAt).format('Y-MM-DD H:mm')
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
                  {'Order last import: '}
                </Typography>
                {lastImport != null
                  ? moment(lastImport).format('Y-MM-DD H:mm')
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
  integration: PropTypes.object.isRequired,
  updatedAt: PropTypes.object.isRequired,
  lastImport: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderIntegration);
