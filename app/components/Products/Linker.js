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

const LINK_TITLE = (strings, value) => `Link ${value}`;
const UNLINK_TITLE = (strings, value) => `Unlink ${value}`;
const LINK_TEXT = (strings, value) => `To link this ${value} check one of the integrations below`;
const UNLINK_TEXT = (strings, value) => `To unlink this ${value} uncheck one of the linked integrations below`;

function Linker(props) {
  const { classes, action, type, open, id, linkedIntegrations, integrations, fromShopifyApp, onClose, onGetIntegrations } = props;

  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteFromIntegration, setDeleteFromIntegration] = useState(false);
  const [errors, setErrors] = useState({
    integrations: '',
    delete: ''
  });
  const [dirty, setDirty] = useState(false);
  const [labelWidth] = useState(0);
  const inputLabel = React.useRef(null);


  useEffect(() => {
    if (id && linkedIntegrations) {
      const items = linkedIntegrations.map(item => item.id);
      setSelectedItems(items);
    }
  }, [id, open]);

  useEffect(() => {
    action === 'link' ? onGetIntegrations({ limit: 100, offset: 0, with_details: true }) : null;
  }, []);

  const validForm = () => {
    let valid = true;
    Object.keys(errors).forEach((key) => {
      errors[key] !== '' ? valid = false : null;
    });
    return valid;
  };

  const checkValidity = () => {
    if (fromShopifyApp && linkedIntegrations.length > 0) {
      const shopifyItem = linkedIntegrations.find(item => item.channel === 'Ov2Shopify');
      if(shopifyItem) {
        const found = selectedItems.find(item => item === shopifyItem.id);
        if (!found) {
          setErrors((prevState) => ({ ...prevState, integrations: 'Shopify integration can not be unlinked' }));
        } else
          setErrors((prevState) => ({ ...prevState, integrations: '' }));
      }
    }
    const linkedItems = linkedIntegrations.map(item => item.id);
    if (deleteFromIntegration && JSON.stringify(selectedItems.sort()) === JSON.stringify(linkedItems.sort())) {
      setErrors((prevState) => ({ ...prevState, delete: 'You have to uncheck some integration' }));
    } else
      setErrors((prevState) => ({ ...prevState, delete: '' }));

    if (JSON.stringify(selectedItems.sort()) === JSON.stringify(linkedItems.sort())) {
      setDirty(false);
    }
  };

  useEffect(() => {
    checkValidity();
  }, [deleteFromIntegration, selectedItems]);

  const handleOnChange = e => {
    setDirty(true);
    setSelectedItems(e.target.value)
  };

  const handleDeleteChange = e => setDeleteFromIntegration(e.target.checked);

  const handleOnSave = async () => {
    const { onSave } = props;
    const list = [];
    if (action === 'link') {
      selectedItems.forEach(element => {
        const index = linkedIntegrations.findIndex(item => item.id === element);
        index === -1 ? list.push(element) : null;
      });
    } else {
      linkedIntegrations.forEach(element => {
        const index = selectedItems.findIndex(item => item === element.id);
        index === -1 ? list.push(element.id) : null;
      });
    }
    onSave({ id, list, deleteFromIntegration });
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{action === 'link' ? LINK_TITLE`${type}` : UNLINK_TITLE`${type}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {action === 'link' ? LINK_TEXT`${type}` : UNLINK_TEXT`${type}`}
        </DialogContentText>
        <div className={classes.content}>
          <FormControl variant="outlined" className={classes.inputWidth} error={errors.integrations !== '' || false}>
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
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {id && action === 'link' && integrations.data.map(option => {
                const found = linkedIntegrations.findIndex(item => item.id === option.id) > -1;
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
              {id && action === 'unlink' && linkedIntegrations.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    <Checkbox checked={selectedItems.indexOf(option.id) > -1} />
                    <ListItemText primary={option.name} />
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{errors.integrations || ''}</FormHelperText>
          </FormControl>
          {action === 'unlink' ? (
            <FormControl error={errors.delete !== '' || false}>
              <FormControlLabel
                control={
                  (
                    <Checkbox
                      name="delete"
                      checked={deleteFromIntegration}
                      onChange={handleDeleteChange}
                      value="delete"
                    />
                  )
                }
                label="Delete from integration"
              />
              <FormHelperText>{errors.delete || ''}</FormHelperText>
            </FormControl>
          ) : null}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOnSave} color="primary" disabled={!validForm() || !dirty}>
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

const LinkerMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Linker);

Linker.defaultProps = {
  action: 'link',
  type: 'product',
  id: '',
  fromShopifyApp: undefined,
  linkedIntegrations: []
};

Linker.propTypes = {
  action: PropTypes.string,
  type: PropTypes.string,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  id: PropTypes.string,
  fromShopifyApp: PropTypes.bool,
  linkedIntegrations: PropTypes.array,
  integrations: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired
};

export default withStyles(styles)(LinkerMapped);
