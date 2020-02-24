import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import RichEditor from './RichEditor';


const styles = (theme) => ({
  inputWidth: {
    width: '300px'
  },
  formControl: {
    margin: theme.spacing(2, 0, 1, 0),
    minWidth: 120,
    maxWidth: 300,
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

const MuiTextField = (props) => {
  const {
    id, label, value, name, required, placeholder, disabled, onChange, classes
  } = props;
  return (
    <Grid item>
      <TextField
        id={id}
        label={label}
        value={value}
        name={name || label}
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

const MuiSelect = (props) => {
  const {
    id, label, value, name, required, options, placeholder, disabled, onChange, classes
  } = props;
  return (
    <Grid item>
      <TextField
        id={id}
        label={label}
        value={value}
        name={name || label}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        select
        variant="outlined"
        className={classes.inputWidth}
      >
        {options && options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
};

// TO DO: adjust value in multiselect
const MuiMultiSelect = (props) => {
  const {
    id, label, name, required, options, placeholder, onChange, classes
  } = props;

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const [selectedValues] = useState([]);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);
  // TO DO: adjust value in multiselect
  return (
    <Grid item>
      <FormControl variant="outlined" className={classNames(classes.inputWidth)}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          {label}
        </InputLabel>
        <Select
          labelId={label}
          id={id}
          name={name || label}
          value={selectedValues}
          required={required}
          onChange={onChange}
          labelWidth={labelWidth}
          placeholder={placeholder}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {options.map(option => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={selectedValues.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

const MuiRichTextEditor = (props) => {
  const {
    label, value, onChange
  } = props;
  return (
    <RichEditor label={label} text={value} onTextEditorChange={onChange} />
  );
};

function FormBuilder(props) {
  const { properties, classes, onChange } = props;
  const mainProps = properties ? properties.filter(item => item.input_type !== 'rich_text') : [];
  const richEditorProps = properties ? properties.filter(item => item.input_type === 'rich_text') : [];

  return (
    <Grid container spacing={6} direction="row" justify="flex-start">
      {[...mainProps, ...richEditorProps].map((item) => {
        switch (item.input_type) {
          case 'text':
            return <MuiTextField {...item} classes={classes} onChange={onChange} />;
          case 'single_select':
            return <MuiSelect {...item} classes={classes} onChange={onChange} />;
          case 'category_select_box':
            return <MuiSelect {...item} classes={classes} onChange={onChange} />;
          case 'enum_input':
            return <MuiSelect {...item} classes={classes} onChange={onChange} />;
          case 'multi_select':
            return <MuiMultiSelect {...item} classes={classes} onChange={onChange} />;
          case 'rich_text':
            return <MuiRichTextEditor {...item} classes={classes} onChange={onChange} />;
          default:
            return <MuiTextField {...item} classes={classes} onChange={onChange} />;
        }
      }
      )}
    </Grid>
  );
}

FormBuilder.propTypes = {
  properties: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

MuiTextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
};

MuiTextField.defaultProps = {
  name: null
};

MuiSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  options: PropTypes.array
};

MuiSelect.defaultProps = {
  options: [],
  name: null
};

MuiMultiSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
};

MuiMultiSelect.defaultProps = {
  name: null
};

MuiRichTextEditor.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(FormBuilder);
