import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import API from '../Utils/api';

// const useStyles = makeStyles({
//   avatar: {
//     backgroundColor: blue[100],
//     color: blue[600]
//   }
// });

const DocumentTypesDialog = props => {
  //   const classes = useStyles();
  const {
    onClose,
    selectedValue,
    open,
    types,
    integrationId,
    orderNumber
  } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = value => {
    onClose(value);
    API.get(
      `/integrations/${integrationId}/orders/${orderNumber}/doc/${value.type}`
    )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  };

  return (
    <Dialog
      onClose={handleClose}
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
};

DocumentTypesDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object.isRequired,
  types: PropTypes.array.isRequired,
  integrationId: PropTypes.string.isRequired,
  orderNumber: PropTypes.string.isRequired
};

export default DocumentTypesDialog;
