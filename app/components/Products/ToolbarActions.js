import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  topAction: {
    display: 'flex',
    flexDirection: 'row-reverse',
    background: theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
    marginBottom: 20,
    alignItems: 'center',
    padding: '0 20px',
    borderRadius: theme.rounded.medium,
  },
});

function ToolbarActions({ classes, onVariantClick }) {

  return (
    <div className={classes.topAction}>
        <Tooltip id="tooltip-variants" title="Variants">
          <IconButton onClick={onVariantClick}><ViewAgendaIcon /></IconButton>
        </Tooltip>
    </div>
  );
};

ToolbarActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onVariantClick: PropTypes.func.isRequired
};

export default withStyles(styles)(ToolbarActions);
