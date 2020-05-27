import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Alert } from 'reactstrap';

const createErrorAlert = (error) => {
    if (process.env.NODE_ENV === 'production') {
        return (
            <Alert color="primary" key={error.message}>
                Can not display this plot
            </Alert>
        );
    }
    return (
        <Alert color="danger" key={error.message}>
            <strong>Error ({error.name}): </strong>
            {error.message}
        </Alert>
    );
};
const PlotErrors = (props) => {
    const { plot } = props;
    if (!plot) {
        return '';
    }
    const { errors } = props.plot;
    if (!errors) {
        return '';
    }
    return (
        <Container fluid >
            <Row>
                <Col sm={{ size: 10, offset: 1 }} >
                    {errors.map(e => createErrorAlert(e))}
                </Col>
            </Row>
        </Container>
    );
};


PlotErrors.propTypes = {
    plot: PropTypes.shape({
        errors: PropTypes.arrayOf(PropTypes.object),
    }),
};
PlotErrors.defaultProps = {
    plot: null,
};


export default PlotErrors;
