import { select, line, curveNatural } from 'd3';
import { wrapSelection } from '../util';


function lineEnterHelper(request, xScale, yScale) {
    const { element, data } = request;
    const lineElem = select(element);
    const color = data.color || '#F0F';
    const thickness = data.thickness || 1.5;

    const lineCreator = line()
        .defined(d => d.y)
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(curveNatural);


    lineElem.append('path')
        .datum(data.data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', thickness)
        .attr('d', lineCreator);
}


function lineUpdateHelper(request, xScale, yScale) {
    const { element, data } = request;
    const color = data.color || '#F0F';
    const lineElem = select(element);
    const lineCreator = line()
        .defined(d => d.y)
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(curveNatural);

    lineElem.select('path')
        .datum(data.data)
        .attr('stroke', color)
        .attr('d', lineCreator);
}

export const lineEnter = wrapSelection(lineEnterHelper);

export const lineUpdate = wrapSelection(lineUpdateHelper);
