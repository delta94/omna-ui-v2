import React, { Fragment, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormBuilder from './FormBuilder';
import MySnackBar from '../Common/SnackBar';
import styles from './email-jss';

function Variants(props) {
  const { variantList, classes } = props;
  const [selectedIndex] = useState(0);
  const integration = variantList.size > 0 ? variantList[selectedIndex].integrations[0] : null;
  const properties = integration ? integration.variant.properties : null;
  // const { id, label, value, name, required, input_type: type, options, placeholder } = properties;

  return (
    <Fragment>
      <Typography variant="subtitle2">
        Variants
      </Typography>
      {variantList.size === 0 && (
        <div style={{ marginTop: '10px' }}>
          <MySnackBar
            variant="info"
            customStyle
            open={variantList.size === 0 || false}
            message="There are not available variants"
          />
        </div>

      )}
      {variantList && variantList.map(({
        sku, price, images, quantity
      }) => (
        <ExpansionPanel className={classes.emailList}>
          <ExpansionPanelSummary className={classes.emailSummary} expandIcon={<ExpandMoreIcon />}>
            <div className={classes.fromHeading}>
              <Avatar
                alt="avatar"
                src={images.length > 0 ? images[0] : '/images/screen/no-image.png'}
                className={classes.bigAvatar}
              />
              <Typography className={classes.heading}>
                {sku}
              </Typography>
            </div>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading} noWrap>{`Quantity: ${quantity} Item(s) - ${price}$`}</Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.variantExpansionPanelDetails}>
            <Grid container spacing={3}>
              {properties && properties.map(({
                id, label, name, required, input_type: type, options, value, placeholder
              }) => (
                <Grid item xs>
                  <FormBuilder
                    id={id}
                    name={name}
                    value={value}
                    label={label}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    options={options}
                  />
                </Grid>
              ))}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Fragment>
  );
}

Variants.propTypes = {
  variantList: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Variants);
