import {
    scaleLinear,
    axisLeft,
    axisBottom,
} from 'd3';
import {
    getChartDimensions,
    getRange,
    getDomain,
} from '../../../d3';

import { arrayToDict } from '../../../lyra';


export default class MhnGraphProcessor {
    createAxes(plot, nodes) {
        const dimensions = getChartDimensions(plot);
        const schemas = plot.schema.axes || {};
        const yValues = nodes.map(s => s.y);
        const xValues = nodes.map(s => s.x);
        const leftAxis = {};
        leftAxis.scale = scaleLinear()
            .domain(getDomain(yValues, schemas.left))
            .range(getRange(dimensions, 'left'));
        // leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = schemas.left;

        const bottomAxis = {};
        bottomAxis.scale = scaleLinear()
            .domain(getDomain(xValues, schemas.bottom))
            .range(getRange(dimensions, 'bottom'));

        // bottomAxis.render = axisBottom(bottomAxis.scale);
        bottomAxis.schema = schemas.bottom;

        return {
            left: leftAxis,
            bottom: bottomAxis,
        };
    }

    transformEdge(edge) {
        const { bends, value, antivalue } = edge;
        const points = [];
        const values = bends.split(' ');
        for (let i = 0; i < values.length; i += 2) {
            const point = {
                x: parseFloat(values[i]),
                y: parseFloat(values[i + 1]),
            };
            points.push(point);
        }
        return {
            ...edge,
            points,
            value: Math.exp(value),
            antivalue: Math.exp(antivalue),
        };
    }

    async process(plot) {
        const { data } = plot.rawData.main;
        const {
            nodes,
            edges,
            selfLoops,
        } = data;

        const selfLoopValues = selfLoops.map(loop => ({
            id: loop.targetNode,
            v: Math.exp(loop.value),
        }));
        const loopDict = arrayToDict(selfLoopValues, 'id');
        const pNodes = nodes.map(node => ({
            ...node,
            value: loopDict[node.nodeId].v,
            width: (node.label.length * 10) + 20,
            height: 50,
            mutated: false,
        }));

        const pEdges = edges.map(e => this.transformEdge(e));

        const axes = this.createAxes(plot, pNodes);
        return {
            nodes: pNodes,
            edges: pEdges,
            axes,
        };
    }
}
