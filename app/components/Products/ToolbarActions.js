import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListIcon from '@material-ui/icons/List';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';

const styles = theme => ({
  topAction: {
    display: 'flex',
    flexDirection: 'row-reverse',
    background: theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
    marginBottom: 5,
    alignItems: 'center',
    borderRadius: theme.rounded.medium,
  },
  button: {
    margin: theme.spacing(1),
  },
});

function ToolbarActions(props) {

  const { classes, disableImport, onVariantClick, onLink, onUnlink, onImport } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (action) => {
    onImport(action);
    handleClose();
  };

  return (
    <div className={classes.topAction}>
      {onVariantClick && (
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<ListIcon />}
          onClick={onVariantClick}
        >
          Variants
        </Button>
      )}
      <Button
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<LinkOffIcon />}
        onClick={onUnlink}
      >
        Unlink
      </Button>
      <Button
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<LinkIcon />}
        onClick={onLink}
      >
        Link
      </Button>
      {onImport && (
        <Fragment>
          <Tooltip title="Import">
            <span>
              <IconButton
                aria-label="import"
                aria-controls="import"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                disabled={disableImport}
              >
                <VerticalAlignBottomIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleClick('import this product')}>Import this product</MenuItem>
            <MenuItem onClick={() => handleClick('import categories')}>Import categories</MenuItem>
            <MenuItem onClick={() => handleClick('import brands')}>Import brands</MenuItem>
          </Menu>
        </Fragment>
      )}
    </div>
  );
}

ToolbarActions.defaultProps = {
  onVariantClick: undefined,
  onImport: undefined,
  disableImport: true
};

ToolbarActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  onVariantClick: PropTypes.func,
  onImport: PropTypes.func,
  disableImport: PropTypes.bool
};

export default withStyles(styles)(ToolbarActions);
