import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

import { ErrorAlert } from '../../util';
import { prettyPrint } from '../../../lyra';
import { GlobalContext } from '../../context';
import InfoBox from './InfoBox';


const getTable = (ident) => {
    const keys = ['id', 'name', 'type'];
    return (
        <Table>
            <thead />
            <tbody>
                {keys.map(key => (
                    <tr key={key} >
                        <td> {prettyPrint(key)} </td>
                        <td> {ident[key]} </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

const IdentifierInfo = (props) => {
    const { identifiers } = useContext(GlobalContext);
    const identifier = identifiers[props.identifierIndex];
    if (!identifier) {
        const err = {
            path: 'none',
            error: 'Could not find Identifier Information',
        };
        return (
            <ErrorAlert error={err} />
        );
    }


    return (
        <InfoBox title={`Identifier ${identifier.name}`}>
            {getTable(identifier)}
        </InfoBox>
    );
};


IdentifierInfo.propTypes = {
    // optional index to explicitly set the identifier
    identifierIndex: PropTypes.number,
};
IdentifierInfo.defaultProps = {
    identifierIndex: 0,
};


export default IdentifierInfo;

