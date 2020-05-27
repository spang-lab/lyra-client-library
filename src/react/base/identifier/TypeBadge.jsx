import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';


const TypeBadge = (props) => {
    const { type } = props.identifier;
    const color = '#41b6d3';
    return (
        <Badge
            style={{
                backgroundColor: color,
            }}
        >
            {type}
        </Badge>
    );
};

TypeBadge.propTypes = {
    identifier: PropTypes.shape({
        type: PropTypes.string.isRequired,
    }).isRequired,
};

export default TypeBadge;

