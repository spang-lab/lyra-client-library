import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

import { prettyPrint, toSingle } from '../../../lyra';
import { ErrorAlert, Spinner } from '../../util';
import InfoBox from './InfoBox';
import { GlobalContext } from '../../context';
import { useApi } from '../../hooks';

const NcbiInfo = (props) => {
    const { identifierIndex, parameters } = props;
    const { identifiers } = useContext(GlobalContext);
    const identifier = identifiers[identifierIndex];
    const request = {
        path: 'data/ncbi',
        identifiers: identifier,
        ...parameters,
    };
    const { data, error } = useApi(request);
    if (error) {
        return (
            <ErrorAlert message={data.error} />
        );
    }
    if (!data) {
        return <Spinner />;
    }
    const info = toSingle(data);
    return (
        <InfoBox title="Ncbi Info">
            <Table>
                <thead />
                <tbody>
                    {Object.keys(info).map(key => (
                        <tr key={key}>
                            <td>
                                {prettyPrint(key)}
                            </td>
                            <td>
                                {info[key]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </InfoBox>
    );
};


NcbiInfo.propTypes = {
    parameters: PropTypes.shape({
        species: PropTypes.string.isRequired,
    }).isRequired,
    // optional index to explicitly set the identifier
    identifierIndex: PropTypes.number,
};

NcbiInfo.defaultProps = {
    identifierIndex: 0,
};


export default NcbiInfo;

