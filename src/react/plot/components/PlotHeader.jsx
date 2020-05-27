import React, { useContext } from 'react';
import {
    Card,
    Button,
    Container,
    Row,
    Col,
    ButtonGroup,
} from 'reactstrap';

import PlotContext from './PlotContext';


const getName = (schema) => {
    if (!schema || !schema.info) {
        return '';
    }
    return schema.info.displayName;
};

const getIdentifiers = (init) => {
    if (!init) {
        return '';
    }
    const identifiers = init.identifiers || [];
    return identifiers
        .map(id => id.name)
        .join(', ');
};

const isHidden = (schema) => {
    if (!schema || !schema.layout) {
        return true;
    }
    const { header } = schema.layout;
    return header === false;
};

const hasError = (errors) => {
    if (!errors) {
        return true;
    }
    return errors.length > 0;
};


const PlotHeader = () => {
    const { plot, savePlot, toggleSettings } = useContext(PlotContext);
    const {
        schema,
        errors,
        init,
    } = plot;
    const hidden = isHidden(schema);
    if (hidden) {
        return <div />;
    }
    const name = getName(schema);
    const identifiers = getIdentifiers(init);

    return (
        <div>
            <Card body className="mb-3">
                <Container fluid>
                    <Row>
                        <Col sm={{ size: 8, offset: 1 }}>
                            <h4>
                                {name}
                            </h4>
                            <p>
                                {identifiers}
                            </p>
                        </Col>
                        <Col sm="3" className="text-right">
                            <ButtonGroup>
                                <Button
                                    color="primary"
                                    onClick={() => toggleSettings()}
                                    disabled={hasError(errors)}
                                >
                                    {' '}
                                    Settings
                                </Button>
                                <Button
                                    color="success"
                                    onClick={() => savePlot()}
                                    disabled={hasError(errors)}
                                >
                                    {' '}
                                    Save
                                </Button>

                            </ButtonGroup>
                        </Col>
                    </Row>
                </Container>
            </Card>
        </div>
    );
};

export default PlotHeader;
