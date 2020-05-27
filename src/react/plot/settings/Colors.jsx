import React from 'react';
import PropTypes from 'prop-types';
import {
    ListGroup,
    ListGroupItem,
    Badge,
} from 'reactstrap';

const Colors = props => (
    <div>
        <h4>Colors</h4>
        <ListGroup>
            {props.colors.map(obj => (
                <ListGroupItem key={obj.label} >
                    <Badge pill >
                        {obj.color}
                    </Badge>
                </ListGroupItem>
            ))}
        </ListGroup>
    </div>
);

Colors.propTypes = {
    colors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Colors;
