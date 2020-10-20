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

TabPanel.defaultProps = {
  children: () => { }
};

function ProductForm(props) {
  const {
    name, price, description, variants, images, integrations = [], dimension, action, onDimensionChange,
    onCancelClick,
  } = props;

  const [value, setValue] = useState('general');

  const [multipleTabs, setMultipleTabs] = useState(integrations.length > 0);

  const [properties, setProperties] = useState(get(integrations[0], ['product', 'properties']));
  const [errorProps, setErrorProps] = useState(get(integrations[0], ['product', 'errors']));

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
      setProperties(get(found, ['product', 'properties']));
      setErrorProps(get(found, ['product', 'errors']));
    }
  };

  const handleNameChange = useCallback((e) => {
    props.onNameChange(e);
  }, []);

  const handlePriceChange = useCallback((e) => {
    props.onPriceChange(e);
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    props.onDescriptionChange(e);
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
          action={action}
          onNameChange={handleNameChange}
          onPriceChange={handlePriceChange}
          onDescriptionChange={handleDescriptionChange}
        />
        <DimensionProps {...dimension} overwriteOption={action === 'edit' || false} onDimensionChange={handleDimensionChange} />
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
      <FormActions onCancelClick={onCancelClick} acceptButtonDisabled={!name || !description || !price} />
    </form>
  );
}

ProductForm.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  variants: PropTypes.number,
  images: PropTypes.array,
  dimension: PropTypes.object,
  integrations: PropTypes.array,
  action: PropTypes.string,
  onNameChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onDimensionChange: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func,
  onCancelClick: PropTypes.func,
  onSubmitForm: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
  variants: 0,
  images: [],
  integrations: [],
  action: 'edit',
  dimension: null,
  onCancelClick: () => { },
  onIntegrationChange: undefined
};

export default ProductForm;
