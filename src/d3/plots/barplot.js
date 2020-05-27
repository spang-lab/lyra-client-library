
import { select } from 'd3';
import { updateFrame, createBar, updateBar, defaultTransition } from '../components';
import { manageLegend } from '../util';

/**
 * Very basic barplot. Simply renders the bars, provided in plot.data.bars and
 * creates a frame with scales.
 */
export default class Barplot {
    constructor() {
        this.selected = null;
    }

    updateFocus(plot, element) {
        if (this.selected) {
            select(this.selected)
                .select('rect')
                .transition(defaultTransition)
                .style('fill', d => d.color);
            this.selected = null;
        }
        const { setTooltip } = plot.init;
        if (!element) {
            setTooltip({
                type: 'barplot',
                show: false,
                data: null,
            });
            return;
        }
        this.selected = element;

        select(element)
            .select('rect')
            .transition(defaultTransition)
            .style('fill', 'red');

        setTooltip({
            type: 'barplot',
            show: true,
            data: select(element).data()[0],
        });
    }

    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);

        const chart = element.select('.chart-group');
        const bars = chart
            .selectAll('.bar')
            .data(plot.data.bars);

        const { axes } = plot.data;
        const xScale = axes.bottom.scale;
        const yScale = axes.left.scale;

        bars.exit().remove();

        const newBars = bars.enter()
            .append('g')
            .classed('bar', true)
            .call(createBar, xScale, yScale)
            .on('mouseover', (d, i, nodes) => this.updateFocus(plot, nodes[i]))
            .on('mouseout', () => this.updateFocus(plot, null));

        bars
            .merge(newBars)
            .transition(defaultTransition)
            .call(updateBar, xScale, yScale);


        manageLegend(chart, plot, 'topright');
    }
}
