import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Alert from 'dan-components/Notification/Alert';
import { emptyArray } from 'dan-containers/Common/Utils';
import FormBuilder from './FormBuilder';

const IntegrationProps = memo(({ properties, errors = '', onTouchedProps }) => {
  const [properties_, setProperties_] = useState(properties);

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

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    const index = properties_.findIndex(item => item.id === name);
    if (index >= 0) {
      const property = properties_[index];
      if (property.input_type !== 'single_select_with_remote_options') {
        property.value = value;
      } else {
        property.value = value.id;
        property.options = [value];
      }
      delete properties_[index];
      properties_.splice(index, 1, property);
      setProperties_([...properties]);
      onTouchedProps(true);
    }
  };
  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        Properties
      </Typography>
      {emptyArray(properties_) && errors ? (<Alert variant="error" message="Something wrong. No properties to show." />) : null}
      {emptyArray(properties_) && !errors ? (<Alert variant="info" message="No properties to show." />) : null}
      {properties_ && !errors && (<FormBuilder properties={properties_} onChange={handlePropertyChange} />)}
    </div>
  );
});

IntegrationProps.propTypes = {
  properties: PropTypes.any.isRequired,
  errors: PropTypes.string,
  onTouchedProps: PropTypes.func
};

IntegrationProps.defaultProps = {
  errors: '',
  onTouchedProps: () => { }
};

export default IntegrationProps;
