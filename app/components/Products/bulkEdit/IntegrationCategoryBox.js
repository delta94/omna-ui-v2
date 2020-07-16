import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { getCategoryList } from 'dan-actions/categoryAction';
import { getIntegrations } from 'dan-actions/integrationActions';
import { getProductsByIntegration } from 'dan-actions/productActions';
import { delay } from 'dan-containers/Common/Utils';
import Alert from 'dan-components/Notification/Alert';
import AutoSuggestion from './AutoSuggestion';

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    margin: theme.spacing(1),
  },
  select: {
    margin: theme.spacing(1),
    width: '50%'
  },
  instructions: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
});

function IntegrationCategoryBox(props) {
  const {
    integration, category, categories, onGetCategories, integrations, onGetIntegrations, loadingCategories,
    loadingIntegrations, loadingProducts, products, onGetData, enqueueSnackbar, classes
  } = props;

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [categoryTerm, setCategoryTerm] = useState('');
  const [integrationTerm, setIntegrationTerm] = useState('');
  const [errors, setErrors] = useState({
    integration: false,
    category: false
  });
  const [initialLoad, setInitialLoad] = useState(true);

  const { pagination } = products;
  const total = get(pagination, 'total', 0);

  useEffect(() => {
    total > 0 ? onGetData(true) : onGetData(false);
  }, [total]);

  const checkIntegrationValidity = () => {
    if (!integration) {
      setErrors((prevState) => ({ ...prevState, integration: true }));
    } else setErrors((prevState) => ({ ...prevState, integration: false }));
  };

  const checkCategoryValidity = () => {
    if (!category) {
      setErrors((prevState) => ({ ...prevState, category: true }));
    } else setErrors((prevState) => ({ ...prevState, category: false }));
  };

  const checkValidity = (field) => {
    switch (field) {
      case 'integration':
        checkIntegrationValidity();
        break;
      case 'category':
        checkCategoryValidity();
        break;
      default:
        checkIntegrationValidity();
        checkCategoryValidity();
        break;
    }
  };

  useEffect(() => {
    !initialLoad ? checkValidity('category') : null;
    setInitialLoad(false);
  }, [category]);

  useEffect(() => {
    !initialLoad ? checkValidity('integration') : null;
    setInitialLoad(false);
  }, [integration]);


  const makeCategoriesQuery = () => {
    const params = {
      term: categoryTerm
    };
    onGetCategories(integration.value, params, enqueueSnackbar);
  };

  useEffect(() => {
    if (integration) {
      makeCategoriesQuery();
    }
  }, [integration, categoryTerm]);

  // -----------------------------------------------

  const makeIntegrationsQuery = () => {
    const params = {
      term: integrationTerm
    };
    onGetIntegrations(params, enqueueSnackbar);
  };

  useEffect(() => {
    makeIntegrationsQuery();
  }, [integrationTerm]);

  useEffect(() => {
    if (categories) {
      setCategoryOptions(categories.data.map(item => ({ name: item.name, value: item.id })));
    }
  }, [categories]);

  useEffect(() => {
    if (integrations) {
      setIntegrationOptions(integrations.data.map(item => ({ name: item.name, value: item.id })));
    }
  }, [integrations]);

  const makeProductsQuery = () => {
    const { onGetProducts } = props;
    const params = {
      category_id: category.value,
      with_details: true
    };
    onGetProducts(integration.value, params);
  };

  const handleCategoryChange = async (e, element) => {
    const { onCategoryChange } = props;
    onCategoryChange(element);
  };

  const handleCategoryInputChange = async (e, value) => {
    const index = categoryOptions.findIndex(item => item.name === value);
    if (index === -1) {
      value === '' ? setCategoryTerm(value) : delay(value, () => setCategoryTerm(value));
    }
  };

  const handleIntegrationChange = async (e, element) => {
    const { onIntegrationChange, onCategoryChange } = props;
    // setIntegration(element);
    // setCategory(null);
    onCategoryChange(undefined);
    onIntegrationChange(element);
  };

  const handleIntegrationInputChange = async (e, value) => {
    const index = integrationOptions.findIndex(item => item.name === value);
    if (index === -1) {
      value === '' ? setIntegrationTerm(value) : delay(value, () => setIntegrationTerm(value));
    }
  };

  const handleCheckAvailability = () => {
    (integration && category) ? makeProductsQuery() : checkValidity();
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Select integration and category
      </Typography>
      <AutoSuggestion
        id="integration-select-id"
        label="Integrations (required)"
        className={classes.select}
        options={integrationOptions}
        loading={loadingIntegrations}
        value={integration}
        error={errors.integration}
        helperText={errors.integration ? 'Required field' : ''}
        onChange={handleIntegrationChange}
        onInputChange={handleIntegrationInputChange}
      />
      <AutoSuggestion
        id="category-select-id"
        label="Categories (required)"
        className={classes.select}
        options={categoryOptions}
        loading={loadingCategories}
        value={category}
        error={errors.category}
        helperText={errors.category ? 'Required field' : 'Categories will be loaded depending of the selected integration'}
        placeholder="Select a category from the selected integration"
        onChange={handleCategoryChange}
        onInputChange={handleCategoryInputChange}
      />
      {total > 0 ? (
        <Alert
          message="Available products for bulk edit"
          variant="success"
        />
      ) : (
        <Alert
          message="No products for bulk edit"
          variant="info"
        />
      )}
      <Button
        variant="contained"
        color="secondary"
        disabled={loadingProducts}
        onClick={handleCheckAvailability}
        className={classes.button}
      >
        {!loadingProducts ? 'Check product availability' : 'Loading...'}
      </Button>
    </div>
  );
}

const mapStateToProps = state => ({
  loadingCategories: state.getIn(['category', 'loading']),
  categories: state.getIn(['category', 'categoryList']).toJS(),
  loadingIntegrations: state.getIn(['integration', 'loading']),
  integrations: state.getIn(['integration', 'integrations']).toJS(),
  products: state.getIn(['product', 'products']),
  loadingProducts: state.getIn(['product', 'loading']),
  error: state.getIn(['product', 'error']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch),
  onGetCategories: bindActionCreators(getCategoryList, dispatch),
  onGetProducts: bindActionCreators(getProductsByIntegration, dispatch)
});

const IntegrationCategoryBoxMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(IntegrationCategoryBox);

IntegrationCategoryBox.defaultProps = {
  integration: undefined,
  category: undefined
};

IntegrationCategoryBox.propTypes = {
  integration: PropTypes.object,
  category: PropTypes.object,
  products: PropTypes.object.isRequired,
  loadingIntegrations: PropTypes.bool.isRequired,
  loadingCategories: PropTypes.bool.isRequired,
  loadingProducts: PropTypes.bool.isRequired,
  integrations: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  onGetCategories: PropTypes.func.isRequired,
  onGetProducts: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onGetData: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withSnackbar(withStyles(styles)(IntegrationCategoryBoxMapped));
