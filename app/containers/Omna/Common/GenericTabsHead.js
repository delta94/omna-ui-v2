import React from 'react';
import PropTypes from 'prop-types';

/* material-ui */
// core
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


class GenericTabsHead extends React.Component {

  render() {
    const { tabHeaders, value, onChange } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={onChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {tabHeaders && tabHeaders.map(tab => (
              <Tab label={tab.label} key={tab.key} />
            ))}
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

GenericTabsHead.propTypes = {
  value: PropTypes.number.isRequired,
  tabHeaders: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default GenericTabsHead;