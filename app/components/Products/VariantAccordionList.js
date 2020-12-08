import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Type from 'dan-styles/Typography.scss';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { PapperBlock } from 'dan-components';
import Alert from 'dan-components/Notification/Alert';
import IntegrationProps from './IntegrationProps';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  details: {
    flexDirection: 'column'
  }
}));

function VariantAccordionList(props) {
  const { data, loading, disabled, onChange } = props;
  const classes = useStyles();

  const handlePropertiesChange = (prop, sku) => onChange(prop, sku);

  return (
    <PapperBlock title="Variants" icon="ios-card" desc="">
      {!isEmpty(data) && !loading && disabled && (
        <Alert
          message="Variants will be enabled when the product's properties be saved correctly"
          variant="info"
        />
      )}
      <div className={classes.root}>
        {loading && 'Loading...'}
        {isEmpty(data) && !loading ? (
          <Alert
            message="There is no variants for this product under the selected integration"
            variant="info"
          />
        ) : (
          data && data.map(({ sku, image, properties }) => (
            <ExpansionPanel key={sku} defaultExpanded={!disabled} disabled={disabled}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <div className={classes.heading}>
                  <Avatar
                    alt="variant"
                    src={image}
                    className={classes.avatar}
                  >
                    {!image ? <PhotoCameraIcon /> : undefined}
                  </Avatar>
                </div>
                <Typography variant="subtitle1" className={classes.secondaryHeading} gutterBottom>
                  <span>SKU:</span>
                  {' '}
                  <span className={Type.bold}>{sku}</span>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.details}>
                <IntegrationProps
                  properties={properties}
                  unMountPaper
                  /* errors={errorProps}  */
                  onChange={(prop) => handlePropertiesChange(prop, sku)}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )))}
      </div>
    </PapperBlock>
  );
}

VariantAccordionList.defaultProps = {
  data: [],
  disabled: false,
  loading: true
};

VariantAccordionList.propTypes = {
  data: PropTypes.any,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default VariantAccordionList;
