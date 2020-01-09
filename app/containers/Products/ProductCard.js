import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import styles from './cardStyle-jss';

class ProductCard extends React.Component {
  render() {
    const {
      classes,
      thumbnail,
      name,
      variants,
      price,
      list,
      detailOpen,
      width,
    } = this.props;
    return (
      <Card className={classNames(classes.cardProduct, isWidthUp('sm', width) && list ? classes.cardList : '')}>
        <CardMedia
          className={classes.mediaProduct}
          image={thumbnail}
          title={name}
        />
        <CardContent className={classes.floatingButtonWrap}>
          <Tooltip title="Add to cart" placement="top">
            <Button size="small" variant="outlined" color="secondary" onClick={detailOpen} className={classes.buttonAdd}>
              See More
            </Button>
          </Tooltip>
          <Typography noWrap gutterBottom variant="h5" className={classes.title} component="h2">
            {name}
          </Typography>
          <div className={classes.price}>
            <Typography component="h2">
              Price:
            </Typography>
            <Typography variant="h6">
              <span>
                $
                {price}
              </span>
            </Typography>
          </div>
          <div className={classes.variants}>
            <Typography component="h2">
              Variants:
            </Typography>
            <Typography variant="h6">
              {variants}
            </Typography>
          </div>
        </CardContent>
        {isWidthUp('sm', width) && (
          <CardActions>
            <div className={classes.rightAction}>
              <Button size="small" variant="outlined" color="secondary" onClick={detailOpen}>
                See More
              </Button>
            </div>
          </CardActions>
        )}
      </Card>
    );
  }
}

ProductCard.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  variants: PropTypes.number.isRequired,
  list: PropTypes.bool,
  detailOpen: PropTypes.func,
};

ProductCard.defaultProps = {
  list: false,
  detailOpen: () => (false),
  addToCart: () => (false),
};

const ProductCardResponsive = withWidth()(ProductCard);
export default withStyles(styles)(ProductCardResponsive);
