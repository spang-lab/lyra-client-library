import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    NavItem,
    NavLink,
} from 'reactstrap';

import { SidebarContext } from '../context';

const SidebarItem = (props) => {
    const activePane = useContext(SidebarContext);
    const { name, label } = props;
    const isActive = name === activePane;
    const color = (isActive) ? 'text-white' : '';
    return (
        <NavItem>
            <NavLink
                active={isActive}
                tag="span"
            >
                <Link
                    to={name}
                    className={color}
                >
                    {label}
                </Link>
            </NavLink>
        </NavItem>
    );
};

SidebarItem.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
export default SidebarItem;
