import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { editDynamicPropsHelper } from 'dan-containers/Common/Utils';
import { getVariantsFromIntegration } from 'dan-api/services/variants';
import FormActions from 'dan-containers/Common/FormActions';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import ProductInfo from './ProductInfo';
import DimensionProps from './DimensionProps';
import IntegrationProps from './IntegrationProps';
import VariantAccordionList from './VariantAccordionList';
import styles from './product-jss';

export const EDIT_GENERAL_TAB_MSG = 'Are you sure you want to edit the general properties for this product?';

export const EDIT_INTEGRATION_PROPS_MSG = (strings, name) => `Are you sure you want to edit the integrations' properties under "${name}"?`;

export const EDIT_INTEGRATION_VARIANTS_MSG = (strings, name) => `Are you sure you want to edit the variants' properties under "${name}"?`;

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

const useStyles = makeStyles(styles);
function ProductForm(props) {
  const {
    name, price, description, variants, images, integrations = [], dimension, action, onDimensionChange,
    onCancelClick, enqueueSnackbar, onSubmitForm
  } = props;

  const classes = useStyles();

  const [value, setValue] = useState('general');
  const [multipleTabs, setMultipleTabs] = useState(integrations.length > 0);

  const [initialProperties, setInitialProperties] = useState();
  const [properties, setProperties] = useState(get(integrations.find(i => i.id === value), ['product', 'properties']));
  const [errorProps, setErrorProps] = useState(get(integrations.find(i => i.id === value), ['product', 'errors']));
  const [remoteProductId, setRemoteProductId] = useState(get(integrations.find(i => i.id === value), ['product', 'remote_product_id']));

  const [initialVariantList, setInitialVariantList] = useState();
  const [variantList, setVariantList] = useState();
  const [disabledVariants, setDisabledVariants] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitData, setSubmitData] = useState({
    msg: EDIT_GENERAL_TAB_MSG,
    section: '',
    data: undefined
  });

  useEffect(() => {
    remoteProductId ? setDisabledVariants(remoteProductId.toLowerCase().includes('pending') || false) : null;
  }, [remoteProductId]);

  useEffect(() => {
    if (integrations.length > 0) {
      setMultipleTabs(true);
      setProperties(get(integrations.find(i => i.id === value), ['product', 'properties']));
    }
  }, [integrations]);

  useEffect(() => {
    async function getVariants() {
      if (value !== 'general') {
        setLoadingVariants(true);
        const response = await getVariantsFromIntegration({ integrationId: value, remoteProductId, enqueueSnackbar });
        const mappedVariants = response.data.map(({ sku, images: img, integration }) => ({
          sku,
          image: img[0] || undefined,
          properties: get(integration, ['variant', 'properties']),
          remoteProductId: get(integration, ['variant', 'remote_product_id']),
          remoteVariantId: get(integration, ['variant', 'remote_variant_id'])
        }));
        setInitialVariantList(cloneDeep(mappedVariants));
        setVariantList(mappedVariants);
        setLoadingVariants(false);
      }
    }
    getVariants();
  }, [value]);

  const handleChange = (event, newValue) => {
    const { onIntegrationChange } = props;
    setValue(newValue);
    const found = integrations.find(item => item.id === newValue);
    onIntegrationChange(found ? { id: found.id, name: found.name } : newValue);
    if (found) {
      setProperties(get(found, ['product', 'properties']));
      setInitialProperties(cloneDeep(get(found, ['product', 'properties'])));
      setErrorProps(get(found, ['product', 'errors']));
      setRemoteProductId(get(found, ['product', 'remote_product_id']));
      setVariantList(null);
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

  const handleVariantPropertiesChange = (prop, sku) => {
    const list = cloneDeep(variantList);
    const indexItem = list.findIndex(e => e.sku === sku);
    const item = list[indexItem];
    const newProps = editDynamicPropsHelper(prop, item.properties);
    item.properties = newProps;
    list[indexItem] = item;
    setVariantList(list);
  };

  const handleDialogCancelSubmit = () => setOpenDialog(false);

  const handleDialogConfirmSubmit = () => {
    setInitialVariantList(cloneDeep(variantList));
    setInitialProperties(cloneDeep(properties));
    setOpenDialog(false);
    onSubmitForm(submitData);
  };

  const handleSubmitForm = (section) => {
    const submitForm = {
      data: [],
      section,
      msg: EDIT_GENERAL_TAB_MSG
    };
    switch (section) {
      case 'properties':
        submitForm.data = properties;
        submitForm.msg = EDIT_INTEGRATION_PROPS_MSG`${value}`;
        break;
      case 'variants':
        submitForm.msg = EDIT_INTEGRATION_VARIANTS_MSG`${value}`;
        variantList.forEach((item, index) => {
          if (!isEqual(item, initialVariantList[index])) {
            submitForm.data.push(item);
          }
        });
        break;
      default:
        break;
    }
    setSubmitData(submitForm);
    setOpenDialog(true);
  };

  return (
    <div>
      <form noValidate autoComplete="off">
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
            {multipleTabs && integrations.map(({ id, name: name_ }) => <Tab key={id} value={id} label={name_} />)}
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
          <FormActions
            onCancelClick={onCancelClick}
            acceptButtonDisabled={!name || !description || !price}
            type="button"
            onAcceptClick={() => handleSubmitForm('general')}
          />
        </TabPanel>
        {multipleTabs && integrations.map(({ id }) => (
          <TabPanel key={id} index={id} value={value}>
            <IntegrationProps
              properties={properties}
              errors={errorProps}
              onChange={handlePropertiesChange}
            />
            <FormActions withOutCancel type="button" acceptButtonDisabled={isEqual(initialProperties, properties)} onAcceptClick={() => handleSubmitForm('properties')} />
            <Divider className={classes.sectionDivider} variant="middle" />
            <VariantAccordionList
              data={variantList}
              loading={loadingVariants}
              disabled={disabledVariants}
              onChange={handleVariantPropertiesChange}
            />
            <FormActions
              type="button"
              onCancelClick={onCancelClick}
              onAcceptClick={() => handleSubmitForm('variants')}
              acceptButtonDisabled={(disabledVariants || isEmpty(variantList) || isEqual(initialVariantList, variantList)) || false}
            />
          </TabPanel>
        ))}
      </form>
      <AlertDialog
        open={openDialog}
        message={submitData.msg}
        handleCancel={handleDialogCancelSubmit}
        handleConfirm={handleDialogConfirmSubmit}
      />
    </div>
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
  onSubmitForm: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
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

export default withSnackbar(ProductForm);
