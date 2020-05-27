import { select } from 'd3';
import {
    updateFrame,
    survivalEnter,
    survivalUpdate,
} from '../components';
import { manageLegend } from '../util';


export default class KaplanMeierPlot {
    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);

        const { data } = plot;
        const { setTooltip } = plot.init;
        const xScale = data.axes.bottom.scale;
        const yScale = data.axes.left.scale;

        const chart = element.select('.chart-group');

        const lines = chart.selectAll('g.survival-line')
            .data(data.buckets);

        lines.exit().remove();

        const newLines = lines.enter()
            .append('g')
            .call(survivalEnter, xScale, yScale, setTooltip);

        lines
            .merge(newLines)
            .call(survivalUpdate, xScale, yScale);

        manageLegend(chart, plot, 'topright');
    }
}
