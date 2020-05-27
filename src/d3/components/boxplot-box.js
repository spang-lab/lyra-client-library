import { select } from 'd3';
import { defaultTransition } from './transitions';
import { wrapSelection } from '../util';

function boxEnterHelper(request, xScale, yScale) {
    const { element, data } = request;

    const box = select(element)
        .attr('transform', d => `translate(${xScale(d.value)},0)`);

    box.append('line')
        .classed('box-dashed', true)
        .attr('x1', xScale.bandwidth() / 2)
        .attr('x2', xScale.bandwidth() / 2)
        .attr('y1', d => yScale(d.stats.median))
        .attr('y2', d => yScale(d.stats.median))
        .style('stroke', '#000')
        .style('stroke-dasharray', '8, 4');

    box.append('rect')
        .classed('box-rect', true)
        .attr('x', 0)
        .attr('y', d => yScale(d.stats.median))
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .style('stroke', '#000')
        .style('stroke-width', '0.5px');

    box.append('line')
        .classed('box-median', true)
        .attr('x1', 0)
        .attr('x2', xScale.bandwidth())
        .attr('y1', d => yScale(d.stats.median))
        .attr('y2', d => yScale(d.stats.median));

    box.append('line')
        .classed('whisker-top', true)
        .attr('x1', xScale.bandwidth() / 2)
        .attr('x2', xScale.bandwidth() / 2)
        .attr('y1', d => yScale(d.stats.median))
        .attr('y2', d => yScale(d.stats.median));
    box.append('line')
        .classed('whisker-bottom', true)
        .attr('x1', xScale.bandwidth() / 2)
        .attr('x2', xScale.bandwidth() / 2)
        .attr('y1', d => yScale(d.stats.median))
        .attr('y2', d => yScale(d.stats.median));

    const outliers = box.selectAll('circle.box-outlier')
        .data(d => d.stats.outliers);

    outliers.enter()
        .append('circle')
        .classed('box-outlier', true)
        .attr('cx', xScale.bandwidth() / 2)
        .attr('cy', yScale(data.stats.median))
        .attr('r', 1);

    outliers.exit().remove();
}

function boxUpdateHelper(request, xScale, yScale) {
    const { element, index, data } = request;
    const box = select(element)
        .transition(defaultTransition())
        .attr('transform', d => `translate(${xScale(d.value)},0)`);

    box.selectAll('line.box-dashed')
        .transition(defaultTransition())
        .delay(index * 50)
        .attr('x1', xScale.bandwidth() / 2)
        .attr('x2', xScale.bandwidth() / 2)
        .attr('y1', d => yScale(d.stats.whiskerBottom))
        .attr('y2', d => yScale(d.stats.whiskerTop));

    box.selectAll('rect.box-rect')
        .transition(defaultTransition())
        .delay(index * 50)
        .style('fill', data.color)
        .attr('x', 0)
        .attr('y', d => yScale(d.stats.q75))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(d.stats.q25) - yScale(d.stats.q75));

    box.selectAll('line.box-median')
        .transition(defaultTransition())
        .delay(index * 50)
        .attr('x1', 0)
        .attr('x2', xScale.bandwidth())
        .attr('y1', d => yScale(d.stats.median))
        .attr('y2', d => yScale(d.stats.median))
        .style('stroke', '#000')
        .style('stroke-width', '2px');

    const whiskerPadding = 0.2;
    box.selectAll('line.whisker-top')
        .transition(defaultTransition())
        .delay(index * 50)
        .attr('x1', xScale.bandwidth() * whiskerPadding)
        .attr('x2', xScale.bandwidth() * (1 - whiskerPadding))
        .attr('y1', d => yScale(d.stats.whiskerTop))
        .attr('y2', d => yScale(d.stats.whiskerTop))
        .style('stroke', '#000');
    box.selectAll('line.whisker-bottom')
        .transition(defaultTransition())
        .delay(index * 50)
        .attr('x1', xScale.bandwidth() * whiskerPadding)
        .attr('x2', xScale.bandwidth() * (1 - whiskerPadding))
        .attr('y1', d => yScale(d.stats.whiskerBottom))
        .attr('y2', d => yScale(d.stats.whiskerBottom))
        .style('stroke', '#000');

    box.selectAll('circle.box-outlier')
        .transition(defaultTransition())
        .delay(index * 50)
        .attr('cx', xScale.bandwidth() / 2)
        .attr('cy', d => yScale(d.value))
        .attr('r', 5)
        .style('stroke', '#000')
        .style('fill', 'rgba(0,0,0,0)');
}

export const boxEnter = wrapSelection(boxEnterHelper);
export const boxUpdate = wrapSelection(boxUpdateHelper);
