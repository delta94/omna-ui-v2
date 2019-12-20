import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import MySnackBar from '../Common/SnackBar';
import SideVariantlist from './SideVariantList';

function Variants(props) {
  const { variants } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onItemClick = (index) => { setSelectedIndex(index); };

  return (
    <Fragment>
      <Typography variant="subtitle2">
        Variants
      </Typography>
      {variants.size === 0 && (
        <div style={{ marginTop: '10px' }}>
          <MySnackBar
            variant="info"
            customStyle
            open={variants.size === 0 || false}
            message="There are not available variants"
          />
        </div>

      )}
      {variants && variants.map(({
        id, sku, price, quantity, images
      }, index) => (
        <SideVariantlist
          key={id}
          index={index}
          selectedIndex={selectedIndex}
          sku={sku}
          price={price}
          images={images}
          quantity={quantity}
          onClick={() => onItemClick(index)}
        />
      ))}
    </Fragment>
  );
}

Variants.propTypes = {
  variants: PropTypes.object.isRequired
};

export default Variants;