import React, { useContext } from 'react';
import {
    Card,
    Collapse,
} from 'reactstrap';

import SurvivalSettings from '../settings/SurvivalSettings';
import ColorSettings from '../settings/ColorSettings';
import PlotContext from './PlotContext';


const renderSettings = (type) => {
    switch (type) {
    case 'kaplanmeier':
        return (<SurvivalSettings />);
    default:
        return (<ColorSettings />);
    }
};

const PlotSettings = () => {
    const { plot, showSettings } = useContext(PlotContext);
    const { schema } = plot;
    if (!schema) {
        return '';
    }
    const { type } = schema.info;

    return (
        <Collapse isOpen={showSettings} >
            <Card body >
                {renderSettings(type)}
            </Card>
        </Collapse>
    );
};

export default PlotSettings;
