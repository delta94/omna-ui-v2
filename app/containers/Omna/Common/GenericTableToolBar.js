import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { lighten } from '@material-ui/core/styles/colorManipulator';
// icons
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

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
        <Icon />
      </IconButton>
    </Tooltip>
  )

  render() {
    const {
      numSelected,
      initialText,
      classes,
      rowCount,
      onAdd, // Add onClick function
      onDelete, // Delete onClick function
      actionList // List of actions to be considered
    } = this.props;

    // Array with the details of the registered actions
    const detailedArrayActions = {
      Delete: { onclickfunc: onDelete, icon: DeleteIcon },
      Add: { onclickfunc: onAdd, icon: AddIcon },
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
                    {act !== 'Add' && get(detailedArrayActions, `${act}`, null) !== null ? (
                      this.printBottom(act, get(detailedArrayActions, `${act}.onclickfunc`, () => {}), get(detailedArrayActions, `${act}.icon`, DeleteIcon))
                    ) : (
                      null
                    )}
                  </div>
                ))
              }
            </div>
          ) : (
            actionList && actionList.map(act => (
              <div key={act}>
                {act === 'Add' ? (
                  this.printBottom(act, onAdd, AddIcon)
                ) : (
                  null
                )}
              </div>
            ))
          )
          }
        </div>
      </Toolbar>
    );
  }
}

GenericTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  actionList: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  initialText: PropTypes.string,
};
GenericTableToolbar.defaultProps = {
  onDelete: () => {},
  onAdd: () => {},
  initialText: '',
};

export default withSnackbar(withStyles(toolbarStyles)(GenericTableToolbar));
