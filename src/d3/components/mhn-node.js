import { select, format } from 'd3';
import { defaultTransition } from '../components/transitions';
import { wrapSelection } from '../util';

function mhnEnterHelper(request, xScale, yScale) {
    const { element } = request;

    const container = select(element)
        .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);

    container.append('rect')
        .classed('mhn-rect', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .style('stroke', '#000')
        .style('fill', 'rgba(0,0,0,0)');

    container.append('text')
        .classed('mhn-text', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', 10)
        .attr('dy', 20)
        .text(d => d.label);

    container.append('text')
        .classed('mhn-sl', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', 10)
        .attr('dy', -5)
        .text(d => format('.2f')(d.value));
}

function mhnUpdateHelper(request, xScale, yScale) {
    const { element } = request;
    const container = select(element)
        .transition(defaultTransition())
        .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);

    container.selectAll('rect.mhn-rect')
        .transition(defaultTransition())
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .style('stroke', '#000')
        .style('fill', 'rgba(0,0,0,0)');
}

export const mhnNodeEnter = wrapSelection(mhnEnterHelper);
export const mhnNodeUpdate = wrapSelection(mhnUpdateHelper);
