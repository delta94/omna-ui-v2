import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import Alert from 'dan-components/Notification/Alert';
import { PapperBlock } from 'dan-components';
import TypographySkeleton from 'dan-components/Skeleton/index';
import { emptyArray } from 'dan-containers/Common/Utils';
import FormBuilder from './FormBuilder';

const IntegrationProps = memo((props) => {
  const {
    properties, errors = '', title, description, loading, onChange
  } = props;

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
    <PapperBlock title={title} icon="ios-card" desc={description}>
      {loading ? <TypographySkeleton /> : (
        <Fragment>
          {emptyArray(properties) && errors ? (<Alert variant="error" message="Something wrong. No properties to show." />) : null}
          {emptyArray(properties) && !errors ? (<Alert variant="info" message="No properties to show." />) : null}
          {properties && !errors && (<FormBuilder properties={properties} onChange={onChange} />)}
        </Fragment>
      )}
    </PapperBlock>
  );
});

IntegrationProps.propTypes = {
  properties: PropTypes.any.isRequired,
  errors: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

IntegrationProps.defaultProps = {
  errors: '',
  title: 'Properties',
  description: '',
  loading: false
};

export default IntegrationProps;
