import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Build from '@material-ui/icons/Build';
import Hidden from '@material-ui/core/Hidden';
import Settings from '@material-ui/icons/SettingsApplications';
import Warning from '@material-ui/icons/Warning';
import Loading from 'dan-components/Loading';
import { GET_TENANT_ID } from '../../../actions/actionConstants';
import { setTenantStatus } from '../../../actions/TenantActions';
import API from '../../Utils/api';
import Utils from '../../Common/Utils';

const styles = theme => ({
  container: {
    textAlign: 'center'
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  title: {
    color: '#FFF'
  },
  subtitle: {
    color: '#FFF'
  },
  paper: {
    margin: 'auto',
    padding: 40,
    width: '90%',
    [theme.breakpoints.up('sm')]: {
      width: 600,
      height: 300,
    },
    textAlign: 'center'
  },
  artwork: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 30
  },
  icon: {
    margin: '10px 20px',
    background: 'rgba(255,255,255,0.6)',
    color: theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
    width: 100,
    height: 100,
    boxShadow: theme.shadows[4],
    '& svg': {
      fontSize: 64,
    },
  },
});

class TenantConfiguration extends React.Component {
  state = { loading: false };

  updateTenant = (status) => {
    const { changeTenantStatus } = this.props;
    changeTenantStatus(status);
    const user = Utils.getUser();
    if (user) {
      user.isReadyToOmna = status;
    }
  }

  startUpTenant = async () => {
    const { enqueueSnackbar, tenantId, history } = this.props;
    try {
      const response = await API.get('startup');
      if (response) {
        this.setState({ loading: true });
        enqueueSnackbar('Start up process initialized successfully', {
          variant: 'success'
        });
      }
      const { location } = history;
      const intervalObj = setInterval(async () => {
        if (location.pathname.includes('/app/tenant-configuration')) {
          const resp = await API.get(`tenants/${tenantId}`);
          const { data } = resp.data;
          if (data.is_ready_to_omna) {
            this.updateTenant(data.is_ready_to_omna);
            enqueueSnackbar(`${data.name} tenant is ready to use with Omna`, {
              variant: 'success'
            });
            clearInterval(intervalObj);
            history.push('/');
          }
        } else {
          clearInterval(intervalObj);
        }
      }, 10000);
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  }

  render() {
    const title = brand.name + ' - Tenant Configuration';
    const description = brand.desc;
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <div className={classes.root}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <div className={classes.container}>
          <div className={classes.artwork}>
            <Avatar className={classes.icon}><Build /></Avatar>
            <Hidden xsDown>
              <Avatar className={classes.icon}><Warning /></Avatar>
            </Hidden>
            <Hidden xsDown>
              <Avatar className={classes.icon}><Settings /></Avatar>
            </Hidden>
          </div>
          <Typography variant="h4" gutterBottom>Configuration</Typography>
          <Typography variant="subtitle1">
            The current tenant is not ready to use with OMNA application.
          </Typography>
          {loading && (
            <Typography variant="subtitle1">
              Preparing tenant ...
            </Typography>
          )}
          {loading ? <Loading /> : (
            <Button variant="contained" color="primary" onClick={this.startUpTenant}>
              Start
            </Button>
          )}
        </div>
      </div>
    );
  }
}

TenantConfiguration.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  changeTenantStatus: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  tenantId: state.getIn(['tenant', 'tenantId']),
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  getTenantId: () => dispatch({ type: GET_TENANT_ID }),
  changeTenantStatus: bindActionCreators(setTenantStatus, dispatch),
});

const TenantConfigurationMaped = connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantConfiguration);

export default withSnackbar(withStyles(styles)(TenantConfigurationMaped));
