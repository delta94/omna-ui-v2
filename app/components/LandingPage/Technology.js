import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import shopifyLogo from 'dan-images/logo/shopify.png';
import amazonLogo from 'dan-images/logo/amazon.png';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import muiLogo from 'dan-images/logo/mui.png';
import mercadolibreLogo from 'dan-images/logo/mercadolibre.png';
import lazadaLogo from 'dan-images/logo/lazada.png';
import qoo10Logo from 'dan-images/logo/qoo10.png';
import shopeeLogo from 'dan-images/logo/shopee.png';
import odooLogo from 'dan-images/logo/odoo.png';
import Title from './Title';
import styles from './landingStyle-jss';

function ParallaxDeco(props) {
  const { classes } = props;
  return (
    <div className={classes.parallaxWrap}>
      <ParallaxProvider>
        <Parallax
          offsetYMax={180}
          offsetYMin={-200}
          slowerScrollRate
          tag="figure"
        >
          <svg
            fill="#fff"
            className={classNames(
              classes.parallaxVertical,
              classes.parallaxLineSide3
            )}
          >
            <use xlinkHref="/images/decoration/lineSide3.svg#Line-Side3" />
          </svg>
        </Parallax>
        <Parallax
          offsetYMax={100}
          offsetYMin={-200}
          slowerScrollRate
          tag="figure"
        >
          <svg
            fill="#fff"
            className={classNames(
              classes.parallaxVertical,
              classes.parallaxLineSide4
            )}
          >
            <use xlinkHref="/images/decoration/lineSide4.svg#Line-Side4" />
          </svg>
        </Parallax>
      </ParallaxProvider>
    </div>
  );
}

ParallaxDeco.propTypes = {
  classes: PropTypes.object.isRequired
};

const ParallaxDecoStyled = withStyles(styles)(ParallaxDeco);

class Technology extends React.Component {
  render() {
    const { classes, slideMode } = this.props;
    return (
      <div className={classes.tech}>
        {!slideMode && <ParallaxDecoStyled />}
        <div className={slideMode ? classes.fullWidth : classes.container}>
          <Title
            title="Channels and integrations "
            desc="Popular Marketplaces, Storefronts, ERP, 3PL, Accounting and more"
            align="center"
            monocolor={slideMode && true}
          />
          <Grid container className={classes.root} spacing={10}>
            <Grid item md={3} xs={12}>
              <div>
                <img src={shopifyLogo} alt="shopify" />
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div>
                <img src={amazonLogo} alt="amazon" />
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div>
                <img src={mercadolibreLogo} alt="mercadolibre" />
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div>
                <img src={lazadaLogo} alt="lazada" />
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div>
                <img src={qoo10Logo} alt="qoo10" />
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div className={classNames(slideMode && classes.slideMode)}>
                <img src={shopeeLogo} alt="shopee" />
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div className={classNames(slideMode && classes.slideMode)}>
                <img src={qoo10Logo} alt="jss" />
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div className={classNames(slideMode && classes.slideMode)}>
                <img src={odooLogo} alt="odoo" />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Technology.propTypes = {
  classes: PropTypes.object.isRequired,
  slideMode: PropTypes.bool
};

Technology.defaultProps = {
  slideMode: false
};

export default withStyles(styles)(Technology);
