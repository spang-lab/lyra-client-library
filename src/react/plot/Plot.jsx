/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { plotPipeline } from '../../lyra';
import { useBoolean } from '../hooks';
import { GlobalContext } from '../context';

import {
    PlotContext,
    PlotContent,
    PlotLoader,
    PlotErrors,
    PlotHeader,
    PlotFooter,
    PlotSettings,
} from './components';


const Plot = (props) => {
    const { name, height, identifierIndex } = props;
    let { identifiers } = useContext(GlobalContext);
    if (identifierIndex) {
        identifiers = identifiers[identifierIndex];
    }


    const [updates, setUpdates] = useState([]);
    const [element, setElement] = useState({
        node: null,
        width: 100,
    });
    const [tooltip, setTooltip] = useState({});

    const blueprint = {
        name,
        height,
        width: element.width,
        identifiers,
        updates,
        element: element.node,
        setTooltip,
    };
    const [plot, setPlot] = useState({});
    const pipeline = async () => {
        const result = await plotPipeline.process(blueprint);
        if (result) {
            setPlot(result);
        }
    };
    useEffect(
        () => { pipeline(); },
        [
            blueprint.name,
            blueprint.height,
            blueprint.width,
            blueprint.identifiers,
            blueprint.updates,
            blueprint.element,
        ],
    );

    const updateSchema = u => setUpdates([
        ...updates,
        u,
    ]);

    const savePlot = () => {
        // props.dispatch(preview(element.node));
    };

    const [showSettings, toggleSettings] = useBoolean(false);


    return (
        <PlotContext.Provider
            value={{
                plot,
                height,
                setElement,
                updateSchema,
                savePlot,
                showSettings,
                toggleSettings,
                tooltip,
            }}
        >
            <PlotHeader />
            <PlotSettings />
            <PlotErrors />
            <PlotLoader />
            <PlotContent />
            <PlotFooter />
        </PlotContext.Provider>
    );
};


Plot.propTypes = {
    name: PropTypes.string.isRequired,
    height: PropTypes.number,
    identifierIndex: PropTypes.number,
};

Plot.defaultProps = {
    height: null,
    identifierIndex: 0,
};

export default Plot;
