import { select, pie, arc, easeCubicInOut, interpolate } from 'd3';
import { updateFrame } from '../components';
import { getChartDimensions, manageLegend, plural } from '../util';

function fanPiece(radius) {
    return (d, i, n) => {
        const currentPiece = select(n[i]);
        const interStart = interpolate(currentPiece.attr('currentStart'), d.startAngle);
        const interEnd = interpolate(currentPiece.attr('currentEnd'), d.endAngle);
        const interRadius = interpolate(currentPiece.attr('currentRadius'), radius);
        const datum = d;
        return (t) => {
            datum.startAngle = interStart(t);
            datum.endAngle = interEnd(t);
            const newRadius = interRadius(t);
            // store current values for arc transition
            currentPiece.attr('currentStart', datum.startAngle)
                .attr('currentEnd', datum.endAngle)
                .attr('currentRadius', newRadius);
            return arc().innerRadius(0).outerRadius(newRadius)(datum);
        };
    };
}

export default class Piechart {
    constructor() {
        this.legend = null;
    }

    render(rootElement, plot) {
        const element = select(rootElement);
        const { data } = plot;
        const { layout } = plot.schema;

        updateFrame(element, plot);

        const chartGroup = element.select('.chart-group');

        manageLegend(chartGroup, plot);

        const pieFunction = pie()
            .value(d => d.count)
            .sort(null);
        const arcData = pieFunction(data.labeledCounts);

        // center the pie and calculate the radius
        const { width, height } = getChartDimensions(plot);
        let pieChartContainer = chartGroup.select('.piechart');
        if (pieChartContainer.empty()) {
            // create a new pie
            pieChartContainer = chartGroup.append('g')
                .classed('piechart', true)
                .attr('transform', `translate(${width / 2}, ${height / 2})`);
        } else {
            pieChartContainer.transition()
                .duration(2000)
                .ease(easeCubicInOut)
                .attr('transform', `translate(${width / 2}, ${height / 2})`);
        }

        // calculate the smaller radius
        const pieRadius = 0.5 * Math.min(
            // x axis
            width - layout.spacing.left - layout.spacing.right,
            // y axis
            height - layout.spacing.top - layout.spacing.bottom);

        const pieces = pieChartContainer
            .selectAll('.pie-piece')
            .data(arcData, d => d.data.label);

        pieces.exit().remove();

        const arcGenerator = arc().innerRadius(0).outerRadius(pieRadius);

        const newPieces = pieces.enter()
            .append('path')
            .classed('pie-piece', true);
        if (pieces.size() === 0) {
            newPieces
                .attr('d', arcGenerator({ startAngle: 0, endAngle: 0 }))
                // store current values for arc transition
                .attr('currentStart', 0)
                .attr('currentEnd', 0)
                .attr('currentRadius', pieRadius);
        } else {
            // there already exist some pieces, use the end angle from a neighbor as a start angle
            const initAngle = (index, nodes) => {
                if (nodes[index].previousElementSibling) {
                    const existing = nodes[index].previousElementSibling;
                    return select(existing).attr('currentEnd');
                }
                return 0;
            };
            newPieces
                .attr('d', (d, i, n) => arcGenerator({ startAngle: initAngle(i, n), endAngle: initAngle(i, n) }))
                .attr('currentStart', (d, i, n) => initAngle(i, n))
                .attr('currentEnd', (d, i, n) => initAngle(i, n))
                .attr('currentRadius', pieRadius);
        }

        // tooltip
        newPieces.append('title').text(d => `${d.data.label}: ${plural(d.data.count, 'sample')}`);

        pieces.merge(newPieces)
            .transition()
            .duration(2000)
            .ease(easeCubicInOut)
            .attrTween('d', fanPiece(pieRadius))
            .attr('fill', d => d.data.color);
    }
}
