import {
    select,
    line,
    curveStepAfter,
    mouse,
    scaleQuantile,
    range,
} from 'd3';
import { defaultTransition, slowTransition } from '../components/transitions';
import { wrapSelection } from '../util';


const hoverData = (d, node, x1) => {
    const x = mouse(node)[0];
    const before = d.samples.filter(s =>
        x1(s.time) <= x);
    const last = before.pop();
    return last;
};

const lineTween = (data, lineFunc) => {
    const interpolate = scaleQuantile()
        .domain([0, 1])
        .range(range(1, data.length + 1));
    return t => lineFunc(data.slice(0, interpolate(t)));
};

const stepLine = (x1, y1) =>
    line()
        .x(d => x1(d.time))
        .y(d => y1(d.survival))
        .curve(curveStepAfter);


function survivalEnterHelper(request, xScale, yScale, setTooltip) {
    const { element, data } = request;
    const sLine = select(element)
        .classed('survival-line', true);

    const tickHeight = 10;
    const lineFunc = stepLine(xScale, yScale);
    sLine.append('path')
        .classed('main-line', true)
        .style('fill', 'none')
        .style('stroke-width', 4)
        .style('stroke', d => d.color)
        .attr('d', d => lineFunc(d.samples[0]))
        .on('mousemove', (d, i, nodes) => setTooltip({
            type: 'kaplanmeier',
            show: true,
            data: hoverData(d, nodes[i], xScale),
        }))
        .on('mouseout', () => setTooltip({
            type: 'kaplanmeier',
            show: false,
        }));

    const ticks = sLine.selectAll('line.tick')
        .data(d => d.alive);

    ticks.exit()
        .transition(defaultTransition())
        .attr('y1', yScale(0))
        .attr('y2', yScale(0));

    const newTicks = ticks.enter()
        .append('line')
        .classed('tick', true);

    ticks
        .merge(newTicks)
        .attr('x1', d => xScale(d.time))
        .attr('x2', d => xScale(d.time))
        .attr('y1', yScale(0) + tickHeight)
        .attr('y2', yScale(0) - tickHeight)
        .style('stroke', data.color);
}

function survivalUpdateHelper(request, xScale, yScale) {
    const { element, data } = request;
    const tickHeight = 10;
    const sLine = select(element)
        .classed('survival-line', true);

    const lineFunc = stepLine(xScale, yScale);
    sLine.select('path.main-line')
        .transition(slowTransition())
        .style('fill', 'none')
        .style('stroke-width', 4)
        .style('stroke', d => d.color)
        .attrTween('d', d => lineTween(d.samples, lineFunc));

    const ticks = sLine.selectAll('line.tick')
        .data(d => d.alive);

    ticks.exit()
        .transition(defaultTransition())
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .remove();

    const newTicks = ticks.enter()
        .append('line')
        .classed('tick', true)
        .attr('x1', d => xScale(d.time))
        .attr('x2', d => xScale(d.time))
        .attr('y1', yScale(0) + tickHeight)
        .attr('y2', yScale(0) - tickHeight);

    ticks
        .merge(newTicks)
        .transition(defaultTransition())
        .attr('x1', d => xScale(d.time))
        .attr('x2', d => xScale(d.time))
        .attr('y1', d => yScale(d.survival) - tickHeight)
        .attr('y2', d => yScale(d.survival) + tickHeight)
        .style('stroke', data.color);
}

export const survivalEnter = wrapSelection(survivalEnterHelper);
export const survivalUpdate = wrapSelection(survivalUpdateHelper);
