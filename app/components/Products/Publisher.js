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
import ListItemText from '@material-ui/core/ListItemText';
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
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Publisher(props) {
  const { classes, open, product, integrations, onClose, onGetIntegrations  } = props;


  const [selectedItems, setSelectedItems] = useState([]);
  const [labelWidth] = useState(0);
  const inputLabel = React.useRef(null);

  useEffect(() => {
    if (product && product.integrations) {
      const items = product.integrations.map(item => item.id);
      setSelectedItems(items);
    }
  }, [product, open]);

  useEffect(() => {
    onGetIntegrations({ limit: 100, offset: 0, with_details: true });
  }, [])

  const handleOnChange = (e) => setSelectedItems(e.target.value);

  const handleOnSave = async () => {
    const { onSave } = props;
    const linkedList = selectedItems;
    const unlinkedList = [];
    product.integrations.forEach(element => {
      const index = selectedItems.findIndex(item => item === element.id);
      index === -1 ? unlinkedList.push(element.id) : null;
    });

    onSave({id: product.id, linkedList, unlinkedList});
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Publish</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To publish this product, please check the integrations below.
        </DialogContentText>
        <FormControl variant="outlined" className={classes.inputWidth}>
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
            placeholder="Marked integrations will be publish"
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {integrations.data && integrations.data.map(option => (
              <MenuItem key={option.id} value={option.id} disabled={!option.authorized}>
                <Checkbox checked={selectedItems.indexOf(option.id) > -1} />
                <ListItemText primary={option.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
  integrations: state.getIn(['integration', 'integrations']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch),
});

const PublisherMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Publisher);

Publisher.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  integrations: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
};

export default withStyles(styles)(PublisherMapped);
