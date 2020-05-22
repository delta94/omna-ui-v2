import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FormHelperText from '@material-ui/core/FormHelperText';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getIntegrations } from 'dan-actions/integrationActions';

const styles = () => ({
  inputWidth: {
    width: '300px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 350,
    },
  },
};

const LINK_TITLE = 'Link product';
const UNLINK_TITLE = 'Unlink product';
const LINK_TEXT = 'To link this product check the integrations below';
const UNLINK_TEXT = 'To unlink this product uncheck the linked integrations below';

function Publisher(props) {
  const { classes, action, open, product, integrations, onClose, onGetIntegrations } = props;


  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteFromIntegration, setDeleteFromIntegration] = useState(false);
  const [error, setError] = useState(false);
  const [labelWidth] = useState(0);
  const inputLabel = React.useRef(null);

  useEffect(() => {
    if (product && product.integrations) {
      const items = product.integrations.map(item => item.id);
      setSelectedItems(items);
      setError(false);
    }
  }, [product, open]);

  useEffect(() => {
    action === 'link' ? onGetIntegrations({ limit: 100, offset: 0, with_details: true }) : null;
  }, [])

  const handleOnChange = e => setSelectedItems(e.target.value);

  const handleOnSave = async () => {
    const { onSave } = props;
    const list = [];
    if (action === 'link') {
      selectedItems.forEach(element => {
        const index = product.integrations.findIndex(item => item.id === element);
        index === -1 ? list.push(element) : null;
      });
    } else {
      product.integrations.forEach(element => {
        const index = selectedItems.findIndex(item => item === element.id);
        index === -1 ? list.push(element.id) : null;
      });
    }
    if(list.length === 0) {
      setError(true);
    } else {
      onSave({ productId: product.id, list, deleteFromIntegration });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{action === 'link' ? LINK_TITLE : UNLINK_TITLE}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {action === 'link' ? LINK_TEXT : UNLINK_TEXT}
        </DialogContentText>
        <div className={classes.content}>
        <FormControl variant="outlined" className={classes.inputWidth} error={error}>
          <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
            Integrations
          </InputLabel>
          <Select
            multiple
            labelId="Integrations"
            id="id-integrations"
            name="integrations"
            value={selectedItems}
            onChange={handleOnChange}
            labelWidth={labelWidth}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {product && action === 'link' && integrations.data.map(option => {
              const found = product.integrations.findIndex(item => item.id === option.id) > -1;
              return (
                <MenuItem key={option.id} value={option.id} disabled={found}>
                  <Checkbox checked={selectedItems.indexOf(option.id) > -1} />
                  <ListItemText primary={option.name} secondary={found ? 'Already linked' : ''} />
                  {!option.authorized ? (
                    <ListItemSecondaryAction>
                      <Chip label="unauthorized" color="default" />
                    </ListItemSecondaryAction>
                  ) : null}
                </MenuItem>
              );
            })}
            {product && action === 'unlink' && product.integrations.map(option => {
              return (
                <MenuItem key={option.id} value={option.id}>
                  <Checkbox checked={selectedItems.indexOf(option.id) > -1} />
                  <ListItemText primary={option.name} />
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>{error ? 'There is no elements to save' : ''}</FormHelperText>
        </FormControl>
        {action === 'unlink' ? (
          <FormControlLabel
          control={
            <Checkbox
              name="delete"
              checked={deleteFromIntegration}
              onChange={(e) => setDeleteFromIntegration(e.target.checked)}
              value="delete"
            />
          }
          label="Delete from integration"
        />
        ) : null}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOnSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = state => ({
  integrations: state.getIn(['integration', 'integrations']).toJS(),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch)
});

const PublisherMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Publisher);

Publisher.defaultProps = {
  action: 'link',
  product: null
};

Publisher.propTypes = {
  action: PropTypes.string,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  product: PropTypes.object,
  integrations: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired
};

export default withStyles(styles)(PublisherMapped);
