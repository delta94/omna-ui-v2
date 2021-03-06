import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import { getCategoryList } from 'dan-actions/categoryAction';
import { getIntegrations } from 'dan-actions/integrationActions';
import { delay, hasCategories } from 'dan-containers/Common/Utils';
import AutoSuggestion from 'dan-components/AutoSuggestion';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
  select: {
    marginTop: theme.spacing(2)
  },
  instructions: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
});

function FiltersDlg(props) {
  const {
    integration, category, categories, onGetCategories, integrations, onGetIntegrations, loadingCategories,
    loadingIntegrations, onCategoryChange, enqueueSnackbar, classes
  } = props;

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [categoryTerm, setCategoryTerm] = useState('');
  const [integrationTerm, setIntegrationTerm] = useState('');
  const [categoryHelperText, setCategoryHelperText] = useState('No available categories');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (integrations) {
      setIntegrationOptions(integrations.data.map(item => ({ name: item.name, value: item.id })));
    }
  }, [integrations]);

  useEffect(() => {
    if (categories && integration && onCategoryChange) {
      setCategoryOptions(categories.data.map(item => ({ name: item.name, value: item.id })));
    }
  }, [categories]);

  const checkValidity = () => {
    if (hasCategories(integrations, integration)) {
      if (!integration || categoryOptions.length === 0) {
        setCategoryHelperText('No available categories');
      } else setCategoryHelperText('');
    } else setCategoryHelperText('Selected integration does not have categories');
  };

  useEffect(() => {
    !initialLoad && onCategoryChange ? checkValidity() : null;
    setInitialLoad(false);
  }, [integration, categoryOptions]);

  const makeCategoriesQuery = () => {
    const params = {
      term: categoryTerm
    };
    onGetCategories(integration.value, params, enqueueSnackbar);
  };

  useEffect(() => {
    if (integration && onCategoryChange) {
      makeCategoriesQuery();
    }
  }, [integration, categoryTerm]);

  const makeIntegrationsQuery = () => {
    const params = {
      term: integrationTerm
    };
    onGetIntegrations(params, enqueueSnackbar);
  };

  useEffect(() => {
    makeIntegrationsQuery();
  }, [integrationTerm]);

  const handleCategoryChange = async (e, element) => onCategoryChange(element);

  const handleCategoryInputChange = async (e, value) => {
    const index = categories.data.findIndex(item => item.name === value);
    if (index === -1) {
      value === '' ? setCategoryTerm(value) : delay(() => setCategoryTerm(value));
    }
  };

  const handleIntegrationChange = async (e, element) => {
    const { onIntegrationChange } = props;
    if (onCategoryChange) {
      onCategoryChange(undefined);
      setCategoryOptions([]);
    }
    onIntegrationChange(element);
  };

  const handleIntegrationInputChange = async (e, value) => {
    const index = integrations.data.findIndex(item => item.name === value);
    if (index === -1) {
      value === '' ? setIntegrationTerm(value) : delay(() => setIntegrationTerm(value));
    }
  };

  return (
    <div>
      <AutoSuggestion
        id="integration-select-id"
        label="Integrations"
        options={integrationOptions}
        loading={loadingIntegrations}
        value={integration}
        onChange={handleIntegrationChange}
        onInputChange={handleIntegrationInputChange}
      />
      {onCategoryChange && (
        <AutoSuggestion
          id="category-select-id"
          label="Categories"
          className={classes.select}
          options={categoryOptions}
          loading={loadingCategories}
          value={category}
          helperText={categoryHelperText}
          placeholder="Select a category from the selected integration"
          onChange={handleCategoryChange}
          onInputChange={handleCategoryInputChange}
        />
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  categories: state.getIn(['category', 'categoryList']).toJS(),
  integrations: state.getIn(['integration', 'integrations']).toJS(),
  loadingCategories: state.getIn(['category', 'loading']),
  loadingIntegrations: state.getIn(['integration', 'loading']),
  error: state.getIn(['product', 'error']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch),
  onGetCategories: bindActionCreators(getCategoryList, dispatch)
});

const FilterTableBoxMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersDlg);

FiltersDlg.defaultProps = {
  integration: undefined,
  category: undefined,
  onCategoryChange: undefined
};

FiltersDlg.propTypes = {
  integration: PropTypes.object,
  category: PropTypes.object,
  loadingIntegrations: PropTypes.bool.isRequired,
  loadingCategories: PropTypes.bool.isRequired,
  integrations: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  onGetCategories: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func,
  enqueueSnackbar: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withSnackbar(withStyles(styles)(FilterTableBoxMapped));
