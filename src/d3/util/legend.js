import { symbol, symbolCircle, select } from 'd3';
import { legendColor } from 'd3-svg-legend';
import { defaultTransition } from '../components/transitions';
import { getPlotDimensions } from './axes';
import { wrapSelection } from './wrappers';

function getLegendTransform(cDim, lDim, position) {
    const padding = 50;
    let x = 0;
    let y = 0;
    switch (position) {
    case 'topleft':
        x = padding;
        y = padding;
        break;
    case 'topright':
        x = cDim.width - lDim.width - padding;
        y = padding;
        break;
    case 'bottomright':
        x = cDim.width - lDim.width - padding;
        y = cDim.height - lDim.height - padding;
        break;
    case 'bottomleft':
        x = padding;
        y = cDim.height - lDim.height - padding;
        break;
    default:
        break;
    }
    return `translate(${x},${y})`;
}

function legendUpdateHelper(request, cDim, position) {
    const { element, data } = request;
    const legendSymbol = symbol()
        .type(symbolCircle)
        .size(50)();
    const legendCreator = legendColor()
        .shape('path', legendSymbol)
        .scale(data.scale)
        .labelWrap(200);
    select(element)
        .call(legendCreator);

    select(element).selectAll('path')
        .style('stroke', '#CCC');

    const lDim = element.getBBox();
    select(element)
        .transition(defaultTransition)
        .attr(
            'transform',
            getLegendTransform(cDim, lDim, position),
        );
}


const legendUpdate = wrapSelection(legendUpdateHelper);

export function manageLegend(chart, plot, position = 'topleft') {
    if (!plot.data.axes.legend) {
        return;
    }
    const cDim = getPlotDimensions(plot);
    const legend = chart.selectAll('g.legend')
        .data([plot.data.axes.legend]);

    legend.exit().remove();
    const newLegend = legend.enter()
        .append('g')
        .classed('legend', true);
    legend
        .merge(newLegend)
        .call(legendUpdate, cDim, position);
}
