import React, { useContext } from 'react';
import {
    ListGroup,
    ListGroupItem,
    Button,
    Container,
    Row,
    Col,
} from 'reactstrap';
import { ChromePicker } from 'react-color';

import { extractColors, colorGenerator } from '../../../lyra';
import PlotContext from '../components/PlotContext';

const renderColor = (obj) => {
    const style = {
        'backgroundColor': colorGenerator.from(obj.color),
    };
    return (
        <ListGroupItem key={obj.label} >
            <Button
                className="mr-3"
                size="sm"
                style={style}
            >
                <span className="px-3" />
            </Button>
            {obj.label}
        </ListGroupItem>
    );
};

const ColorSettings = () => {
    const { plot } = useContext(PlotContext);
    const { schema } = plot;
    if (!schema) {
        return <div />;
    }
    const colors = extractColors(schema);
    return (
        <Container>
            <Row>
                <Col xs="6">
                    Colors:
                    <ListGroup>
                        {colors.map(obj => renderColor(obj))}
                    </ListGroup>
                </Col>
                <Col xs="6">
                    <ChromePicker />
                </Col>
            </Row>
        </Container>
    );
};

export default ColorSettings;
