import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import { bulkEditProperties, unsubscribeProducts } from 'dan-actions/productActions';
import IntegrationCategoryBox from './IntegrationCategoryBox';
import ContainerList from './ContainerList';
import EditForm from './EditForm';

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
});

function getSteps() {
  return ['Select integration and category', 'Select products', 'Edit'];
}

class Wizard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onGetProducts: PropTypes.func.isRequired,
    onBulkEditProperties: PropTypes.func.isRequired,
    onUnsubscribeProducts: PropTypes.func.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,
    shop: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    properties: PropTypes.any.isRequired,
    task: PropTypes.object
  };

  static defaultProps = {
    task: null
  }

  state = {
    activeStep: 0,
    altLabel: false,
    integration: undefined,
    category: undefined,
    isStepOneValid: false,
    isStepTwoValid: false,
    isLastStepValid: false,
    remoteIds: []
  };

  componentDidUpdate(prevProps) {
    const { task, history } = this.props;
    (task && task !== prevProps.task) ? history.push(`/tasks/${task.id}`) : null;
  }

  handleNextValidity = () => {
    const { activeStep, isStepOneValid, isStepTwoValid, isLastStepValid } = this.state;
    let valid = false;
    switch (activeStep) {
      case 0:
        isStepOneValid ? valid = true : null;
        break;
      case 1:
        isStepTwoValid ? valid = true : null;
        break;
      case 2:
        isLastStepValid ? valid = true : null;
        break;
      default:
        break;
    }
    return valid;
  };

  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({ activeStep: activeStep + 1 });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleCancel = () => {
    const { history, onUnsubscribeProducts } = this.props;
    onUnsubscribeProducts();
    history.push('/products');
  };

  handleApply = () => {
    const { shop, properties, onBulkEditProperties, enqueueSnackbar } = this.props;
    const { remoteIds } = this.state;
    onBulkEditProperties(shop, remoteIds, properties, enqueueSnackbar);
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  getStepContent = (step) => {
    const { shop } = this.props;
    const { integration, category } = this.state;
    switch (step) {
      case 0:
        return (
          <IntegrationCategoryBox
            integration={integration}
            category={category}
            onIntegrationChange={(e) => this.setState({ integration: e })}
            onCategoryChange={(e) => this.setState({ category: e })}
            onGetData={(value) => this.setState({ isStepOneValid: value })}
          />
        );
      case 1:
        return (
          <ContainerList
            integration={integration ? integration.value : ''}
            category={category ? category.value : ''}
            onRemoteIdListChange={(values) => this.handleRemoteIdsChange(values)}
          />
        );
      case 2:
        return (
          <EditForm
            shop={shop}
            integration={integration}
            category={category}
            onTouchedProps={(value) => this.setState({ isLastStepValid: value })}
          />
        );
      default:
        return 'Unknown step';
    }
  }

  handleRemoteIdsChange(values) {
    if (values) {
      values.length > 0 ? this.setState({ isStepTwoValid: true }) : this.setState({ isStepTwoValid: false });
      this.setState({ remoteIds: values });
    }
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, altLabel } = this.state;

    return (
      <div className={classes.root}>
        <FormGroup row>
          <FormControlLabel
            control={(
              <Switch
                checked={altLabel}
                onChange={this.handleChange('altLabel')}
                value="altLabel"
              />
            )}
            label="Alternative Design"
          />
        </FormGroup>
        <Divider />
        <Stepper activeStep={activeStep} alternativeLabel={altLabel}>
          {steps.map((label) => {
            const props = {};
            const labelProps = {};
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Divider />
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&quot;re finished
              </Typography>
              <Button onClick={this.handleCancel} className={classes.button}>
                Cancel
              </Button>
              <Button onClick={this.handleApply} className={classes.button}>
                Apply
              </Button>
            </div>
          ) : (
            <div>
              <div className={classes.instructions}>{this.getStepContent(activeStep)}</div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                  disabled={!this.handleNextValidity()}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  properties: state.getIn(['product', 'properties']),
  task: state.getIn(['product', 'task']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onBulkEditProperties: bindActionCreators(bulkEditProperties, dispatch),
  onUnsubscribeProducts: bindActionCreators(unsubscribeProducts, dispatch)
});

const WizardMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);

export default withSnackbar(withStyles(styles)(WizardMapped));
