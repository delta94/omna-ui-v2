import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

export default function AutoSuggestion(props) {
  const {
    id, label, options, loading, value, style, className, freeSolo, disabled, required, error, helperText, placeholder, inputValue, onChange, onInputChange
  } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <Autocomplete
      id={id}
      style={style}
      className={className}
      open={open}
      freeSolo={freeSolo}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      disabled={disabled}
      value={value}
      inputValue={inputValue}
      onChange={onChange}
      onInputChange={onInputChange}
      getOptionSelected={(option, _value) => option.name === _value.name}
      getOptionLabel={option => option.name || ''}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          fullWidth
          variant="outlined"
          error={error}
          required={required}
          helperText={helperText}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

AutoSuggestion.defaultProps = {
  id: 'asynchronous-search',
  value: '',
  inputValue: undefined,
  label: 'search',
  loading: false,
  freeSolo: false,
  required: false,
  disabled: false,
  options: [],
  style: undefined,
  className: undefined,
  error: false,
  helperText: '',
  placeholder: '',
  onChange: () => {},
  onInputChange: () => {}
};

AutoSuggestion.propTypes = {
  id: PropTypes.string,
  value: PropTypes.object,
  inputValue: PropTypes.string,
  label: PropTypes.string,
  loading: PropTypes.bool,
  freeSolo: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  style: PropTypes.object,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func
};
