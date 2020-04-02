import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

const AsyncSearch = ({ label, loading, options, onChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Autocomplete
      freeSolo
      id="asynchronous-search"
      disableClearable
      size="small"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={onChange}
      getOptionSelected={(option, value) => option.name === value.name}
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
  label: null,
  loading: false,
  options: [],
  onChange: () => {}
};

AsyncSearch.propTypes = {
  label: PropTypes.string,
  loading: PropTypes.bool,
  options: PropTypes.array,
  onChange: PropTypes.func
};

export default AsyncSearch;
