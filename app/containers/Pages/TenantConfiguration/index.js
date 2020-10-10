import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import get from 'lodash/get';
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
import API from '../../Utils/api';

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
      height: 300
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
    color:
      theme.palette.type === 'dark'
        ? theme.palette.primary.dark
        : theme.palette.primary.main,
    width: 100,
    height: 100,
    boxShadow: theme.shadows[4],
    '& svg': {
      fontSize: 64
    }
  }
});

class TenantConfiguration extends React.Component {
  state = {
    loading: false
  };

  updateTenant = () => {};

  startUpTenant = async () => {
    const { enqueueSnackbar, tenantId, history } = this.props;
    try {
      this.setState({ loading: true });
      const response = await API.get('startup');
      if (response) {
        enqueueSnackbar('Start up process initialized successfully', {
          variant: 'success'
        });
      }
      const intervalObj = setInterval(async () => {
        const resp = await API.get(`tenants/${tenantId}`);
        const { data } = resp.data;
        if (data.is_ready_to_omna && data.id === tenantId) {
          this.updateTenant(data.is_ready_to_omna);
          enqueueSnackbar(`${data.name} tenant is ready to use with OMNA`, {
            variant: 'success'
          });
          clearInterval(intervalObj);
          history.push('/');
        }
      }, 10000);
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  render() {
    const title = brand.name + ' - Tenant Configuration';
    const description = brand.desc;
    const { classes, enabledTenant } = this.props;
    const { loading } = this.state;
    return (
      <Fragment>
        {loading && <Loading />}
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
              <Avatar className={classes.icon}>
                <Build />
              </Avatar>
              <Hidden xsDown>
                <Avatar className={classes.icon}>
                  <Warning />
                </Avatar>
              </Hidden>
              <Hidden xsDown>
                <Avatar className={classes.icon}>
                  <Settings />
                </Avatar>
              </Hidden>
            </div>
            <Typography variant="h4" gutterBottom>
              Configuration
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginBottom: '10px' }}
            >
              {!enabledTenant
                ? 'Subscribe to a plan for Tenant Activation.'
                : 'Get your tenant ready to use OMNA application.'}
            </Typography>
            {loading && (
              <Typography variant="subtitle1">Preparing tenant ...</Typography>
            )}
            {!enabledTenant ? null : (
              <Button
                variant="contained"
                color="primary"
                onClick={this.startUpTenant}
              >
                Start
              </Button>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

TenantConfiguration.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  enabledTenant: PropTypes.bool.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(withStyles(styles)(TenantConfiguration));
