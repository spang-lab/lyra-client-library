import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, Table } from 'reactstrap';


import {
    IdentifierLink,
    Number,
    useApi,
    GlobalContext,
} from 'lyra-library';

const getRequest = (identifiers, identifierIndex, dataset) => {
    const identifier = identifiers[identifierIndex];

    const options = {
        depth: 1,
        limit: 1000,
        types: ['gene name'],
        identifiersOnly: true,
    };
    const request = {
        path: 'data/interaction',
        identifiers: identifier,
        dataset,
        options,
    };
    return request;
};

const processResponse = (data) => {
    const identifiers = data[0].data;
    const correlated = identifiers
        .filter(id => id.weight > 0)
        .sort((a, b) => b.weight - a.weight)
        .map(id => ({
            ...id,
            correlation: id.weight / 10000,
        })).slice(0, 10);
    return correlated;
};


const CorrelatedIdentifiers = (props) => {
    const { identifiers } = useContext(GlobalContext);
    const { dataset, identifierIndex, name } = props;
    const request = getRequest(identifiers, identifierIndex, dataset);
    const { data, error } = useApi(request, []);
    if (error || !data) {
        return <div />;
    }
    const correlated = processResponse(data);
    return (
        <Card body outline color="info" className="m-3">
            <CardTitle>
                {name}
            </CardTitle>
            <Table size="sm">
                <thead>
                    <tr>
                        <th> Name </th>
                        <th> Correlation </th>
                    </tr>
                </thead>
                <tbody>
                    { correlated.map(id => (
                        <tr key={id.name}>
                            <td>
                                <IdentifierLink identifier={id} lyStyle="small" />
                            </td>
                            <td>
                                <Number v={id.correlation} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
};

CorrelatedIdentifiers.propTypes = {
    identifierIndex: PropTypes.number,
    dataset: PropTypes.string.isRequired,
    name: PropTypes.string,
};

CorrelatedIdentifiers.defaultProps = {
    identifierIndex: 0,
    name: 'Correlated Identifiers',
};


export default CorrelatedIdentifiers;
