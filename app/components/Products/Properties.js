import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Alert from 'dan-components/Notification/Alert';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import FormBuilder from './FormBuilder';
import styles from './product-jss';

const UNSAVED_CHANGES = 'You have unsaved changes. Are you sure you want to move to the next integration?';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node,
  dir: PropTypes.string.isRequired,
};

TabContainer.defaultProps = {
  children: null,
};

const Properties = memo((props) => {
  const { classes, theme, tabList, dirtyProps, onChangeProps } = props;

  const [tabIndex, setTabIndex] = useState(0);
  const [prevTabIndex, setPrevTabIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [properties, setProperties] = useState(tabList[tabIndex].product.properties);
  const { errors } = tabList[tabIndex].product;

  const changeTab = (index) => {
    setTabIndex(index);
    setProperties(tabList[index].product.properties)
    props.onTabChange(tabList ? tabList[index] : null);
  };

  const handleChange = (event, index) => {
    if (dirtyProps) {
      setPrevTabIndex(index);
      setOpenDialog(true);
    } else {
      changeTab(index);
    }
  };

  const handleChangeIndex = index => setTabIndex(index);

  const handleDialogCancel = () => setOpenDialog(false);

  const handleDialogConfirm = () => {
    changeTab(prevTabIndex);
    onChangeProps(false);
    setOpenDialog(false);
  };

  // handlePropertyChange to use in the future if the api makes changes on the properties
  /*   const handlePropertyChange = (e) => {
      const { name, value } = e.target;
      const index = properties.findIndex(item => item.id === name);
      if(index >= 0) {
        const property = properties[index];
          property.value = value;
          delete properties[index];
          properties.splice(index, 1, property);
          setProperties([...properties]);
        }
      }; */

  const handlePropertyChange = (e) => {
    onChangeProps(true);
    const { name, value } = e.target;
    const index = properties.findIndex(item => item.id === name);
    if (index >= 0) {
      const property = properties[index];
      if (property.input_type !== 'single_select_with_remote_options') {
        property.value = value;
      } else {
        property.value = value.id;
        property.options = [value];
      }
      delete properties[index];
      properties.splice(index, 1, property);
      setProperties([...properties]);
    }
  };

  return (
    <div>
      <Paper className={classes.rootDesc} elevation={0}>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
          {tabList.map((tab) => <Tab key={tab.id} label={tab.name} />)}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabIndex}
          onChangeIndex={handleChangeIndex}
        >
          {tabList && tabList.map(({ product }) => (
            <TabContainer key={product.remote_product_id} dir={theme.direction}>
              <Typography variant="subtitle2" gutterBottom>
                Properties
              </Typography>
              {(properties && !errors) && properties.length > 0 ? (
                <FormBuilder properties={properties} onChange={handlePropertyChange} />
              ) : (
                  <Alert variant="error" message={errors} />
                )}
            </TabContainer>
          ))
          }
        </SwipeableViews>
      </Paper>
      <AlertDialog
        open={openDialog}
        message={UNSAVED_CHANGES}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
        confirmButtonLabel="Yes"
        cancelButtonLabel="No"
      />
    </div>
  );
});

Properties.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  dirtyProps: PropTypes.bool.isRequired,
  tabList: PropTypes.array,
  onTabChange: PropTypes.func.isRequired,
  onChangeProps: PropTypes.func.isRequired
};

Properties.defaultProps = {
  tabList: []
};

export default withStyles(styles, { withTheme: true })(Properties);
