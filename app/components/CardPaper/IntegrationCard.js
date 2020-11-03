import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Block';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import styles from './cardStyle-jss';

const ITEM_HEIGHT = 48;

class IntegrationCard extends React.Component {
  state = { anchorElOpt: null };

  handleClickOpt = event => {
    this.setState({ anchorElOpt: event.currentTarget });
  };

  handleCloseOpt = () => {
    this.setState({ anchorElOpt: null });
  };

  handleClickOptItem = (item) => {
    const { onClickOption } = this.props;
    onClickOption(item);
    this.handleCloseOpt();
  };

  render() {
    const {
      classes,
      avatar,
      name,
      subheader,
      image,
      content,
      status,
      actions,
      options
    } = this.props;
    const { anchorElOpt } = this.state;
    return (
      <Card className={classes.cardSocmed}>
        <CardHeader
          avatar={avatar && (
            <Avatar alt="avatar" src={avatar} className={classes.avatar} />)
          }
          title={name}
          subheader={subheader}
          action={options && (
            <IconButton
              aria-label="More"
              aria-owns={anchorElOpt ? 'long-menu' : null}
              aria-haspopup="true"
              className={classes.button}
              onClick={this.handleClickOpt}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        />
        {options && (
          <Menu
            id="long-menu"
            anchorEl={anchorElOpt}
            open={Boolean(anchorElOpt)}
            onClose={this.handleCloseOpt}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 8.5,
                width: 200,
              },
            }}
          >
            {options.map(({ name: nm, value }) => (
              <MenuItem key={value} onClick={() => this.handleClickOptItem(value)}>
                {nm}
              </MenuItem>
            ))}
          </Menu>
        )}
        { image !== '' && (
          <CardMedia
            className={classes.mediaGCard}
            image={image}
            title="Contemplative Reptile"
          />
        )}
        { content && (
          <CardContent>
            <Typography component="p">
              {content}
            </Typography>
          </CardContent>
        )}
        <CardActions className={classes.actionIcons}>
          <div className={classes.button}>
            {status && (
              <Fragment>
                <IconButton disableRipple disableFocusRipple aria-label={status} style={{ pointerEvents: 'none' }} className={classes.rightIcon}>
                  {status !== 'Unauthorized' ? <CheckCircleIcon style={{ color: '#4caf50' }} /> : (
                    <CancelIcon />
                  )}
                  <span className={classes.num}>{status}</span>
                </IconButton>
              </Fragment>
            )}
          </div>
          <div>
            {actions}
          </div>
        </CardActions>
      </Card>
    );
  }
}

IntegrationCard.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  subheader: PropTypes.string,
  avatar: PropTypes.string,
  status: PropTypes.string,
  image: PropTypes.string,
  content: PropTypes.string,
  options: PropTypes.node,
  actions: PropTypes.node,
  onClickOption: PropTypes.func
};

IntegrationCard.defaultProps = {
  image: '',
  status: '',
  subheader: '',
  content: undefined,
  avatar: undefined,
  options: undefined,
  actions: undefined,
  onClickOption: undefined
};

export default withStyles(styles)(IntegrationCard);
