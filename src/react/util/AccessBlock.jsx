import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { GlobalContext } from '../context';

const getAccessLevel = (user) => {
    if (!user || !user.groups) {
        return 'public';
    }
    if (user.groups.includes('lyra')) {
        return 'private';
    }
    return 'internal';
};

const isOpen = (access, user) => {
    const mapping = {
        private: 3,
        internal: 2,
        public: 1,
    };
    const requiredAccess = mapping[access] || 4;
    const userAccess = mapping[getAccessLevel(user)] || 0;
    return userAccess >= requiredAccess;
};

const AccessBlock = (props) => {
    const { user } = useContext(GlobalContext);
    if (isOpen(props.access, user)) {
        return props.children;
    }
    return <div />;
};


AccessBlock.propTypes = {
    children: PropTypes.element,
    access: PropTypes.string.isRequired,
};
AccessBlock.defaultProps = {
    children: (<div />),
};


export default AccessBlock;

