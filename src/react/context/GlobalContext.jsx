import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { matchPath, useHistory, useLocation } from 'react-router';
import { apiRequest } from '../../lyra';

export const GlobalContext = React.createContext({});


const getPane = (path) => {
    const match = matchPath(path, {
        path: '/r/:token/:selectKey',
    });
    if (match && match.params.selectKey) {
        return match.params.selectKey;
    }
    return 'info';
};

export const GlobalState = (props) => {
    const [identifiers, setIdentifiers] = useState([]);
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState({});
    const { children } = props;
    const history = useHistory();
    const location = useLocation();


    const changeIdentifiers = async (newIdentifiers) => {
        const response = await apiRequest({
            path: 'search/id',
            identifiers: newIdentifiers,
        });
        const { data } = response;
        const pane = getPane(location.pathname);
        setIdentifiers(data.data);
        history.push(`/r/${data.token}/${pane}`);
    };

    const getIdentifiers = async (token) => {
        if (identifiers.length) {
            return;
        }
        const response = await apiRequest({
            path: 'search/token',
            token,
        });
        const { data } = response;
        setIdentifiers(data.data);
    };

    const getUser = async () => {
        if (user) {
            return;
        }
        const response = await apiRequest({
            path: 'user/info',
        });
        const { data } = response;
        setUser(data);
    };

    return (
        <GlobalContext.Provider
            value={{
                identifiers,
                changeIdentifiers,
                getIdentifiers,
                user,
                getUser,
                modal,
                setModal,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

GlobalState.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

