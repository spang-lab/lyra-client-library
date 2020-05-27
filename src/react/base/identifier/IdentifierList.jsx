/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, ListGroup } from 'reactstrap';

import IdentifierLink from './IdentifierLink';


const IdentifierList = (props) => {
    const { identifiers, render } = props;
    const columnCount = props.columns;
    const columns = [];
    for (let col = 0; col < columnCount; col += 1) {
        columns[col] = identifiers.filter((_, i) =>
            i % columnCount === col);
    }
    return (
        <Container fluid >
            <Row>
                { columns.map((column, i) => (
                    <Col key={`column${i}`}>
                        <ListGroup>
                            {column.map(id => (
                                <li key={id.id} className="list-group-item" >
                                    {render(id)}
                                </li>
                            ))}
                        </ListGroup>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};


IdentifierList.propTypes = {
    columns: PropTypes.number,
    render: PropTypes.func,
    identifiers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        typeName: PropTypes.string,
    })),
};
IdentifierList.defaultProps = {
    identifiers: [],
    columns: 2,
    render: identifier => <IdentifierLink identifier={identifier} />,
};


export default IdentifierList;

