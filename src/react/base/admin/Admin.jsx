import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import ControlPanel from './ControlPanel';

const Admin = () => (
    <Container fluid >
        <Row>
            <Col sm={{ size: 10, offset: 1 }} >
                <h3> Controls </h3>
                <ControlPanel />
            </Col>
        </Row>
    </Container>
);


export default Admin;
