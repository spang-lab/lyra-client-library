import React from 'react';
import { Col, Checkbox } from 'reactstrap';
import { findObjects } from '../../../lyra';


export default function renderStdUnitsToggle(schema, onSchemaUpdate) {
    // find setting with property standardUnits
    const stdUnitsSetting = findObjects(schema, obj => obj.standardUnits !== undefined)[0];
    if (stdUnitsSetting === undefined) {
        return '';
    }

    const changeHandler = (e) => {
        onSchemaUpdate({
            schemaId: stdUnitsSetting.schemaId,
            standardUnits: e.target.checked,
        });
    };

    return (
        <Col md={3}>
            <h4>Standard Units</h4>
            <Checkbox checked={stdUnitsSetting.standardUnits} onChange={changeHandler}>
                enable
            </Checkbox>
        </Col>
    );
}
