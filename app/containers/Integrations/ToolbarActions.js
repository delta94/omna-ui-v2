import React from 'react';

// material-ui
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';

function ToolbarActions() {
  return (
    <div style={{ marginBottom: '5px', minWidth: '150px' }}>
      <AppBar position="static" color="default">
        <Toolbar className="flex-direction-row-inverse" disableGutters>
          <IconButton aria-label="Add" component={Link} to="/settings/stores/add-store">
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ToolbarActions;
