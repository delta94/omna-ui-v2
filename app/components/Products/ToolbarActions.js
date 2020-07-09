import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListIcon from '@material-ui/icons/List';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

const styles = theme => ({
  topAction: {
    display: 'flex',
    flexDirection: 'row-reverse',
    background: theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
    marginBottom: 5,
    alignItems: 'center',
    padding: '0 20px',
    borderRadius: theme.rounded.medium,
  },
  button: {
    margin: theme.spacing(1),
  },
});

function ToolbarActions({ classes, onVariantClick, onLink, onUnlink }) {

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
    </div>
  );
};

ToolbarActions.defaultProps = {
  onVariantClick: undefined
};

ToolbarActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onVariantClick: PropTypes.func,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired
};

export default withStyles(styles)(ToolbarActions);
