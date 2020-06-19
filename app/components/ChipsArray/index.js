import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  }
}));

function getChips(items, max) {
  if (items.length > 0) {
    const list = items.slice(0, max).map(item => item.name || item);
    const remaining = items.length - max;
    remaining > 0 ? list.push(`+${remaining} more`) : null;
    return list;
  }
  return [];
};

function ChipsArray(props) {
  const { items, max } = props;
  const classes = useStyles();
  const chips = getChips(items, max);

  return (
    <div component="ul" className={classes.root}>
      {chips.map((item, index) => {
        return (
          <li key={`${item}-${index.toString()}`}>
            <Chip
              color="default"
              label={item}
              className={classes.chip}
            />
          </li>
        );
      })}
    </div>
  );
};

ChipsArray.propTypes = {
  items: PropTypes.array,
  max: PropTypes.number
};

ChipsArray.defaultProps = {
  items: [],
  max: 2
};

export default ChipsArray;
