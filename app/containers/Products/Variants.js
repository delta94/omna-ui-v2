import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
  const { integrations, selectedIntegration } = params;
  const integration = integrations.find(item => item.id === selectedIntegration);
  const properties = integration ? integration.variant.properties : null;

  const onPropertyChange = () => {
  /*     const { product } = props;
    const { name, value } = e.target;
    const tempProps = defaultProps.map(property => {
      const propItem = property;
      if (property.label === name) {
        propItem.value = value;
      }
      return propItem;
    });
    product.integrations[tabIndex].product.properties = tempProps;
    setDefaultProps(tempProps); */
  };

  if (integration) {
    return (
      <Fragment>
        {properties ? (
          <FormBuilder properties={properties} onChange={onPropertyChange} />
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
    variantList, selectedIntegration, loadingState, classes
  } = props;

  return (
    <Fragment>
      <Typography variant="subtitle2" gutterBottom>
        Variants
      </Typography>
      {loadingState && <div style={{ margin: '25px' }}><LoadingState /></div>}
      {!loadingState && variantList.lenght === 0 && (
        <div style={{ marginTop: '10px' }}>
          <MySnackBar
            variant="info"
            customStyle
            open={variantList.lenght === 0 || false}
            message="There is not available variants"
          />
        </div>

      )
      }
      {variantList.map(({
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
            <Typography variant="subtitle2" gutterBottom>
              Properties
            </Typography>
            <VariantDetails integrations={integrations} selectedIntegration={selectedIntegration} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Fragment>
  );
}

Variants.propTypes = {
  variantList: PropTypes.object,
  loadingState: PropTypes.bool.isRequired,
  selectedIntegration: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

Variants.defaultProps = {
  variantList: []
};

const mapStateToProps = state => ({
  loadingState: state.getIn(['integrations', 'loadingState'])
});

const VariantsMapped = connect(
  mapStateToProps,
  null
)(Variants);

export default withStyles(styles)(VariantsMapped);
