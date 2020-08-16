import React, {
  useState, memo, Fragment, useEffect
} from 'react';
import PropTypes from 'prop-types';
import Alert from 'dan-components/Notification/Alert';
import { PapperBlock } from 'dan-components';
import TypographySkeleton from 'dan-components/Skeleton/index';
import { emptyArray } from 'dan-containers/Common/Utils';
import FormBuilder from './FormBuilder';

const IntegrationProps = memo((props) => {
  const {
    properties, errors = '', title, description, loading, onTouchedProps
  } = props;
  const [properties_, setProperties_] = useState(properties);

  useEffect(() => {
    setProperties_(properties);
  }, [properties]);

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
        property.value = value ? value.id : '';
        property.options = value ? [value] : [];
      }
      delete properties_[index];
      properties_.splice(index, 1, property);
      setProperties_([...properties]);
      onTouchedProps(true);
    }
  };
  return (
    <PapperBlock title={title} icon="ios-card" desc={description}>
      {loading ? <TypographySkeleton /> : (
        <Fragment>
          {emptyArray(properties_) && errors ? (<Alert variant="error" message="Something wrong. No properties to show." />) : null}
          {emptyArray(properties_) && !errors ? (<Alert variant="info" message="No properties to show." />) : null}
          {properties_ && !errors && (<FormBuilder properties={properties_} onChange={handlePropertyChange} />)}
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
  onTouchedProps: PropTypes.func
};

IntegrationProps.defaultProps = {
  errors: '',
  title: 'Properties',
  description: '',
  loading: false,
  onTouchedProps: () => { }
};

export default IntegrationProps;
