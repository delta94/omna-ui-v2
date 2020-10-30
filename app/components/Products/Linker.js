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
import CancelIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getIntegrations } from 'dan-actions/integrationActions';

const styles = () => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
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
const LINK_TEXT = (strings, value) => `To link this ${value} check the integration(s) below`;
const UNLINK_TEXT = (strings, value) => `To unlink this ${value} check the linked integration(s) below`;

function Linker(props) {
  const { classes, action, type, open, id, linkedIntegrations, integrations, fromShopifyApp, onClose, onGetIntegrations } = props;

  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteFromIntegration, setDeleteFromIntegration] = useState(false);
  const [errors, setErrors] = useState({
    integrations: '',
    delete: ''
  });
  const [dirty, setDirty] = useState(false);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    inputLabel.current ? setLabelWidth(inputLabel.current.offsetWidth) : null;
  });

  useEffect(() => {
    if (id && action === 'link' && linkedIntegrations) {
      const items = linkedIntegrations.map(item => item.id);
      setSelectedItems(items);
    }
    if (!open) {
      setSelectedItems([]);
      setDirty(false);
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
    if (action === 'unlink') {
      if (fromShopifyApp && linkedIntegrations.length > 0) {
        const shopifyItem = linkedIntegrations.find(item => item.channel === 'Ov2Shopify');
        if (shopifyItem) {
          const found = selectedItems.find(item => item === shopifyItem.id);
          if (found) {
            setErrors((prevState) => ({ ...prevState, integrations: 'Shopify integration can not be unlinked' }));
          } else setErrors((prevState) => ({ ...prevState, integrations: '' }));
        }
      }
      if (deleteFromIntegration && selectedItems.length === 0) {
        setErrors((prevState) => ({ ...prevState, delete: 'You have to check some integration' }));
      } else setErrors((prevState) => ({ ...prevState, delete: '' }));

      if (selectedItems.length === 0) {
        setDirty(false);
      }
    }

    if (action === 'link') {
      if (selectedItems.length > 0) {
        for (let i = 0; i < selectedItems.length; i += 1) {
          const iterator = selectedItems[i];
          const found = integrations.data.find(element => element.id === iterator && !element.authorized);
          if (found) {
            setErrors((prevState) => ({ ...prevState, integrations: 'Unauthorized integrations can not be linked' }));
            break;
          } else setErrors((prevState) => ({ ...prevState, integrations: '' }));
        }
      } else setErrors((prevState) => ({ ...prevState, integrations: '' }));
      const linkedItems = linkedIntegrations.map(item => item.id);
      if (JSON.stringify(selectedItems.sort()) === JSON.stringify(linkedItems.sort())) {
        setDirty(false);
      }
    }
  };

  useEffect(() => {
    checkValidity();
  }, [deleteFromIntegration, selectedItems]);

  const handleOnChange = e => {
    setDirty(true);
    setSelectedItems(e.target.value);
  };

  const handleDeleteChange = e => setDeleteFromIntegration(e.target.checked);

  const handleOnSave = async () => {
    const { onSave } = props;
    let list = [];
    if (action === 'link') {
      selectedItems.forEach(element => {
        const index = linkedIntegrations.findIndex(item => item.id === element);
        index === -1 ? list.push(element) : null;
      });
    } else {
      list = selectedItems;
    }
    onSave({ id, list, deleteFromIntegration });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{action === 'link' ? LINK_TITLE`${type}` : UNLINK_TITLE`${type}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {action === 'link' ? LINK_TEXT`${type}` : UNLINK_TEXT`${type}`}
        </DialogContentText>
        <div className={classes.content}>
          <FormControl variant="outlined" error={errors.integrations !== '' || false}>
            <InputLabel ref={inputLabel} id="id-integrations">
              Integrations
            </InputLabel>
            <Select
              multiple
              labelId="id-integrations"
              id="id-integrations"
              name="id-integrations"
              value={selectedItems}
              onChange={handleOnChange}
              labelWidth={labelWidth}
              renderValue={(selected) => integrations.data.filter(i => selected.includes(i.id)).map(i => i.name).join(', ')}
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
                        <Tooltip title="Unauthorized">
                          <CancelIcon />
                        </Tooltip>
                      </ListItemSecondaryAction>
                    ) : (
                      <Tooltip title="Authorized">
                        <CheckCircleIcon style={{ color: '#4caf50' }} />
                      </Tooltip>
                    )}
                  </MenuItem>
                );
              })}
              {id && action === 'unlink' && linkedIntegrations.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  <Checkbox checked={selectedItems.indexOf(option.id) > -1} />
                  <ListItemText primary={option.name} />
                </MenuItem>
              ))}
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
