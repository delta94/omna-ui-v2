import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

const AsyncSearch = ({ id, label, value, inputValue, loading, freeSolo, required, disabled, options, onChange, onInputChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Autocomplete
      id={id}
      required={required}
      freeSolo={freeSolo}
      disabled={disabled}
      disableClearable
      size="medium"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      inputValue={inputValue}
      onChange={onChange}
      onInputChange={onInputChange}
      getOptionSelected={(option, optionValue) => option.name === optionValue.name}
      getOptionLabel={option => option.name}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label={label || 'Search...'}
          style={{ display: 'flex', flex: '1 1 auto', minWidth: 300 }}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            type: 'search',
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
};

AsyncSearch.defaultProps = {
  id: 'asynchronous-search',
  value: null,
  inputValue: null,
  label: null,
  loading: false,
  freeSolo: false,
  required: false,
  disabled: false,
  options: [],
  onChange: () => {},
  onInputChange: () => {}
};

AsyncSearch.propTypes = {
  id: PropTypes.string,
  value: PropTypes.object,
  inputValue: PropTypes.string,
  label: PropTypes.string,
  loading: PropTypes.bool,
  freeSolo: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func
};

export default AsyncSearch;
