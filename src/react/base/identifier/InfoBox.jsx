
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'reactstrap';

const renderTitle = (title) => {
    if (!title) {
        return '';
    }
    return (
        <CardTitle tag="h5" >
            {title}
        </CardTitle>
    );
};

const InfoBox = props => (
    <Card outline body color="info" className="m-2" >
        {renderTitle(props.title)}
        {props.children}
    </Card>
);

InfoBox.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
};
InfoBox.defaultProps = {
    title: null,
    children: '',
};

export default InfoBox;
