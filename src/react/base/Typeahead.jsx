import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Container, Row, Col } from 'reactstrap';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

import TypeBadge from './identifier/TypeBadge';
import { apiRequest, toSingle } from '../../lyra';


const Option = (props) => {
    const { data, size } = props;
    if (size === 'small') {
        return (
            <div>
                <div>
                    {data.name}
                </div>
                <TypeBadge identifier={data} />
            </div>
        );
    }
    return (
        <Container fluid id={data.name}>
            <Row className="py-1">
                <Col md={4}>
                    {data.name}
                </Col>
                <Col md={{ size: 3, offset: 5 }}>
                    <TypeBadge identifier={data} />
                </Col>
            </Row>
        </Container>
    );
};
Option.propTypes = {
    size: PropTypes.string.isRequired,
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};

const Typeahead = (props) => {
    const {
        species,
        selectHandler,
        multiple,
        size,
        placeholder,
    } = props;
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const element = useRef(null);

    const search = async (query) => {
        setLoading(true);
        const response = await apiRequest({
            path: 'search/query',
            queries: [{
                name: query,
            }],
            species,
        });
        const result = toSingle(response.data);
        setOptions(result.data);
        setLoading(false);
    };
    const select = (o) => {
        if (!multiple) {
            const instance = element.current.getInstance();
            instance.clear();
        }
        selectHandler(o);
    };
    const render = o => <Option size={size} data={o} />;
    return (
        <AsyncTypeahead
            id="mainSearch"
            bsSize={size}
            isLoading={loading}
            onSearch={search}
            onChange={select}
            renderMenuItemChildren={render}
            options={options}
            multiple={multiple}
            clearButton={multiple}
            labelKey="name"
            ref={element}
            placeholder={placeholder}
            aria-label="Search field"
            minLength={2}
            useCache={false}
            selectHintOnEnter
            autoFocus
        />
    );
};

Typeahead.propTypes = {
    selectHandler: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    size: PropTypes.string,
    species: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
};
Typeahead.defaultProps = {
    multiple: true,
    size: 'large',
    placeholder: 'Search...'
};


export default Typeahead;
