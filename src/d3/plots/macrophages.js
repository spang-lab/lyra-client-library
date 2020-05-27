/* global event */

import { select, cluster, hierarchy, scaleLinear, mean, linkVertical } from 'd3';
import { legendColor } from 'd3-svg-legend';
import { updateFrame, defaultTransition } from '../components';
import { getChartDimensions } from '../util';

const nodeRadius = 15;

export default class MacrophagesPlot {

    constructor() {
        this.selection = {
            hover: null,
            fixed: null,
            focused: null,
        };
    }

    updateFocus(plot) {
        // deselect
        select(this.selection.focused)
            .select('circle')
            .transition(defaultTransition)
            .attr('r', nodeRadius);
        select(this.selection.focused)
            .select('text')
            .transition(defaultTransition)
            .attr('dy', '-.25em')
            .attr('y', -nodeRadius);
        // assign
        this.selection.focused = this.selection.hover || this.selection.fixed;
        // select
        select(this.selection.focused)
            .select('circle')
            .transition(defaultTransition)
            // the selected node radius depends on the node depth
            .attr('r', d => (10 / d.depth) + nodeRadius);
        select(this.selection.focused)
            .select('text')
            .transition(defaultTransition)
            .attr('dy', '.25em')
            .attr('y', 0);
        // tooltip
        if (this.selection.focused) {
            const data = select(this.selection.focused).data()[0];
            const exprStr = data.data.expressions.length > 0 ? `, expressions: ${data.data.expressions.join(', ')}` : '';
            plot.data.dispatch.call('tooltip', this, `${data.data.id}${exprStr}`);
        } else {
            plot.data.dispatch.call('tooltip', this, null);
        }
    }

    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);

        const dimensions = getChartDimensions(plot);

        const container = element.select('.chart-group');

        // move this to the processor?
        const root = hierarchy(plot.data.root);
        const clusterGen = cluster().size([1, 1]);
        clusterGen(root);

        const yOffset = 100;
        const yScale = scaleLinear()
        .domain([0.5, 1])
        .range([yOffset, dimensions.height - yOffset]);
        const xScale = scaleLinear()
        .domain([0, 1])
        .range([0, dimensions.width]);

        // create links
        const linkGenerator = linkVertical()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        const links = container.selectAll('.link')
            .data(root.links().filter(l => l.source !== root));
        const newLinks = links.enter()
            .append('path')
            .classed('link', true)
            .style('fill', 'none')
            .style('stroke', 'grey')
            .style('stroke-width', 1.7);

        links.exit().remove();

        links.merge(newLinks)
            .transition(defaultTransition)
            .attr('d', d => linkGenerator({
                source: d.source,
                target: d.target,
            }));

        const nodes = container.selectAll('.node')
            .data(root.descendants().filter((v, i) => i !== 0));

        // create nodes
        const newNodes = nodes.enter()
            .append('g')
            .attr('transform', `translate(${dimensions.width / 2}, ${dimensions.height / 2})`)
            .classed('node', true);
        newNodes.append('circle')
            .attr('r', nodeRadius)
            .style('fill', 'white');
        newNodes.append('text')
            .attr('dy', '-.25em')
            .attr('y', -nodeRadius)
            .attr('text-anchor', 'middle');

        nodes.exit().remove();

        const mergedNodes = nodes.merge(newNodes);
        mergedNodes
            .transition(defaultTransition)
            .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);
        mergedNodes
            .select('text')
            .text(d => d.data.label);
        mergedNodes
            .select('circle')
            .transition(defaultTransition)
            .style('fill', d => (d.data.expressions.length === 0 ? 'black' : plot.data.colorScale(mean(d.data.expressions))));

        // handle interaction events
        element.on('click', () => {
            this.selection.fixed = null;
            this.updateFocus(plot);
        });
        mergedNodes
            .on('mouseover', (d, i, n) => {
                this.selection.hover = n[i];
                this.updateFocus(plot);
            })
            .on('mouseout', () => {
                this.selection.hover = null;
                this.updateFocus(plot);
            })
            .on('click', (d, i, n) => {
                this.selection.fixed = n[i];
                this.updateFocus(plot);
                event.stopPropagation();
            });

        // render the legend on top
        let legend = container.select('.legend');
        if (legend.empty()) {
            legend = container.append('g')
                .classed('legend', true);
        }

        const legendGenerator = legendColor()
            .cells(5)
            .scale(plot.data.colorScale)
            .title('Expression');

        legend.call(legendGenerator);
    }
}
