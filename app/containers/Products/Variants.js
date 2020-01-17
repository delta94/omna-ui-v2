import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormBuilder from './FormBuilder';
import MySnackBar from '../Common/SnackBar';
import LoadingState from '../Common/LoadingState';
import styles from './email-jss';

const VariantDetails = (params) => {
  const { integrations, selectedTab } = params;
  const integration = integrations.find(item => item.id === selectedTab);
  const properties = integration ? integration.variant.properties : null;
  if (integration) {
    return (
      <Fragment>
        {properties ? (
          <Grid container spacing={6} direction="row" justify="flex-start">
            {properties.map(({
              id, label, name, required, input_type: type, options, value, placeholder
            }) => (
              <Grid key={id} item>
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
            ))
            }
          </Grid>
        )
          : (
            <div style={{ marginTop: '10px' }}>
              <MySnackBar
                variant="info"
                customStyle
                open
                message="There is not available properties"
              />
            </div>
          )
        }
      </Fragment>

    );
  }
  return (
    <div style={{ marginTop: '10px' }}>
      <MySnackBar
        variant="error"
        customStyle
        open
        message="There is something wrong at showing properties"
      />
    </div>
  );
};

function Variants(props) {
  const {
    productVariants, selectedTab, loadingState, classes
  } = props;

  return (
    <Fragment>
      <Typography variant="subtitle2" gutterBottom>
        Variants
      </Typography>
      {loadingState && <div style={{ margin: '25px' }}><LoadingState /></div>}
      {!loadingState && productVariants.size === 0 && (
        <div style={{ marginTop: '10px' }}>
          <MySnackBar
            variant="info"
            customStyle
            open={productVariants.size === 0 || false}
            message="There is not available variants"
          />
        </div>

      )
      }
      {productVariants.map(({
        sku, price, images, quantity, integrations
      }) => (
        <ExpansionPanel key={sku} className={classes.emailList}>
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
            <Typography variant="subtitle2">
              Properties
            </Typography>
            <VariantDetails integrations={integrations} selectedTab={selectedTab} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Fragment>
  );
}

Variants.propTypes = {
  productVariants: PropTypes.object.isRequired,
  loadingState: PropTypes.bool.isRequired,
  selectedTab: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loadingState: state.getIn(['integrations', 'loadingState']),
  productVariants: state.getIn(['integrations', 'productVariants'])
});

const VariantsMapped = connect(
  mapStateToProps,
  null
)(Variants);

export default withStyles(styles)(VariantsMapped);
