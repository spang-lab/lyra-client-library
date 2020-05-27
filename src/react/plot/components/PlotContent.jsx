/* global window */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect } from 'react';

import PlotContext from './PlotContext';
import { debounce } from '../../../lyra';


const PlotContent = () => {
    const { setElement } = useContext(PlotContext);
    const plotElem = useRef(null);
    const resizeListener = debounce(() => {
        const element = plotElem.current;
        setElement({
            node: element,
            width: element.clientWidth,
        });
    }, 333, false);
    useEffect(() => resizeListener(), []);
    useEffect(() => {
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, [resizeListener]);

    return (
        <div className="p-1" >
            <div
                className="plot plot_graph_bg"
                ref={plotElem}
            />
        </div>
    );
};

export default PlotContent;
