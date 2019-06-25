import React, { Component } from 'react';
//material-ui 
import Drawer from '@material-ui/core/Drawer';
import  MenuItems from './MenuItems';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';


const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9 + 1,
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
    },
    topToolbar: theme.mixins.toolbar
    
});
class SideLeftNavBar extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    handleOpenNavbar = () => {
        this.setState({open: true});
    } 

    handleCloseNavbar = () => {
        this.setState({open: false});
    }

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div className={classes.root} onMouseOver={()=> {this.handleOpenNavbar()}} onMouseLeave={()=>{this.handleCloseNavbar()}}>
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                      })}
                      classes={{
                        paper: classNames({
                          [classes.drawerOpen]: this.state.open,
                          [classes.drawerClose]: !this.state.open,
                        }),
                      }}
                      open={open}
                >
                <div className={classes.topToolbar}/>
                    <MenuItems />
                </Drawer>
            </div>
        )
    }
}

export default withStyles(styles)(SideLeftNavBar);