/* eslint-disable react/jsx-no-duplicate-props */
import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { PapperBlock } from 'dan-components';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import NumberFormatCustom from 'dan-components/NumberFormatCustom';

const styles = theme => ({
  dimensionItems: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dimensionContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1)
  },
  paperBlockContainer: {
    marginTop: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(1, 1, 3, 0)
  },
  formControl: {
    width: '100%'
  },
});

const Body = (props) => {
  const {
    weight, height, length, width, content, overwrite = false, overwriteOption = false, classes,
    onDimensionChange, onContentChange, onOverwriteChange
  } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          className={classes.formControl}
          label="Weight"
          name="weight"
          value={weight}
          onChange={onDimensionChange}
          variant="outlined"
          id="weight-numberformat-input"
          inputProps={{
            prefix: 'kg '
          }}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          className={classes.formControl}
          label="Height"
          name="height"
          value={height}
          onChange={onDimensionChange}
          variant="outlined"
          id="height-numberformat-input"
          inputProps={{
            prefix: 'cm '
          }}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          className={classes.formControl}
          label="Width"
          name="width"
          value={width}
          onChange={onDimensionChange}
          variant="outlined"
          id="width-numberformat-input"
          inputProps={{
            prefix: 'cm '
          }}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          className={classes.formControl}
          label="Length"
          name="length"
          value={length}
          onChange={onDimensionChange}
          variant="outlined"
          id="length-numberformat-input"
          inputProps={{
            prefix: 'cm '
          }}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          className={classes.formControl}
          label="Content"
          name="content"
          value={content}
          onChange={onContentChange}
          variant="outlined"
          id="content-input"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {overwriteOption && (
          <FormControlLabel
            className={classes.formControl}
            control={
              (
                <Checkbox
                  id="overwrite-input"
                  name="overwrite"
                  checked={overwrite}
                  onChange={onOverwriteChange}
                  value="overwrite"
                  color="default"
                />
              )
            }
            label="overwrite package information in all variants"
          />
        )}
      </Grid>
    </Grid>
  );
};

const DimensionProps = memo((props) => {
  const {
    weight, height, length, width, content, overwrite = false, overwriteOption = false, classes,
    onDimensionChange, unmountPaper
  } = props;

  const handleOverwriteChange = (e) => onDimensionChange({ target: { name: e.target.name, value: e.target.checked } });

  const handleContentChange = (e) => onDimensionChange({ target: { name: e.target.name, value: e.target.value } });

  return (
    <Fragment>
      {!unmountPaper ? (
        <div className={classes.paperBlockContainer}>
          <PapperBlock title="Package" icon="ios-card" desc="Package dimensions and content">
            <Body
              weight={weight}
              height={height}
              length={length}
              width={width}
              content={content}
              overwrite={overwrite}
              overwriteOption={overwriteOption}
              classes={classes}
              onDimensionChange={onDimensionChange}
              onContentChange={handleContentChange}
              onOverwriteChange={handleOverwriteChange}
            />
          </PapperBlock>
        </div>
      ) : (
        <Paper className={classes.dimensionContainer} elevation={1}>
          <Typography className={classes.title} component="div" gutterBottom>
            <Box fontSize="h6.fontSize" m={1} fontWeight="fontWeightRegular">
              Package
            </Box>
          </Typography>
          <Body
            weight={weight}
            height={height}
            length={length}
            width={width}
            content={content}
            overwrite={overwrite}
            overwriteOption={overwriteOption}
            classes={classes}
            onDimensionChange={onDimensionChange}
            onContentChange={handleContentChange}
            onOverwriteChange={handleOverwriteChange}
          />
        </Paper>
      )}
    </Fragment>
  );
});

Body.propTypes = {
  weight: PropTypes.number,
  height: PropTypes.number,
  length: PropTypes.number,
  width: PropTypes.number,
  overwrite: PropTypes.bool,
  overwriteOption: PropTypes.bool,
  content: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onContentChange: PropTypes.func.isRequired,
  onOverwriteChange: PropTypes.func.isRequired,
  onDimensionChange: PropTypes.func.isRequired
};

Body.defaultProps = {
  weight: undefined,
  height: undefined,
  length: undefined,
  width: undefined,
  content: '',
  overwrite: false,
  overwriteOption: false,
};

DimensionProps.propTypes = {
  weight: PropTypes.number,
  height: PropTypes.number,
  length: PropTypes.number,
  width: PropTypes.number,
  overwrite: PropTypes.bool,
  overwriteOption: PropTypes.bool,
  content: PropTypes.string,
  classes: PropTypes.object.isRequired,
  unmountPaper: PropTypes.bool,
  onDimensionChange: PropTypes.func.isRequired
};

DimensionProps.defaultProps = {
  weight: undefined,
  height: undefined,
  length: undefined,
  width: undefined,
  content: '',
  overwrite: false,
  overwriteOption: false,
  unmountPaper: false
};

export default withStyles(styles)(DimensionProps);
