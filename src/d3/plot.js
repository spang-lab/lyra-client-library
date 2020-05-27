import {
    Boxplot,
    ForceDirectedGraph,
    Piechart,
    Chromosome,
    Dnaplot,
    Barplot,
    QQPlot,
    KaplanMeierPlot,
    ScatterPlot,
    MacrophagesPlot,
    Heatmap,
    MHNGraph,
} from './plots';

class D3Plot {
    constructor() {
        this.renderers = {
            boxplot: Boxplot,
            force_directed_graph: ForceDirectedGraph,
            piechart: Piechart,
            chromosome: Chromosome,
            dnaplot: Dnaplot,
            barplot: Barplot,
            qqplot: QQPlot,
            kaplanmeier: KaplanMeierPlot,
            scatterplot: ScatterPlot,
            macrophages: MacrophagesPlot,
            heatmap: Heatmap,
            mhn_graph: MHNGraph,
        };
    }

    process(plot) {
        const { type } = plot.schema.info;
        const Renderer = this.renderers[type];
        if (!Renderer) {
            plot.errors.push({
                name: 'NoRendererError',
                message: `No Renderer for plot type ${type}
                          in plot ${plot.init.name}`,
            });
        }
        const renderer = new Renderer();
        const rootElement = plot.init.element;
        renderer.render(rootElement, plot);
        return plot;
    }
}


export default D3Plot;
