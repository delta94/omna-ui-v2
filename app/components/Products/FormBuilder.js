import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AsyncSearch from 'dan-components/AsyncSearch';
import API from 'dan-containers/Utils/api';
import { delay } from 'dan-containers/Common/Utils';
import RichEditor from './RichEditor';

const styles = theme => ({
  inputWidth: {
    width: '300px'
  },
  formControl: {
    margin: theme.spacing(2, 0, 1, 0),
    minWidth: 120,
    maxWidth: 300
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300
    }
  }
};

const MuiTextField = props => {
  const {
    id,
    label,
    value = '',
    required,
    placeholder,
    read_only: disabled,
    onChange,
    classes
  } = props;

  return (
    <Grid item>
      <TextField
        id={id}
        name={id}
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        variant="outlined"
        className={classes.inputWidth}
      />
    </Grid>
  );
};

const MuiSelect = props => {
  const {
    id,
    label,
    value = '',
    required,
    options,
    placeholder,
    read_only: disabled,
    onChange,
    classes
  } = props;
  return (
    <Grid item>
      <TextField
        id={id}
        name={id}
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        select
        variant="outlined"
        className={classes.inputWidth}
      >
        {options
          && options.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
      </TextField>
    </Grid>
  );
};

const MuiMultiSelect = props => {
  const {
    id,
    label,
    value,
    required,
    options,
    placeholder,
    read_only: disabled,
    onChange,
    classes
  } = props;

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <Grid item>
      <FormControl
        variant="outlined"
        className={classNames(classes.inputWidth)}
      >
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          {label}
        </InputLabel>
        <Select
          labelId={label}
          id={id}
          name={id}
          multiple
          value={value}
          required={required}
          disabled={disabled}
          onChange={onChange}
          labelWidth={labelWidth}
          placeholder={placeholder}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {options.map(option => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={value.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

const MuiAsyncSelect = props => {
  const {
    id,
    label,
    options_service_path: path,
    options,
    required,
    read_only: disabled,
    onChange,
  } = props;

  const selectedValue = options.length > 0 ? { id: options[0].id, name: options[0].name } : '';

  const [options_, setOptions_] = useState([]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState('');

  const getResources = async () => {
    const params = { term };
    setLoading(true);
    try {
      const response = await API.get(path, { params });
      const { data } = response.data;
      setOptions_(data.map(item => ({ value: item.id, name: item.name })));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getResources();
  }, [term]);

  const handleOnChange = async (e, value_) => {
    const target = { name: id, value: value_ };
    onChange({ target });
  };

  const handleOnInputChange = async (e, value_) => {
    try {
      const filters = options_.filter(item => item.name === value_);
      //  if(value_ !== '' && value_ !== (value ? value.name : '') && filters.length === 0) {
      if (
        value_ !== '' &&
        value_ !== (selectedValue ? selectedValue.name : '') &&
        filters.length === 0
      ) {
        delay(value_, () => setTerm(value_));
      }
      if (value_ === '' && filters.length === 0) {
        delay(value_, () => setTerm(value_));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid item>
      <AsyncSearch
        id={id}
        value={selectedValue}
        label={label}
        loading={loading}
        required={required}
        disabled={disabled}
        options={options_}
        onChange={handleOnChange}
        onInputChange={handleOnInputChange}
      />
    </Grid>
  );
};

const MuiRichTextEditor = props => {
  const { id, label, value = '', onChange } = props;
  return (
    <RichEditor
      id={id}
      label={label}
      text={value}
      onTextEditorChange={onChange}
    />
  );
};

const MuiDate = props => {
  const {
    id,
    label,
    value,
    required,
    read_only: disabled,
    onChange,
    classes
  } = props;

  const handleChange = (e) => onChange({ target: { name: id, value: moment(e).format() } });

  return (
    <Grid item>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          id={id}
          format="YYYY/MM/DD"
          placeholder="2018/10/10"
          label={label}
          value={value}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          animateYearScrolling={false}
          inputVariant="outlined"
          className={classes.inputWidth}
        />
      </MuiPickersUtilsProvider>
    </Grid>
  );
};

const FormBuilder = (props) => {
  const { properties, classes, onChange } = props;
  const mainProps = properties
    ? properties.filter(item => item.input_type !== 'rich_text')
    : [];
  const richEditorProps = properties
    ? properties.filter(item => item.input_type === 'rich_text')
    : [];

  return (
    <Grid container spacing={2} direction="row" justify="flex-start">
      {[...mainProps, ...richEditorProps].map(item => {
        switch (item.input_type) {
          case 'text':
            return (
              <MuiTextField
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
          case 'single_select':
            return (
              <MuiSelect
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
          case 'enum_input':
            return (
              <MuiSelect
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
          case 'single_select_with_remote_options':
            return (
              <MuiAsyncSelect
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
          case 'multi_select':
            return (
              <MuiMultiSelect
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
          case 'rich_text':
            return (
              <MuiRichTextEditor
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
          case 'date':
            return (
              <MuiDate
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
          default:
            return (
              <MuiTextField
                key={item.id}
                {...item}
                classes={classes}
                onChange={onChange}
              />
            );
        }
      })}
    </Grid>
  );
}

FormBuilder.propTypes = {
  properties: PropTypes.any.isRequired,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

MuiTextField.defaultProps = {
  value: '',
  placeholder: ''
};

MuiTextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  read_only: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

MuiSelect.defaultProps = {
  value: '',
  options: [],
  placeholder: ''
};

MuiSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool.isRequired,
  read_only: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  options: PropTypes.array
};

MuiMultiSelect.defaultProps = {
  placeholder: '',
  value: undefined
};

MuiMultiSelect.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.array,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool.isRequired,
  read_only: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

MuiAsyncSelect.defaultProps = {
  options: []
};

MuiAsyncSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  read_only: PropTypes.bool.isRequired,
  options: PropTypes.array,
  options_service_path: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

MuiRichTextEditor.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

MuiDate.defaultProps = {
  value: ''
};

MuiDate.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  read_only: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormBuilder);
