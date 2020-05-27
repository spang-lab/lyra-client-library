
import { select } from 'd3';
import { updateFrame, slowTransition } from '../components';
import { manageLegend } from '../util';


export default class ScatterPlot {
    updateFocus(plot, element) {
        const { setTooltip } = plot.init;
        if (element) {
            setTooltip({
                type: 'scatterplot',
                show: true,
                data: select(element).data()[0],
            });
            return;
        }
        setTooltip({
            type: 'scatterplot',
            show: false,
        });
    }


    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);

        const { data } = plot;

        manageLegend(element.select('.chart'), plot, 'topright');

        const xScale = data.axes.bottom.scale;
        const yScale = data.axes.left.scale;

        const dots = element.select('.chart-group')
            .selectAll('circle')
            .data(data.points);
        dots.exit().remove();

        const newDots = dots.enter()
            .append('circle')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 0)
            .style('fill', d => d.color)
            .style('stroke', '#CCC');

        dots
            .merge(newDots)
            .transition(slowTransition())
            .delay((d, i) => i * 1)
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 5);

        const line = element.select('.chart-group')
            .selectAll('line')
            .data([data.line]);

        line.exit().remove();
        const newLine = line.enter()
            .append('line')
            .attr('x1', d => xScale(d.x1))
            .attr('x2', d => xScale(d.x2))
            .attr('y1', d => yScale(d.y1))
            .attr('y2', d => yScale(d.y2))
            .attr('stroke', 'red')
            .attr('stroke-width', 0);
        line.merge(newLine)
            .transition(slowTransition())
            .attr('stroke-width', 3);
    }
}
