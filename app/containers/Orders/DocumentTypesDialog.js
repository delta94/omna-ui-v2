import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import api from '../Utils/api';

// const useStyles = makeStyles({
//   avatar: {
//     backgroundColor: blue[100],
//     color: blue[600]
//   }
// });

class DocumentTypesDialog extends Component {
  //   const classes = useStyles();

  handleClose = () => {
    const { onClose, selectedValue } = this.props;
    onClose(selectedValue);
  };

  handleListItemClick = async value => {
    onClose(value);
    const response = await api.get(
      `/integrations/${integrationId}/orders/${orderNumber}/doc/${value.type}`
    );

    try {
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      open,
      types,
      integrationId,
      orderNumber
    } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Document types</DialogTitle>
        <List>
          {types.map(type => (
            <ListItem
              button
              onClick={() => handleListItemClick(type)}
              key={type.type}
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={type.title} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }
}

DocumentTypesDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object.isRequired,
  types: PropTypes.array.isRequired,
  integrationId: PropTypes.string.isRequired,
  orderNumber: PropTypes.string.isRequired
};

export default DocumentTypesDialog;
