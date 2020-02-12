import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import styles from './product-jss';
import FormBuilder from './FormBuilder';
import MySnackBar from '../Common/SnackBar';

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

function Properties(props) {
  const {
    classes, theme, tabList
  } = props;

  const [tabIndex, setTabIndex] = useState(0);
  const _props = tabList[tabIndex].product.properties instanceof Array ? tabList[tabIndex].product.properties : [];
  const [defaultProps, setDefaultProps] = useState(_props);

  const handleChange = (event, index) => {
    setTabIndex(index);
    props.onTabChange(index);
  };

  const handleChangeIndex = index => {
    setTabIndex(index);
  };

  const onPropertyChange = (e) => {
    const { product } = props;
    const { name, value } = e.target;
    const tempProps = defaultProps.map(property => {
      const propItem = property;
      if (property.label === name) {
        propItem.value = value;
      }
      return propItem;
    });
    product.integrations[tabIndex].product.properties = tempProps;
    setDefaultProps(tempProps);
  };

  return (
    tabList && (
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
              {tabList && tabList.map((tab) => (
                <Tab key={tab.id} label={tab.name} />
              ))}
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
                {defaultProps.length > 0 ? (
                  <FormBuilder properties={defaultProps} onChange={onPropertyChange} />
                ) : (
                  <div style={{ marginTop: '10px' }}>
                    <MySnackBar
                      variant="info"
                      customStyle
                      open={defaultProps.length === 0}
                      message="There is not available properties"
                    />
                  </div>
                )}
              </TabContainer>
            ))
            }
          </SwipeableViews>
        </Paper>
      </div>
    )
  );
}

Properties.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  product: state.getIn(['integrations', 'product']),
  ...state
});

const PropertiesMapped = connect(
  mapStateToProps,
  null
)(Properties);

export default withStyles(styles, { withTheme: true })(PropertiesMapped);
