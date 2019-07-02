import React from 'react';
import PropTypes from 'prop-types';

/* material-ui */
// core
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';


class GenericTableHead extends React.Component {
  render() {
    const {
      handleClick,
      numSelected,
      rowCount,
      headColumns,
      selectOption
    } = this.props;
    return (
      selectOption !== '' ? (
        <TableHead>
          <TableRow>
            <TableCell padding={selectOption}>
              {
                (selectOption === 'checkbox') ? (
                  <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected === rowCount}
                    onChange={handleClick}
                  />
                ) : (
                  (selectOption === 'radio') ? (
                    <Radio
                      color="primary"
                      checked={numSelected === rowCount}
                      onChange={handleClick}
                      value={rowCount}
                      name={selectOption}
                      aria-label={selectOption}
                    />
                  ) : (
                    null
                  )
                )
              }

            </TableCell>
            {headColumns.map(row => (
              <TableCell
                key={row.id}
                align={row.first ? 'left' : row.last ? 'right' : 'center'}
                padding="default"
              >
                {row.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      ) : (
        <TableHead>
          <TableRow>
            {headColumns.map(row => (
              <TableCell
                key={row.id}
                align={row.first ? 'left' : row.last ? 'right' : 'center'}
                padding="default"
              >
                {row.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )
    );
  }
}

GenericTableHead.propTypes = {
  numSelected: PropTypes.number,
  handleClick: PropTypes.func,
  rowCount: PropTypes.number.isRequired,
  headColumns: PropTypes.array.isRequired,
  selectOption: PropTypes.string,
};
GenericTableHead.defaultProps = {
  handleClick: () => { },
  numSelected: 0,
  selectOption: '',
};

export default (GenericTableHead);
