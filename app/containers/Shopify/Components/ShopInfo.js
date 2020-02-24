import React from 'react';
import { Tooltip, Zoom, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const StyledTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14
    }

}))(Tooltip);

function ShopInfo(props) {    
    const { name, domain } = props;

    return (
        <StyledTooltip TransitionComponent={Zoom} 
                        title={domain}
                        placement="left"
                        interactive
                        {...props}>

            <Typography variant="h6"
                        component="span">
                { name }
            </Typography>
        </StyledTooltip>
    );
}

export default ShopInfo;

ShopInfo.propTypes = {
    name: PropTypes.string.isRequired,
    domain: PropTypes.string
};
