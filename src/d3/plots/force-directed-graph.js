/* eslint-disable no-param-reassign, class-methods-use-this */

import {
    select,
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    drag,
    event,
} from 'd3';

import { getChartDimensions } from '../util';
import { updateFrame } from '../components';


export default class ForceDirectedGraph {
    constructor() {
        this.simulation = null;
    }

    dragStarted(d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragActive(d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragEnded(d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    render(rootElement, plot) {
        const element = select(rootElement);
        const dimensions = getChartDimensions(plot);
        updateFrame(element, plot);
        const center = {
            x: dimensions.width / 2,
            y: dimensions.height / 2,
        };
        const { layout } = plot.schema;
        const distance = layout.distance || 200;
        const strength = layout.strength || 0.5;
        const simulation = forceSimulation()
            .force('link', forceLink().distance(distance).strength(strength))
            .force('charge', forceManyBody().strength(-200).distanceMin(20))
            .force('center', forceCenter(center.x, center.y));
        this.simulation = simulation;

        const { nodeList, linkList, pathList } = plot.data;

        const mapWeight = (d) => {
            if (!d.weight) {
                return 1;
            }
            const rel = Math.abs(d.weight);
            if (rel < 5000) {
                return 1;
            }
            if (rel < 7500) {
                return 2;
            }
            return 3;
        };

        const container = element.select('.chart-group');
        const links = container.selectAll('.link')
            .data(pathList);
        const newLinks = links.enter()
            .append('path')
            .classed('link', true)
            .style('fill', 'none')
            .style('stroke', d => d.color || '#bbb')
            .style('stroke-width', mapWeight);

        links
            .merge(newLinks)
            .transition()
            .style('stroke', d => d.color || '#bbb');


        links.exit().remove();

        const nodes = container.selectAll('.node')
            .data(nodeList.filter(n => n.identifier));

        const newNodes = nodes.enter()
            .append('g')
            .classed('node', true)
            .call(drag()
                .on('start', d => this.dragStarted(d))
                .on('drag', d => this.dragActive(d))
                .on('end', d => this.dragEnded(d)));
        newNodes
            .append('circle')
            .attr('r', 10)
            .attr('fill', d => d.color)
            .style('stroke', '#fff');

        newNodes
            .append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('dy', 9)
            .attr('text-anchor', 'middle')
            .attr('font-size', 12)
            .attr('fill', '#000')
            .text(d => d.name);
        nodes.exit().remove();

        const simulationStep = () => {
            nodes
                .merge(newNodes)
                .attr('transform', d => `translate(${d.x},${d.y})`);
            links
                .merge(newLinks)
                .attr('d', d =>
                    `M${d.node[0].x},${d.node[0].y}S${d.node[1].x},${d.node[1].y} ${d.node[2].x},${d.node[2].y}`);
        };

        simulation
            .nodes(nodeList)
            .on('tick', () => simulationStep());

        simulation
            .force('link')
            .links(linkList);
    }
}
