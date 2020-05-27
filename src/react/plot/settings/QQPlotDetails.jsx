import React from 'react';
import { Col, Input} from 'reactstrap';
import { findObjects } from '../../../lyra';


function extractQQPlotSettings(schema) {
    return findObjects(schema, obj =>
        obj.showMean !== undefined &&
        obj.showDeviation !== undefined &&
        obj.showKurtosis !== undefined &&
        obj.showSkewness !== undefined);
}

export default function renderQQPlotSettings(schema, onSchemaUpdate) {
    const setting = extractQQPlotSettings(schema)[0];
    if (setting === undefined) {
        return '';
    }

    const changeHandler = (e, settingName) => {
        const update = { schemaId: setting.schemaId };
        update[settingName] = e.target.checked;
        onSchemaUpdate(update);
    };

    return (
        <Col md={3}>
            <h4>Details</h4>
            <Checkbox inline checked={setting.showMean} onChange={e => changeHandler(e, 'showMean')}>mean
            </Checkbox>
            <Checkbox inline checked={setting.showDeviation} onChange={e => changeHandler(e, 'showDeviation')}>deviation</Checkbox>
            <Checkbox inline checked={setting.showKurtosis} onChange={e => changeHandler(e, 'showKurtosis')}>kurtosis</Checkbox>
            <Checkbox inline checked={setting.showSkewness} onChange={e => changeHandler(e, 'showSkewness')}>skewness</Checkbox>
            <Checkbox inline checked={setting.showShowSampleCount} onChange={e => changeHandler(e, 'showSampleCount')}>sample count</Checkbox>
        </Col>
    );
}
