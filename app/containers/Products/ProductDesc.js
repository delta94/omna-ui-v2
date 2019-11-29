import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import styles from 'dan-components/Product/product-jss';
import Properties from './Properties';
import Variants from './Variants';
import { getProductVariantList, setProductProperties } from '../../actions/IntegrationActions';

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

function ProductDesc(props) {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    classes, theme, variants, tabList, updateProperties
  } = props;

  const handleChange = (event, index) => {
    const { updateProductVariants } = props;
    const { id, product: _product } = tabList[index];
    setTabIndex(index);
    updateProductVariants(id, _product.remote_product_id);
  };

  const handleChangeIndex = index => {
    setTabIndex(index);
  };

  const onPropertyChange = (_props) => {
    updateProperties(tabIndex, _props);
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
            {tabList && tabList.map(({ product }) => {
              let properties = product ? product.properties : null;
              properties = properties instanceof Array ? properties : null;
              return (
                <TabContainer key={product.remote_product_id} dir={theme.direction}>
                  <Grid>
                    {properties && <Properties classes={classes} properties={properties} onPropertyChange={onPropertyChange} />}
                  </Grid>
                  <Grid>
                    <Variants variants={variants} />
                  </Grid>
                </TabContainer>
              );
            })}
          </SwipeableViews>
        </Paper>
      </div>
    )
  );
}

ProductDesc.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch),
  updateProperties: bindActionCreators(setProductProperties, dispatch)
});

const ProductDescMapped = connect(
  null,
  mapDispatchToProps
)(ProductDesc);

export default withStyles(styles, { withTheme: true })(ProductDescMapped);
