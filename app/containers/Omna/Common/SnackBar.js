import React, { Fragment } from 'react';

//material-ui
import Snackbar from '@material-ui/core/Snackbar';

export default function SnackBar(props) {

    return (
        <Fragment>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                key={'bottom, right'}
                autoHideDuration={5000}
                open={props.open}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{props.message}</span>}
            />
        </Fragment>
    );

}
