
import React from 'react';
import PropTypes from 'prop-types';

const Spinner = props => (
    <div className="text-center">
        Loading...
    </div>
);

Spinner.propTypes = {
    size: PropTypes.number,
};
Spinner.defaultProps = {
    size: 24,
};

export default Spinner;
