import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
    name, price, originalPrice, quantity, images, integrations = [], dimension, onDimensionChange,
    onCancelClick,
  } = props;

  const [value, setValue] = useState('general');

  const [multipleTabs, setMultipleTabs] = useState(integrations.length > 0);

  useEffect(() => {
    if (integrations.length > 0) {
      setMultipleTabs(true);
    }
  }, [integrations])

  const handleChange = (event, newValue) => setValue(newValue);

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

  const onSubmitForm = (e) => {
    e.preventDefault();
    props.onSubmitForm(value);
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
          name={name}
          quantity={quantity}
          price={price}
          originalPrice={originalPrice}
          images={images}
          onQuantityChange={handleQuantityChange}
          onPriceChange={handlePriceChange}
          onOriginalPriceChange={handleOriginalPriceChange}
        />
        <DimensionProps {...dimension} onDimensionChange={handleDimensionChange} />
      </TabPanel>
      {multipleTabs && integrations.map(({ id, name: name_, variant: { properties, errors } }) => (
        <TabPanel key={id} value={value} index={name_}>
          <IntegrationProps
            properties={properties}
            errors={errors}
          />
        </TabPanel>
      )
      )}
      <FormActions onCancelClick={onCancelClick} />
    </form>
  );
};

VariantForm.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
  originalPrice: PropTypes.number,
  images: PropTypes.array,
  dimension: PropTypes.object,
  integrations: PropTypes.array,
  onQuantityChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onOriginalPriceChange: PropTypes.func.isRequired,
  onDimensionChange: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func,
  onSubmitForm: PropTypes.func.isRequired
};

VariantForm.defaultProps = {
  images: [],
  name: '',
  price: undefined,
  originalPrice: undefined,
  quantity: undefined,
  integrations: [],
  dimension: null,
  onCancelClick: () => { },
};

export default VariantForm;
