/* eslint-disable no-console */
import {
    BoxplotProcessor,
    InteractionProcessor,
    PiechartProcessor,
    CytobandProcessor,
    DnaplotProcessor,
    HistogramProcessor,
    BarplotProcessor,
    GroupedBarplotProcessor,
    QQPlotProcessor,
    ScatterPlotProcessor,
    KaplanMeierProcessor,
    MacrophagesProcessor,
    HeatmapProcessor,
    MhnGraphProcessor,
} from '../processors';

export default class DataProcessor {
    constructor() {
        this.processors = {
            boxplot_processor: new BoxplotProcessor(),
            interaction_processor: new InteractionProcessor(),
            piechart_processor: new PiechartProcessor(),
            cytoband_processor: new CytobandProcessor(),
            dnaplot_processor: new DnaplotProcessor(),
            histogram_processor: new HistogramProcessor(),
            barplot_processor: new BarplotProcessor(),
            grouped_barplot_processor: new GroupedBarplotProcessor(),
            qqplot_processor: new QQPlotProcessor(),
            scatterplot_processor: new ScatterPlotProcessor(),
            kaplanmeier_processor: new KaplanMeierProcessor(),
            macrophages_processor: new MacrophagesProcessor(),
            heatmap_processor: new HeatmapProcessor(),
            mhn_graph_processor: new MhnGraphProcessor(),
        };
    }

    async process(plot) {
        const processorType = plot.schema.info.processor;
        const processor = this.processors[processorType];
        if (!processor) {
            plot.errors.push({
                name: 'NoProcessorError',
                message: `No plot data processor
                          for type ${processorType}
                          in plot ${plot.schema.info.name}`,
            });
            return plot;
        }
        try {
            const data = await processor.process(plot);
            return Object.assign({}, plot, { data });
        } catch (err) {
            plot.errors.push({
                name: `${processorType} error`,
                message: err.toString(),
            });
            console.error(err);
            return plot;
        }
    }
}

