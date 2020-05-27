import React from 'react';
import {
    Col,
    Checkbox,
} from 'reactstrap';
import { findObjects } from '../../../lyra';

function extractHidden(schema) {
    if (!schema || !schema.info || schema.info.type !== 'heatmap') {
        return [];
    }
    return findObjects(schema, obj => obj.hidden !== undefined);
}

export default function renderHeatmapHide(schema, onSchemaUpdate) {
    const hiddenObjs = extractHidden(schema);
    if (hiddenObjs.length === 0) {
        return '';
    }

    const changeHandler = obj => (e) => {
        onSchemaUpdate({
            schemaId: obj.schemaId,
            hidden: e.target.checked,
        });
    };

    return (
        <Col md={3}>
            <h4>Hide</h4>
            {hiddenObjs.map(obj => (
                <Checkbox key={obj.name} checked={obj.hidden} onChange={changeHandler(obj)}>
                    {obj.name}
                </Checkbox>
            ))}
        </Col>
    );
}
