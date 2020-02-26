import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from 'react-slick';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import NumberFormat from 'react-number-format';

import { Rating } from 'dan-components';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
// import styles from 'dan-components/Product/product-jss';
import RichEditor from './RichEditor';
import styles from './product-jss';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

function ProductInfo(props) {
  const {
    name, rating, thumbnail, description, price, variants, editable, classes
  } = props;

  const settings = {
    customPaging: (i) => (
      <a>
        <img src={thumbnail[i]} alt="thumb" />
      </a>
    ),
    infinite: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleNameChange = event => props.onNameChange(event.target.value);
  const handlePriceChange = event => props.onPriceChange(parseFloat(event.target.value));
  const handleDescriptionChange = event => props.onDescriptionChange(event.target.value);

  return (
    <div>
      <Paper className={classes.rootDetail} elevation={0}>
        <Grid container className={classes.root} spacing={2}>
          <Grid item md={4} sm={12} xs={12}>
            <aside className={classes.imgGallery}>
              {!editable && <Typography noWrap gutterBottom variant="h5" component="h2">{name}</Typography>}
              {rating && <Rating value={4} max={5} readOnly />}
              <div className="container thumb-nav">
                <Slider {...settings}>
                  {thumbnail.map((item, index) => {
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
              </div>
            </aside>
          </Grid>
          <Grid item md={8} sm={12} xs={12}>
            <section className={classes.detailWrap}>
              <div className={classes.price}>
                {editable ? (
                  <Fragment>
                    <TextField
                      id="product-name-id"
                      label="Name"
                      value={name}
                      onChange={handleNameChange}
                      required
                      variant="outlined"
                      style={{ flexGrow: '2', margin: '5px 5px 5px 0px' }}
                    />
                    <TextField
                      className={classes.formControl}
                      label="Price"
                      value={price}
                      onChange={handlePriceChange}
                      variant="outlined"
                      id="formatted-numberformat-input"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      style={{ margin: '5px 5px 5px 0px' }}
                    />
                  </Fragment>
                )
                  : (
                    <Typography variant="h5">
                      <span>
                        $
                        {price}
                      </span>
                    </Typography>
                  )}
              </div>
              <RichEditor text={description} onTextEditorChange={handleDescriptionChange} />
              {variants !== 0 && (
                <div className={classes.btnArea}>
                  <span className={classes.variant}>
                    <Typography variant="h6">
                      variants:
                    </Typography>
                    <p>{variants}</p>
                  </span>
                </div>
              )}
            </section>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

ProductInfo.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  variants: PropTypes.number,
  thumbnail: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  rating: PropTypes.number,
  editable: PropTypes.bool,
  onNameChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
};

ProductInfo.defaultProps = {
  variants: 0,
  editable: true,
  rating: null
};

export default withStyles(styles)(ProductInfo);
