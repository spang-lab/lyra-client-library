import React, { useContext } from 'react';
import IdentifierList from './IdentifierList';
import { GlobalContext } from '../../context';
import { useApi } from '../../hooks';
import { Spinner, ErrorAlert } from '../../util';

const SearchHistory = () => {
    const { user } = useContext(GlobalContext);
    const request = {
        path: '/search/history',
        user,
    };
    // unimplemented
    return '';
    const { data, error } = useApi(request);
    if (error) {
        return <ErrorAlert message={error} />;
    }
    if (!data) {
        return <Spinner />;
    }
    console.log(data);
    return (
        <IdentifierList
            columns={1}
            identifiers={data}
        />
    );
};

export default SearchHistory;

