import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Typography } from '@material-ui/core';

const ElementPlusValuePrinter = ({
  element,
  value,
  elementVariant,
  elementColor,
  valueVariant,
  valueColor
}) => {
  return (
    <div className="display-flex align-items-baseline">
      <div>
        <Typography variant={elementVariant} color={elementColor}>
          {`${element}:`}
        </Typography>
      </div>
      <div className="item-margin-left">
        <Typography variant={valueVariant} color={valueColor}>
          {value != null
            ? moment(value.created_at).format('Y-MM-DD H:mm:ss')
            : '--'}
        </Typography>
      </div>
    </div>
  );
};

ElementPlusValuePrinter.propTypes = {
  element: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  elementVariant: PropTypes.string.isRequired,
  elementColor: PropTypes.string.isRequired,
  valueVariant: PropTypes.string.isRequired,
  valueColor: PropTypes.string.isRequired
};

export default ElementPlusValuePrinter;
