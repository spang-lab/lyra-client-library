
import { select } from 'd3';
import { wrapSelection } from '../util';


function rectEnterHelper(request, xScale, yScale) {
    const { element } = request;

    const container = select(element)
        .attr('transform', d => `
            translate(${xScale(d.dna.start)},${yScale(d.level)})`);

    container.append('rect')
        .classed('main-rect', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', d => xScale(d.dna.stop) - xScale(d.dna.start))
        .attr('height', yScale.bandwidth())
        .style('stroke', '#000')
        .style('stroke-width', '0.5px')
        .style('fill', d => d.color);

    container.append('text')
        .classed('label', true)
        .attr('x', d => (xScale(d.dna.stop) - xScale(d.dna.start)) / 2)
        .attr('y', yScale.bandwidth() / 2)
        .attr('dy', 5)
        .attr('text-anchor', 'center')
        .attr('font-size', 12)
        .style('fill', '#C60')
        .text(d => d.label);
}


function rectUpdateHelper(request, xScale, yScale) {
    const { element } = request;

    const container = select(element)
        .attr('transform', d => `
            translate(${xScale(d.dna.start)},${yScale(d.level)})`);
    container.select('rect.main-rect')
        .attr('width', d => (xScale(d.dna.stop) - xScale(d.dna.start)))
        .style('fill', d => d.color);

    container.select('text.label')
        .attr('x', d => (xScale(d.dna.stop) - xScale(d.dna.start)) / 2);
}

export const rectEnter = wrapSelection(rectEnterHelper);
export const rectUpdate = wrapSelection(rectUpdateHelper);
