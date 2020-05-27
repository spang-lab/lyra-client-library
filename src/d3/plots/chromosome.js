import { select } from 'd3';

import { defaultTransition, updateFrame } from '../components';
import { getChartDimensions, wrapSelection } from '../util';


const drawPart = wrapSelection((request, xScale, height) => {
    const { element, data } = request;
    select(element).selectAll('*').remove();
    const width = d => xScale(d.stop) - xScale(d.start);
    switch (data.type) {
    case 'centromere':
        select(element)
            .append('rect')
            .attr('x', 0)
            .attr('y', height / 4)
            .attr('width', width)
            .attr('height', height / 2)
            .style('fill', d => d.color)
            .style('stroke', d => d.stroke || '#000')
            .attr('stroke-width', '0.5');
        break;
    case 'gene':
        select(element)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .style('fill', d => d.color)
            .style('stroke', d => d.stroke || '#000')
            .attr('stroke-width', '0.5');
        select(element)
            .append('polygon')
            .style('fill', d => d.color)
            .style('stroke', d => d.stroke || '#000')
            .attr('stroke-width', '0.5')
            .attr('points', d => [
                [0, 0],
                [-6, -10],
                [(width(d) / 2) - 2, -10],
                [(width(d) / 2) - 2, -20],
                [(width(d) / 2) + 2, -20],
                [(width(d) / 2) + 2, -10],
                [(width(d) + 6), -10],
                [width(d), 0],
            ].map(p => p.join(', ')).join(' '));
        break;
    default:
        select(element)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .style('fill', d => d.color)
            .style('stroke', d => d.stroke || '#000')
            .attr('stroke-width', '0.5');
    }
});

class Chromosome {
    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);

        const { data } = plot;
        const xScale = data.axes.bottom.scale;
        const dimensions = getChartDimensions(plot);
        const { height } = dimensions;
        const padding = {
            top: 60,
            bottom: 10,
        };
        const bandHeight = height - (padding.top + padding.bottom);

        const bands = element.select('.chart-group')
            .selectAll('.cyto-part')
            .data(data.bands);

        bands.exit().remove();


        const newBands = bands.enter()
            .append('g')
            .classed('cyto-part', true)
            .attr('transform', `translate(0,${padding.top})`)
            .call(drawPart, xScale, bandHeight);

        bands
            .merge(newBands)
            .transition(defaultTransition())
            .attr('transform', d =>
                `translate(${xScale(d.start)},${padding.top})`)
            .call(drawPart, xScale, bandHeight);

        element.select('.chart-group')
            .selectAll('.text-label').remove();

        const chrom = data.info.chromosome;
        element.select('.chart-group')
            .append('text')
            .classed('text-label', true)
            .attr('x', 20)
            .attr('y', 30)
            .attr('font-size', 20)
            .text(`Location on Chromosome ${chrom}`);
    }
}

export default Chromosome;
