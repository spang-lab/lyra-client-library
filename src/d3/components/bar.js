import { select } from 'd3';

import { wrapSelection } from '../util';


/**
 * Creates a new bar that can be updated with updateBar.
 * @param {Object} data See for updateBar for more detailed information about the data object.
 */
export const createBar = wrapSelection((request, xScale, yScale) => {
    const { element, data } = request;
    const bar = select(element)
        .attr('transform', d =>
            `translate(${xScale(d.value)},0)`);

    bar.append('rect')
        .style('fill', d => d.color)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('x', 0)
        .attr('y', yScale.range()[0]);

    const xCenter = xScale.bandwidth() / 2;

    if (data.max && data.min) {
        bar.append('line')
            .classed('maxmin', true)
            .attr('x1', xCenter)
            .attr('x2', xCenter)
        // we need to convert absolute to relative positions (-data.top)
            .attr('y1', d => yScale(d.max))
            .attr('y2', d => yScale(d.min))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
        bar.append('line')
            .classed('max', true)
            .attr('x1', xCenter + 2)
            .attr('x2', xCenter - 2)
            .attr('y1', d => yScale(d.max))
            .attr('y2', d => yScale(d.max))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
        bar.append('line')
            .classed('min', true)
            .attr('x1', xCenter + 2)
            .attr('x2', xCenter - 2)
            .attr('y1', d => yScale(d.min))
            .attr('y2', d => yScale(d.min))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
    }
});


/**
 * Updates an existing bar. Call createBar to create a new one first.
 * @param {Object} data
 * @param {number} data.left
 * @param {number} data.right
 * @param {number} data.bottom
 * @param {number} data.top
 * @param {number} data.max
 * @param {number} data.min
 * @param {number} data.linePadding Padding for the lines (x-axis).
 * @param {any} data.label A label for this bar. The label will be displayed at the top of the bar.
 * Set this to null if you want to disable the label.
 * @param {any} data.color The color of the bar. Color transitions are supported!
 */
export const updateBar = wrapSelection((request, xScale, yScale) => {
    const { data, selection } = request;
    selection
        .attr('transform', d =>
            `translate(${xScale(d.value)},0)`);

    selection.select('rect')
        .style('fill', d => d.color)
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(yScale.domain()[0]) - yScale(d.median))
        .attr('x', 0)
        .attr('y', d => yScale(d.median));

    const xCenter = xScale.bandwidth() / 2;

    if (data.max && data.min) {
        selection.select('line.maxmin')
            .attr('x1', xCenter)
            .attr('x2', xCenter)
            .attr('y1', d => yScale(d.max))
            .attr('y2', d => yScale(d.min))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
        selection.select('line.max')
            .attr('x1', xCenter + 2)
            .attr('x2', xCenter - 2)
            .attr('y1', d => yScale(d.max))
            .attr('y2', d => yScale(d.max))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
        selection.select('line.min')
            .attr('x1', xCenter + 2)
            .attr('x2', xCenter - 2)
            .attr('y1', d => yScale(d.min))
            .attr('y2', d => yScale(d.min))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
    }
});
