import React, { useState, useEffect, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import get from 'lodash/get';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AutoSuggestion from 'dan-components/AutoSuggestion';
import API from 'dan-containers/Utils/api';
import { delay } from 'dan-containers/Common/Utils';
import RichEditor from './RichEditor';

const styles = theme => ({
  container: {
    flex: 'grow',
  },
  inputWidth: {
    width: '100%'
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

const WrapSection = ({ label, component }) => (
  <Fragment>
    {label && (
      <Grid item xs={12}>
        <Typography variant="subtitle2" style={{ marginTop: '8px' }}>{label}</Typography>
      </Grid>
    )}
    {component}
  </Fragment>
);

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
    <Grid item xs={12} sm={6}>
      <TextField
        id={id}
        name={id}
        label={label}
        value={value || ''}
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

const MuiNumericField = props => {
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

  const handleChange = (e) => {
    onChange({ target: { name: e.target.name, value: Number(e.target.value) } });
  };

  return (
    <Grid item xs={12} sm={6}>
      <TextField
        id={id}
        name={id}
        label={label}
        value={value || ''}
        type="number"
        placeholder={placeholder}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        variant="outlined"
        className={classes.inputWidth}
      />
    </Grid>
  );
};

const MuiMultiTextField = props => {
  const {
    id,
    label,
    value = '',
    required,
    read_only: disabled,
    onChange,
    classes
  } = props;

  return (
    <Grid item xs={12} sm={6}>
      <TextField
        id={id}
        name={id}
        label={label}
        value={value || ''}
        placeholder="Place multiple values separated by comma"
        onChange={onChange}
        required={required}
        disabled={disabled}
        variant="outlined"
        className={classes.inputWidth}
      />
    </Grid>
  );
};

const MuiBooleanSelect = props => {
  const {
    id,
    label,
    value,
    required,
    read_only: disabled,
    onChange,
    classes
  } = props;

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <Grid item xs={12} sm={6}>
      <FormControl required={required} variant="outlined" className={classes.inputWidth}>
        <InputLabel ref={inputLabel} id={id}>
          {label}
        </InputLabel>
        <Select
          labelId="boolean-label"
          id={id}
          name={id}
          disabled={disabled}
          value={value}
          onChange={onChange}
          labelWidth={labelWidth}
        >
          <MenuItem value>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </Select>
        {required && (<FormHelperText>Required</FormHelperText>)}
      </FormControl>
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
    <Grid item xs={12} sm={6}>
      <TextField
        id={id}
        name={id}
        label={label}
        value={value || ''}
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
    <Grid item xs={12} sm={6}>
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

const MuiAsyncSelect = withSnackbar((props) => {
  const {
    id,
    label,
    options_service_path: path,
    options,
    required,
    classes,
    read_only: disabled,
    onChange,
    enqueueSnackbar
  } = props;

  const selectedValue = options.length > 0 ? options[0] : '';

  const [options_, setOptions_] = useState([selectedValue]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState();

  const getResources = async () => {
    const params = { term };
    setLoading(true);
    try {
      const response = await API.get(path, { params });
      const { data } = response.data;
      data.unshift({ id: '', name: 'All' });
      setOptions_(data.map(item => ({ id: item.id, name: item.name })));
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getResources();
  }, [term]);

  const handleOnChange = async (e, element) => {
    const target = { name: id, value: element };
    onChange({ target });
  };

  const handleOnInputChange = async (e, element) => {
    const index = options_.findIndex(item => item.name === element);
    if (element === 'All') {
      setTerm('');
    } else if (index === -1) {
      element === '' ? setTerm(element) : delay(() => setTerm(element));
    }
  };

  return (
    <Grid item xs={12} sm={6}>
      <AutoSuggestion
        id={id}
        label={label}
        className={classes.inputWidth}
        disabled={disabled}
        required={required}
        options={options_}
        loading={loading}
        value={selectedValue}
        onChange={handleOnChange}
        onInputChange={handleOnInputChange}
      />
    </Grid>
  );
});

const MuiRichTextEditor = props => {
  const {
    id, label, value = '', onChange
  } = props;
  return (
    <Grid item xs={12}>
      <RichEditor
        id={id}
        label={label}
        text={value}
        onTextEditorChange={onChange}
      />
    </Grid>
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
    <Grid item xs={12} sm={6}>
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
    <div className={classes.container}>
      <Grid container spacing={3}>
        {[...mainProps, ...richEditorProps].map(item => {
          let node;
          switch (item.input_type) {
            case 'text':
              node = (
                <MuiTextField
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'numeric':
              node = (
                <MuiNumericField
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'multi_text_input':
              node = (
                <MuiMultiTextField
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'single_select':
              node = (
                <MuiSelect
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'single_enum_input':
              node = (
                <MuiSelect
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'boolean':
              node = (
                <MuiBooleanSelect
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'single_select_with_remote_options':
              node = (
                <MuiAsyncSelect
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'multi_select':
              node = (
                <MuiMultiSelect
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'multi_enum_input':
              node = (
                <MuiMultiSelect
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'rich_text':
              node = (
                <MuiRichTextEditor
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            case 'date':
              node = (
                <MuiDate
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
            default:
              node = (
                <MuiTextField
                  {...item}
                  classes={classes}
                  onChange={onChange}
                />
              );
              return <WrapSection key={item.id} label={item.start_section} component={node} />;
          }
        })}
      </Grid>
    </div>
  );
};

WrapSection.defaultProps = {
  label: ''
};

WrapSection.propTypes = {
  label: PropTypes.string,
  component: PropTypes.node.isRequired
};

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

MuiNumericField.defaultProps = {
  value: '',
  placeholder: ''
};

MuiNumericField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  read_only: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

MuiMultiTextField.defaultProps = {
  value: ''
};

MuiMultiTextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
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

MuiBooleanSelect.defaultProps = {
  value: undefined,
  read_only: undefined
};

MuiBooleanSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool.isRequired,
  read_only: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
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
  options: [],
  enqueueSnackbar: undefined
};

MuiAsyncSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  read_only: PropTypes.bool.isRequired,
  options: PropTypes.array,
  classes: PropTypes.object.isRequired,
  options_service_path: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func
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
