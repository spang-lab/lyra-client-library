import React from 'react';
import PropTypes from 'prop-types';


const Number = props => (
    <span className="number">
        { Math.round(props.v * 1000) / 1000 }
    </span>
);

Number.propTypes = {
    v: PropTypes.number.isRequired,
};

export default Number;

