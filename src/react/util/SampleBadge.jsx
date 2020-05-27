import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';


const SampleBadge = props => (
    <Badge color="light" pill >
        { props.sample.name }
    </Badge>
);

SampleBadge.propTypes = {
    sample: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
};

export default SampleBadge;

