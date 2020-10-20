import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { editDynamicPropsHelper } from 'dan-containers/Common/Utils';
import FormActions from 'dan-containers/Common/FormActions';
import DimensionProps from './DimensionProps';
import IntegrationProps from './IntegrationProps';
import VariantMainProps from './VariantMainProps';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

TabPanel.defaultProps = {
  children: () => {}
};

function VariantForm(props) {
  const {
    sku, price, originalPrice, quantity, images, integrations = [], dimension, action,
    onDimensionChange, onCancelClick,
  } = props;

  const [value, setValue] = useState('general');

  const [multipleTabs, setMultipleTabs] = useState(integrations.length > 0);

  const [properties, setProperties] = useState(get(integrations[0], ['variant', 'properties']));
  const [errorProps, setErrorProps] = useState(get(integrations[0], ['variant', 'errors']));

  useEffect(() => {
    if (integrations.length > 0) {
      setMultipleTabs(true);
    }
  }, [integrations]);

  const handleChange = (event, newValue) => {
    const { onIntegrationChange } = props;
    setValue(newValue);
    const found = integrations.find(item => item.name === newValue);
    onIntegrationChange(found ? { id: found.id, name: found.name } : newValue);
    if (found) {
      setProperties(get(found, ['variant', 'properties']));
      setErrorProps(get(found, ['variant', 'errors']));
    }
  };


  const handleSKUChange = useCallback((e) => {
    props.onSKUChange(e);
  }, []);

  const handlePriceChange = useCallback((e) => {
    props.onPriceChange(e);
  }, []);

  const handleOriginalPriceChange = useCallback((e) => {
    props.onOriginalPriceChange(e);
  }, []);

  const handleQuantityChange = useCallback((e) => {
    props.onQuantityChange(e);
  }, []);

  const handleDimensionChange = useCallback((e) => {
    onDimensionChange(e);
  }, []);

  const handlePropertiesChange = (e) => {
    const newProps = editDynamicPropsHelper(e, properties);
    setProperties(newProps);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    props.onSubmitForm();
  };

  return (
    <form noValidate autoComplete="off" onSubmit={onSubmitForm}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="General" value="general" />
          {multipleTabs && integrations.map(({ id, name: name_ }) => <Tab key={id} value={name_} label={name_} />)}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index="general">
        <VariantMainProps
          sku={sku}
          quantity={quantity}
          price={price}
          originalPrice={originalPrice}
          images={images}
          action={action}
          onSkuChange={handleSKUChange}
          onQuantityChange={handleQuantityChange}
          onPriceChange={handlePriceChange}
          onOriginalPriceChange={handleOriginalPriceChange}
        />
        <DimensionProps {...dimension} onDimensionChange={handleDimensionChange} />
      </TabPanel>
      {multipleTabs && integrations.map(({ id, name: name_ }) => (
        <TabPanel key={id} value={value} index={name_}>
          <IntegrationProps
            properties={properties}
            errors={errorProps}
            onChange={handlePropertiesChange}
          />
        </TabPanel>
      )
      )}
      <FormActions onCancelClick={onCancelClick} />
    </form>
  );
}

VariantForm.propTypes = {
  sku: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
  originalPrice: PropTypes.number,
  images: PropTypes.array,
  dimension: PropTypes.object,
  action: PropTypes.oneOf(['add', 'edit']),
  integrations: PropTypes.array,
  onSKUChange: PropTypes.func,
  onQuantityChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onOriginalPriceChange: PropTypes.func.isRequired,
  onDimensionChange: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func,
  onSubmitForm: PropTypes.func.isRequired
};

VariantForm.defaultProps = {
  images: [],
  sku: '',
  price: undefined,
  originalPrice: undefined,
  quantity: undefined,
  integrations: [],
  dimension: null,
  action: 'add',
  onSKUChange: () => {},
  onCancelClick: () => { },
};

export default VariantForm;
