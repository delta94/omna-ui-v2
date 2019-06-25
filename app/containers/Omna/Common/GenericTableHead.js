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
        const { handleClick, numSelected, rowCount, headColumns, selectOption } = this.props;

        return (
            <TableHead>
                <TableRow>
                    {
                        <TableCell padding={selectOption}>
                            {
                                (selectOption === "checkbox") ?
                                    <Checkbox
                                        indeterminate={numSelected > 0 && numSelected < rowCount}
                                        checked={numSelected === rowCount}
                                        onChange={handleClick}
                                    /> :
                                        (selectOption === "radio") ?
                                            <Radio
                                                checked={numSelected === rowCount}
                                                onChange={handleClick}
                                                value={rowCount}
                                                name={selectOption}
                                                aria-label={selectOption}
                                            /> :
                                                null
                            }
                            
                        </TableCell>
                    }
                    
                    {
                        headColumns.map(row => (
                            <TableCell
                                key={row.id}
                                align={row.header ? 'center' : 'left'}
                                padding={row.disablePadding ? 'none' : 'default'}
                            >
                                {row.label}
                            </TableCell>
                        ))
                    }
                </TableRow>
            </TableHead>
        );
    }
};

GenericTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    handleClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
    headColumns: PropTypes.array.isRequired,
    selectOption: PropTypes.string.isRequired,
};

export default (GenericTableHead);