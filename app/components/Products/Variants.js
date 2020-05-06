import React, { Fragment, useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LoadingState from 'dan-containers/Common/LoadingState';
import Alert from 'dan-components/Notification/Alert';
import FormBuilder from './FormBuilder';
import styles from './variants-jss';

const VariantDetails = (params) => {
  const { integrations, selectedIntegration } = params;
  const integration = integrations && selectedIntegration ? integrations.find(item => item.id === selectedIntegration.id) : null;

  const onPropertyChange = () => console.log('onPropertyChange');

  if (integration) {
    const { properties, errors } = integration ? integration.variant : null;
    return (
      <Fragment>
        {console.log('variantDetails')}
        {properties && !errors && <FormBuilder properties={properties} onChange={onPropertyChange} />}
        {errors && <Alert variant="error" message={errors} />}
      </Fragment>
    );
  }
  return <Alert variant="error" message="There is something wrong at showing properties" />
};

const Variants = memo((props) => {
  const { variantList, selectedIntegration, classes } = props;

  const emptyList = variantList && (variantList.lenght === 0 || variantList.size === 0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [variantList]);

  useEffect(() => {
    setLoading(true);
  }, [selectedIntegration]);


  return (
    <Fragment>
      <Typography variant="subtitle2" gutterBottom>
        Variants
      </Typography>
      {loading && <div style={{ margin: '25px' }}><LoadingState /></div>}
      {!loading && emptyList && <Alert variant="info" message="There is not available variants" />}
      {!loading && !emptyList && variantList.map(({ sku, price, images, quantity, integrations }) => (
        <ExpansionPanel key={sku}>
          <ExpansionPanelSummary className={classes.variantSummary} expandIcon={<ExpandMoreIcon />}>
            <div className={classes.heading}>
              <Avatar
                alt="avatar"
                src={images.length > 0 ? images[0] : '/images/screen/no-image.png'}
                className={classes.bigAvatar}
              />
              <Typography>
                <span>SKU:{sku}</span>
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
});

Variants.propTypes = {
  variantList: PropTypes.any,
  selectedIntegration: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

Variants.defaultProps = {
  variantList: []
};

export default withStyles(styles)(Variants);
