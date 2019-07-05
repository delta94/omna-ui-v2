import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import Ionicon from 'react-ionicons';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { lighten } from '@material-ui/core/styles/colorManipulator';
// our
import GenericFilterTool from './GenericFilterTool';

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
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === 'light' ? (
      {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0)
      }
    ) : (
      {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      }
    ),
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.primary
  },
  title: {
    flex: '0 0 auto'
  }
});

class GenericTableToolbar extends React.Component {
  printBottom = (action, actionClickFunc, Icon) => (
    <Tooltip title={action} key={action}>
      <IconButton aria-label={action} onClick={actionClickFunc}>
        <Ionicon icon={Icon} />
      </IconButton>
    </Tooltip>
  )

  handleSearchClick = (currentTerm, filters) => {
    const { onSearchFilterClick } = this.props;

    onSearchFilterClick(currentTerm, filters);
  }

  render() {
    const {
      numSelected,
      initialText,
      classes,
      rowCount,
      onAdd, // Add onClick function
      onDelete, // Delete onClick function
      actionList, // List of actions to be considered
      filterList, // Filter item label list
    } = this.props;

    // Array with the details of the registered actions
    const detailedArrayActions = {
      Delete: { onclickfunc: onDelete, icon: variantIcon.delete },
      Add: { onclickfunc: onAdd, icon: variantIcon.add },
      Filter: { onclickfunc: this.handleSearchClick, icon: variantIcon.filter },
    };

    return (
      <Toolbar color="primary" className={classNames(classes.root, { [classes.highlight]: numSelected > 0 })}>
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="primary" variant="subtitle1">
              {numSelected}
              {' '}
              selected.
              {
                numSelected === rowCount ? (
                  ' All items on this page are selected.'
                ) : (
                  null
                )
              }
            </Typography>
          ) : (
            initialText !== ''
              ? (
                <Typography color="primary" variant="subtitle1">
                  {initialText}
                </Typography>
              ) : (
                null
              )
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <div className="display-flex justify-content-space-between">
              {
                actionList && actionList.map(act => (
                  <div key={act}>
                    {act !== 'Add' && act !== 'Filter' && get(detailedArrayActions, `${act}`, null) !== null ? (
                      this.printBottom(act, get(detailedArrayActions, `${act}.onclickfunc`, () => {}), get(detailedArrayActions, `${act}.icon`, variantIcon.delete))
                    ) : (
                      null
                    )}
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="display-flex justify-content-flex-end">
              {
                actionList && actionList.map(act => (
                  <div key={act}>
                    {
                      act === 'Filter'
                        ? (
                          <GenericFilterTool
                            onSearchFilterClick={this.handleSearchClick}
                            filterList={filterList}
                          />
                        ) : (
                          act === 'Add'
                            ? (
                              this.printBottom(act, onAdd, variantIcon.add)
                            ) : (
                              null
                            )
                        )
                    }
                  </div>
                ))
              }
            </div>
          )
          }
        </div>
      </Toolbar>
    );
  }
}

GenericTableToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  numSelected: PropTypes.number,
  rowCount: PropTypes.number.isRequired,
  actionList: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  initialText: PropTypes.string,
  onSearchFilterClick: PropTypes.func,
  filterList: PropTypes.array,
};
GenericTableToolbar.defaultProps = {
  onDelete: () => {},
  onAdd: () => {},
  onSearchFilterClick: () => {},
  initialText: '',
  filterList: [],
  numSelected: 0,
};

export default withSnackbar(withStyles(toolbarStyles)(GenericTableToolbar));
