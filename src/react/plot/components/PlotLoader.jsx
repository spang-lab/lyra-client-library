import React, { useContext } from 'react';

import { Loader } from '../../util';
import PlotContext from './PlotContext';

const PlotLoader = () => {
    const { plot, height } = useContext(PlotContext);
    const { data, errors } = plot;
    if (data || (errors && errors.length)) {
        return '';
    }
    return (
        <div
            className="text-center"
            style={{ height }}
        >
            <Loader />
        </div>
    );
};

export default PlotLoader;
