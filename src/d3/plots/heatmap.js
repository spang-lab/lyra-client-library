/* global document, event */

import { select, selectAll, mouse, cluster, line, curveStepBefore } from 'd3';
import { legendColor } from 'd3-svg-legend';
import { updateFrame } from '../components';
import { getChartDimensions } from '../util';


export default class Heatmap {
    constructor() {
        this.selection = {
            hover: null,
            fixed: null,
            focused: null,
        };
    }

    updateFocus(plot) {
        this.selection.focused = this.selection.hover || this.selection.fixed;

        if (this.selection.focused) {
            plot.data.dispatch.call('tooltip', this, `${this.selection.focused.name}, identifier ${this.selection.focused.identifier},
                row rank ${this.selection.focused.row_rank}, ${this.selection.focused.group}`);
        } else {
            plot.data.dispatch.call('tooltip', this, null);
        }

        selectAll('.dendro').each((d, i, nodes) => {
            const sel = select(nodes[i]);
            const identifiers = d.target.data.containedIndices;
            if (this.selection.focused && identifiers.find(id => plot.rawData.main[id].identifier.name === this.selection.focused.identifier) !== undefined) {
                sel.style('stroke', 'red');
            } else {
                sel.style('stroke', 'black');
            }
        });
    }

    getPointAtCursor(node, plot, matrixWidth, matrixHeight) {
        const pos = mouse(node);
        const bbox = node.getBBox();
        const col = Math.min(Math.floor(pos[0] * (matrixWidth / bbox.width)),
            matrixWidth - 1);
        const row = Math.min(Math.floor(pos[1] * (matrixHeight / bbox.height)),
            matrixHeight - 1);
        return plot.data.points[(row * matrixWidth) + col];
    }

    renderDendrogram(plot, chart, dimensions) {
        let dendroContainer = chart.select('g.dendrocontainer');
        if (dendroContainer.empty()) {
            dendroContainer = chart.append('g')
                .classed('dendrocontainer', true)
                .style('stroke', 'black')
                .style('stroke-width', 1.5)
                .style('fill', 'none');
        }
        dendroContainer.attr('transform', `translate(${-plot.schema.layout.dendrogram.offset - plot.schema.layout.dendrogram.width}, 0)`);

        const layout = cluster()
            .size([dimensions.height, plot.schema.layout.dendrogram.width])
            .separation(() => 1);
        layout(plot.data.dendrogram);
        const links = plot.data.dendrogram.links();

        const dendros = dendroContainer.selectAll('.dendro')
            .data(links);
        dendros.exit().remove();
        const newDendros = dendros.enter()
            .append('path')
            .classed('dendro', true);

        const lineFunction = line()
            .x(d => d.y)
            .y(d => dimensions.height - d.x)
            .curve(curveStepBefore);
        dendros.merge(newDendros)
            .attr('d', d => lineFunction([d.source, d.target]));
    }

    renderLegend(plot, chart, dimensions) {
        let legend = chart.select('.legend');
        if (legend.empty()) {
            legend = chart.append('g')
                .classed('legend', true);
        }
        legend.attr('transform', `translate(${dimensions.width + 10}, 0)`);

        const legendGenerator = legendColor()
            .cells(5)
            .scale(plot.data.colorScale)
            .title('Row Rank');

        legend.call(legendGenerator);
    }

    render(rootElement, plot) {
        console.log(plot);
        const element = select(rootElement);

        updateFrame(element, plot);

        const chart = this.frame.container.select('.chart-group');

        const matrixHeight = plot.data.size.height;
        const matrixWidth = plot.data.size.width;
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.setAttribute('width', `${matrixWidth}px`);
        tmpCanvas.setAttribute('height', `${matrixHeight}px`);
        const context = tmpCanvas.getContext('2d');
        const imgData = context.createImageData(matrixWidth, matrixHeight);
        plot.data.points.forEach((point, i) => {
            const redIndex = i * 4;
            // rgba
            imgData.data[redIndex + 0] = 255 * point.color[0];
            imgData.data[redIndex + 1] = 255 * point.color[1];
            imgData.data[redIndex + 2] = 255 * point.color[2];
            imgData.data[redIndex + 3] = 255;
        });
        context.putImageData(imgData, 0, 0);

        const dimensions = getChartDimensions(plot);
        let map = chart.select('image.heatmap');
        if (map.empty()) {
            map = chart.append('image')
                .classed('heatmap', true)
                .attr('preserveAspectRatio', 'none')
                // note: this is CSS 4 and not supported by some browsers!
                .style('image-rendering', 'pixelated')
                .on('mouseout', () => {
                    this.selection.hover = null;
                    this.updateFocus(plot);
                });
        }
        map.attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .attr('xlink:href', tmpCanvas.toDataURL())
            .on('mousemove', (d, i, nodes) => {
                this.selection.hover = this.getPointAtCursor(
                    nodes[i], plot, matrixWidth, matrixHeight);
                this.updateFocus(plot);
            })
            .on('click', (d, i, nodes) => {
                this.selection.fixed = this.getPointAtCursor(
                    nodes[i], plot, matrixWidth, matrixHeight);
                this.updateFocus(plot);
                event.stopPropagation();
            });

        tmpCanvas.remove();

        element.on('click', () => {
            this.selection.fixed = null;
            this.updateFocus(plot);
        });

        this.renderDendrogram(plot, chart, dimensions);

        this.renderLegend(plot, chart, dimensions);
    }
}
