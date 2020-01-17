import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormBuilder from './FormBuilder';

const GridItem = ({
  width, id, name, label, value, required, options, type, disabled, placeholder, onChange
}) => (
  <Grid item xs={width}>
    <List>
      <ListItem>
        <FormBuilder
          id={id}
          name={name}
          value={value}
          label={label}
          type={type}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          options={options}
          onChange={onChange}
        />
      </ListItem>
    </List>
  </Grid>
);

GridItem.propTypes = {
  width: PropTypes.number,
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

GridItem.defaultProps = {
  width: null,
  id: '',
  label: '',
  value: null,
  name: '',
  type: '',
  required: null,
  placeholder: '',
  options: [],
  onChange: null,
  disabled: null,
};

function Properties2(props) {
  const { properties, width, disabledForm } = props;

  const onChange = (e) => {
    const { id, value } = e.target;
    // const tempProps = properties.find(property => property.id === id);
    const tempProps = properties.map(property => {
      const propItem = property;
      if (property.id === id) {
        propItem.value = value;
      }
      return propItem;
    });
    props.onPropertyChange(tempProps);
  };

  return (
    <Fragment>
      <Typography variant="subtitle2">
        Properties
      </Typography>
      <Grid container spacing={8}>
        <Grid container item xs={12} spacing={16}>
          {properties && properties.map(({
            id, label, required, input_type: type, options, value, placeholder
          }) => {
            switch (width) {
              case 'xs':
                return <GridItem key={id} width={8} id={id} label={label} value={value} required={required} options={options} type={type} disabled={disabledForm} placeholder={placeholder} onChange={onChange} />;
              case 'sm':
                return <GridItem key={id} width={6} id={id} label={label} value={value} required={required} options={options} type={type} disabled={disabledForm} placeholder={placeholder} onChange={onChange} />;
              default:
                return <GridItem key={id} width={4} id={id} label={label} value={value} required={required} options={options} type={type} disabled={disabledForm} placeholder={placeholder} onChange={onChange} />;
            }
          }
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
}

Properties2.propTypes = {
  width: PropTypes.string.isRequired,
  properties: PropTypes.array.isRequired,
  disabledForm: PropTypes.bool.isRequired,
  onPropertyChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  disabledForm: state.getIn(['integrations', 'disabledForm']),
});

const PropertiesMapped = connect(
  mapStateToProps,
  null
)(Properties2);

export default withWidth()(PropertiesMapped);
