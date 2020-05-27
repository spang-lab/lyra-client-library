import React, { useContext } from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import PlotContext from './PlotContext';

const createErrorAlert = error => (
    <Alert color="danger" key={error.message}>
        <strong>Error ({error.name}): </strong>
        {error.message}
    </Alert>
);

const PlotErrors = () => {
    const { plot } = useContext(PlotContext);
    const { errors } = plot;
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


export default PlotErrors;
