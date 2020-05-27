import { select } from 'd3';
import { updateFrame, defaultTransition } from '../components';
import { getChartDimensions, manageLegend } from '../util';

const circleSize = 5;
const circleSizeSelected = 2 * circleSize;

export default class QQPlot {
    constructor() {
        this.selected = null;
    }

    updateFocus(plot, element) {
        if (this.selected) {
            select(this.selected)
                .transition(defaultTransition)
                .attr('r', circleSize)
                .style('stroke-width', 1);
            this.selected = null;
        }
        const { setTooltip } = plot.init;
        if (!element) {
            setTooltip({
                type: 'qqplot',
                show: false,
                data: null,
            });
            return;
        }
        this.selected = element;
        select(element)
            .transition(defaultTransition)
            .attr('r', circleSizeSelected)
            .style('stroke-width', 4);

        setTooltip({
            type: 'qqplot',
            show: true,
            data: select(element).data()[0],
        });
    }

    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);

        const container = element.select('.chart-group');

        const { width, height } = getChartDimensions(plot);
        if (container.select('g.lines').empty()) {
            container.append('g').classed('lines', true);
        }
        const linesContainer = container.select('g.lines');
        const lines = linesContainer.selectAll('line')
            .data(plot.data.lines);
        lines.exit().remove();

        lines.enter()
            .append('line')
            .attr('x1', 0.5 * width)
            .attr('y1', 0.5 * height)
            .attr('x2', 0.5 * width)
            .attr('y2', 0.5 * height);
        const dots = container.selectAll('circle')
            .data(plot.data.dots);

        dots.exit().remove();

        dots.enter()
            .append('circle')
            .attr('cx', 0.5 * width)
            .attr('cy', 0.5 * height)
            .style('fill', 'transparent')
            .style('stroke', 'black');

        manageLegend(container, plot, 'topleft');

        element.select('g.lines').selectAll('line')
            .transition(defaultTransition)
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
            .style('stroke', d => d.color);

        element.selectAll('circle')
            .on('mouseover', (d, i, nodes) => {
                this.updateFocus(plot, nodes[i]);
            })
            .on('mouseout', () => {
                this.updateFocus(plot, null);
            })
            .transition(defaultTransition)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', circleSize)
            .style('stroke', d => d.color);
    }
}
