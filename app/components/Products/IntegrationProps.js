import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import Alert from 'dan-components/Notification/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { PapperBlock } from 'dan-components';
import TypographySkeleton from 'dan-components/Skeleton/index';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { emptyArray } from 'dan-containers/Common/Utils';
import FormBuilder from './FormBuilder';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3)
  },
  title: {
    margin: theme.spacing(1, 1, 2, 0)
  },
}));

const Body = (props) => {
  const {
    properties, errors, onChange
  } = props;

  return (
    <Fragment>
      {emptyArray(properties) && errors ? (<Alert variant="error" message="Something wrong. No properties to show." />) : null}
      {emptyArray(properties) && !errors ? (<Alert variant="info" message="No properties to show." />) : null}
      {properties && !errors && (<FormBuilder properties={properties} onChange={onChange} />)}
    </Fragment>
  );
};

Body.propTypes = {
  properties: PropTypes.any,
  errors: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

Body.defaultProps = {
  errors: '',
  properties: []
};

const IntegrationProps = memo((props) => {
  const {
    properties, errors = '', title, description, loading, unMountPaper, onChange
  } = props;

  const classes = useStyles();

  // handlePropertyChange to use in the future if the api makes changes on the properties
  /*   const handlePropertyChange = (e) => {
      const { name, value } = e.target;
      const index = properties.findIndex(item => item.id === name);
      if(index >= 0) {
        const property = properties[index];
          property.value = value;
          delete properties[index];
          properties.splice(index, 1, property);
          setProperties([...properties]);
        }
      }; */

  return (
    <Fragment>
      {!unMountPaper ? (
        <PapperBlock title={title} icon="ios-card" desc={description}>
          {loading ? <TypographySkeleton /> : (
            <Body properties={properties} errors={errors} onChange={onChange} />
          )}
        </PapperBlock>
      ) : (
        <div className={classes.container}>
          <Typography className={classes.title} component="div" gutterBottom>
            <Box fontSize="h6.fontSize" m={1} fontWeight="fontWeightRegular">
              Properties
            </Box>
          </Typography>
          <Body properties={properties} errors={errors} onChange={onChange} />
        </div>
      )}
    </Fragment>
  );
});

IntegrationProps.propTypes = {
  properties: PropTypes.any.isRequired,
  errors: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  loading: PropTypes.bool,
  unMountPaper: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

IntegrationProps.defaultProps = {
  errors: '',
  title: 'Properties',
  description: '',
  loading: false,
  unMountPaper: false
};

export default IntegrationProps;
