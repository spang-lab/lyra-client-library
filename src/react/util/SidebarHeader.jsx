import React from 'react';
import PropTypes from 'prop-types';

import {
    NavItem,
    NavLink,
} from 'reactstrap';

const SidebarHeader = (props) => {
    const { children } = props;
    return (
        <NavItem>
            <NavLink disabled href="#">
                <h6>
                    {children}
                </h6>
            </NavLink>
        </NavItem>
    );
};

SidebarHeader.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};
SidebarHeader.defaultProps = {
    children: '',
};
export default SidebarHeader;
