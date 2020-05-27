import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import IdentifierList from './IdentifierList';
import InfoBox from './InfoBox';
import { GlobalContext } from '../../context';
import { ErrorAlert, Spinner } from '../../util';
import { useApi } from '../../hooks';

const StringIdentifiers = (props) => {
    const { identifierIndex, dataset } = props;
    const { identifiers } = useContext(GlobalContext);
    const identifier = identifiers[identifierIndex];
    const request = {
        path: 'data/interaction',
        identifiers: identifier,
        dataset,
        options: {
            identifiersOnly: true,
            limit: 15,
        },
    };
    const { data, error } = useApi(request);
    if (error) {
        return <ErrorAlert message={error} />;
    }
    if (!data) {
        return <Spinner />;
    }
    const idList = data.data;
    return (
        <InfoBox title="Related Genes in String">
            <IdentifierList
                identifiers={idList}
                columns={3}
            />
        </InfoBox>
    );
};

StringIdentifiers.propTypes = {
    identifierIndex: PropTypes.number,
    dataset: PropTypes.string.isRequired,
};
StringIdentifiers.defaultProps = {
    identifierIndex: 0,
};


export default StringIdentifiers;
