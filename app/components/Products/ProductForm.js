import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormActions from 'dan-containers/Common/FormActions';
import ProductInfo from './ProductInfo';
import DimensionProps from './DimensionProps';
import IntegrationProps from './IntegrationProps';

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

function ProductForm(props) {
  const {
    name, price, description, variants, images, integrations = [], dimension, onDimensionChange,
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

  const handleNameChange = useCallback((e) => {
    props.onNameChange(e);
  }, []);

  const handlePriceChange = useCallback((e) => {
    props.onPriceChange(e)
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    props.onDescriptionChange(e)
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
        <ProductInfo
          thumbnail={images}
          name={name}
          price={price}
          description={description}
          variants={variants}
          onNameChange={handleNameChange}
          onPriceChange={handlePriceChange}
          onDescriptionChange={handleDescriptionChange}
        />
        <DimensionProps {...dimension} onDimensionChange={handleDimensionChange} />
      </TabPanel>
      {multipleTabs && integrations.map(({ id, name: name_, product: { properties, errors } }) => (
        <TabPanel key={id} value={value} index={name_}>
          <IntegrationProps
            properties={properties}
            errors={errors}
          />
        </TabPanel>
      )
      )}
      <FormActions onCancelClick={onCancelClick} acceptButtonDisabled={!name || !description || !price} />
    </form>
  );
};

ProductForm.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  variants: PropTypes.number,
  images: PropTypes.array,
  dimension: PropTypes.object.isRequired,
  integrations: PropTypes.array,
  onNameChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onDimensionChange: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func,
  onSubmitForm: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
  variants: null,
  images: [],
  integrations: [],
  onCancelClick: () => { },
};

export default ProductForm;
