import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    }
});

function LoadingState(props) {

    const { classes, loading, text } = props;

    return (
        <div className={classes.root}>
            <Fade
                in={loading}
                unmountOnExit
            >
                <Fragment>
                    {text ? <Typography variant="h6">{`${text}...`}</Typography>: null}
                    <CircularProgress />
                </Fragment>
            </Fade>
        </div>
    );
}



LoadingState.propTypes = {
    text: PropTypes.string,
    loading: PropTypes.bool,
};

export default withStyles(styles)(LoadingState)
