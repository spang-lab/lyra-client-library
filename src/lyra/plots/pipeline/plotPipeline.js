
/* eslint-disable no-console */
import PlotProvider from './plotProvider';
import SchemaProcessor from './schemaProcessor';
import ResourceProvider from './resourceProvider';
import DataProcessor from './dataProcessor';
import d3Plot from '../../../d3';


class PlotPipeline {
    constructor() {
        this.plotProvider = new PlotProvider();
        this.schemaProcessor = new SchemaProcessor();
        this.resourceProvider = new ResourceProvider();
        this.dataProcessor = new DataProcessor();
        this.d3PlotProcessor = d3Plot;
    }

    isValid(blueprint) {
        const keys = [
            'identifiers',
            'name',
            'updates',
            'element',
            'width',
            'height',
        ];
        const missing = keys
            .filter(key => !blueprint[key]);
        return missing.length === 0;
    }


    async process(blueprint) {
        if (!this.isValid(blueprint)) {
            return null;
        }
        const plot = {
            init: blueprint,
            errors: [],
        };
        const pipeline = [
            this.plotProvider,
            this.schemaProcessor,
            this.resourceProvider,
            this.dataProcessor,
            this.d3PlotProcessor,
        ];
        const rPlot = await pipeline.reduce(async (plotPromise, module) => {
            try {
                const pPlot = await plotPromise;
                if (pPlot.errors.length > 0) {
                    return pPlot;
                }
                return module.process(pPlot);
            } catch (err) {
                console.error(err);
                return {
                    errors: [
                        {
                            name: 'Pipeline Error',
                            message: err.toString(),
                        },
                    ],
                };
            }
        }, plot);
        return rPlot;
    }
}

const pipeline = new PlotPipeline();
export default pipeline;
