import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from 'react-slick';
import styles from './product-jss';

function Carousel({ classes, images }) {

  const settings = {
    customPaging: (i) => (
      <a>
        <img src={images[i]} alt="thumb" />
      </a>
    ),
    infinite: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <aside className={classes.imgGallery}>
      <div className="container thumb-nav">
        {images.length > 0 ? (
          <Slider {...settings}>
            {images.map((item, index) => {
              if (index > 4) {
                return false;
              }
              return (
                <div key={index.toString()} className={classes.item}>
                  <img src={item} alt={`thumb${index}`} height="500" width="450" />
                </div>
              );
            })}
          </Slider>
        ) : <div className={classes.item}><img src="/images/image_placeholder.png" alt="thumb" height="400" width="350" /></div>}
      </div>
    </aside>
  );
};

Carousel.propTypes = {
  images: PropTypes.array,
  classes: PropTypes.object.isRequired,
};

Carousel.defaultProps = {
  images: []
};

export default withStyles(styles)(Carousel);
