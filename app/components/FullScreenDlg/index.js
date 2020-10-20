import React from 'react';
import { PropTypes } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import styles from './fullScreenDlg-jss';

const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line
class FullScreenDlg extends React.Component {

  render() {
    const {
      classes,
      open,
      handleClose,
      handleConfirm,
      disableConfirm,
      title,
      children
    } = this.props;

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {title}
            </Typography>
            <Button color="inherit" onClick={handleClose}>
              cancel
            </Button>
            <Button color="inherit" onClick={handleConfirm} disabled={disableConfirm}>
              done
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.detailWrap}>
          {children}
        </div>
      </Dialog>
    );
  }
}

FullScreenDlg.defaultProps = {
  disableConfirm: false
};

FullScreenDlg.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  disableConfirm: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default withStyles(styles)(FullScreenDlg);
