import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import Ionicon from 'react-ionicons';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const variantIcon = {
  success: 'md-checkmark-circle',
  warning: 'md-warning',
  error: 'md-alert',
  info: 'ios-information-circle',
  delete: 'md-trash',
  add: 'md-add-circle',
  schedule: 'md-time',
  refresh: 'md-refresh',
  arrowBack: 'md-arrow-back',
  play: 'md-play',
  filter: 'md-funnel',
  print: 'md-print',
  view: 'md-eye',
  search: 'md-search',
};

const styles = theme => ({
  elementPadding: {
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  elementPaddingTop: {
    paddingTop: theme.spacing.unit,
  },
  elementPaddingBot: {
    paddingBottom: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class GenericFilterTool extends React.Component {
  state = {
    anchorEl: null,
    currentTerm: '',
    filters: {},
    search: false,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  handleFiltersChange = (filter) => (event) => {
    const { filters } = this.state;
    filters[filter] = event.target.value;
    this.setState({
      filters
    });
  }

  handleAddTerm = () => {
    const { currentTerm, terms } = this.state;
    if (currentTerm !== null && currentTerm !== '') {
      terms[terms.lenght] = currentTerm;
      // Aki tengo que agregarlo a la lista de objetos visual de los términos
      this.setState({
        terms,
        currentTerm: ''
      });
    }
  }

  handleSingleTermChange = (event) => {
    this.setState({ currentTerm: event.target.value });
  }

  handleSearchClick = () => {
    const {
      currentTerm,
      filters,
    } = this.state;

    const { onSearchFilterClick } = this.props;

    onSearchFilterClick(currentTerm, filters);
  }

  render() {
    const {
      classes,
      filterList, // Filter item label list
    } = this.props;
    const action = 'Filter';
    const {
      anchorEl,
      currentTerm,
      filters,
      search,
    } = this.state;

    return (
      <Fragment>
        <Tooltip title={action} key={action}>
          <IconButton aria-label={action} onClick={this.handleClick}>
            <Ionicon icon={variantIcon.filter} />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <div className="display-flex justify-content-space-between align-items-center">
            <Typography className={classNames(classes.elementPaddingTop, classes.elementPadding)}>
              FILTERS:
            </Typography>
            <Tooltip title="Search">
              <IconButton aria-label="Search" onClick={this.handleSearchClick} disabled={search}>
                <Ionicon icon={variantIcon.search} />
              </IconButton>
            </Tooltip>
          </div>
          {
            // ================== FILTERS =================
          }
          {
            filterList !== [] && filterList !== null
              ? (
                filterList.map(filter => (
                  <Typography component="div" className={classNames(classes.elementPaddingBot, classes.elementPadding)} key={filter}>
                    <FormControl>
                      <InputLabel>{filter}</InputLabel>
                      <Input id={filter} value={get(filters, `${filter}`, '')} onChange={this.handleFiltersChange(filter)} />
                    </FormControl>
                  </Typography>
                ))
              ) : (
                null
              )
          }
          <Divider />
          <Typography className={classNames(classes.elementPaddingTop, classes.elementPadding)}>
            TERM:
          </Typography>
          {
            // ================== TERMS =================
          }
          {
            <TextField
              label="Term"
              id="term"
              value={currentTerm}
              onChange={this.handleSingleTermChange}
              className={classNames(classes.elementPaddingBot, classes.elementPadding)}
              helperText="Terms have been searched on the table fields."
              size="small"
            />
          }
        </Popover>
      </Fragment>
    );
  }
}

GenericFilterTool.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  onSearchFilterClick: PropTypes.func,
  filterList: PropTypes.array.isRequired,
};

GenericFilterTool.defaultProps = {
  onSearchFilterClick: () => {},
};

export default withStyles(styles)(GenericFilterTool);
