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

const LINK_TITLE = 'Link products';
const UNLINK_TITLE = 'Unlink products';
const LINK_TEXT = 'To link these products check one of the integrations below';
const UNLINK_TEXT = 'To unlink these products check one of the integrations below';

function BulkLinker(props) {
  const { classes, action, open, integrations, onClose, fromShopifyApp, onGetIntegrations } = props;


  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteFromIntegration, setDeleteFromIntegration] = useState(false);
  const [errors, setErrors] = useState({
    integrations: '',
    delete: ''
  });
  const [labelWidth] = useState(0);
  const inputLabel = React.useRef(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    action === 'link' ? onGetIntegrations({ limit: 100, offset: 0, with_details: true }) : null;
  }, []);

  const clearForm = () => {
    setSelectedItems([]);
    setDirty(false);
    setErrors((prevState) => ({ ...prevState, integrations: '' }));
  };

  useEffect(() => {
    clearForm();
  }, [open]);

  const validForm = () => {
    let valid = true;
    Object.keys(errors).forEach((key) => {
      errors[key] !== '' ? valid = false : null;
    });
    return valid;
  };

  const checkValidity = () => {
    if (fromShopifyApp && selectedItems.length > 0) {
      let i = 0;
      let found = false;
      const shopifyItem = integrations.data.find(item => item.channel === 'Ov2Shopify');
      while (i < selectedItems.length && !found) {
        if (selectedItems[i] === shopifyItem.id) {
          found = true;
        }
        i += 1;
      };
        if (found) {
          setErrors((prevState) => ({ ...prevState, integrations: 'Shopify integration can not be unlinked' }));
        } else
          setErrors((prevState) => ({ ...prevState, integrations: '' }));
      }

    if ((dirty || deleteFromIntegration) && selectedItems.length === 0) {
      setErrors((prevState) => ({ ...prevState, integrations: 'You have to check some integration' }));
    }
  }

  useEffect(() => {
    checkValidity();
  }, [deleteFromIntegration, selectedItems]);

  const handleOnChange = e => {
    setSelectedItems(e.target.value);
    setDirty(true);
  };

  const handleDeleteChange = e => setDeleteFromIntegration(e.target.checked);

  const handleOnSave = async () => {
    props.onSave({ integrationIds: selectedItems, deleteFromIntegration });
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{action === 'link' ? LINK_TITLE : UNLINK_TITLE}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {action === 'link' ? LINK_TEXT : UNLINK_TEXT}
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
              renderValue={selected => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {integrations.data.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    <Checkbox checked={selectedItems.indexOf(option.id) > -1} />
                    <ListItemText primary={option.name} />
                    {!option.authorized ? (
                      <ListItemSecondaryAction>
                        <Chip label="unauthorized" color="default" />
                      </ListItemSecondaryAction>
                    ) : null}
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

const BulkLinkerMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(BulkLinker);

BulkLinker.defaultProps = {
  action: 'link',
  fromShopifyApp: undefined
};

BulkLinker.propTypes = {
  action: PropTypes.string,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  fromShopifyApp: PropTypes.bool,
  integrations: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired
};

export default withStyles(styles)(BulkLinkerMapped);
