import { select } from 'd3';

import {
    updateFrame,
    mhnNodeEnter,
    mhnNodeUpdate,
} from '../components';


export default class MHNGraph {
    constructor() {
        this.frame = null;
    }

    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);
        const { data } = plot;

        const xScale = data.axes.bottom.scale;
        const yScale = data.axes.left.scale;

        const nodes = element.select('.chart-group')
            .selectAll('.node')
            .data(data.nodes);

        nodes.exit().remove();

        const newNodes = nodes.enter()
            .append('g')
            .classed('node', true)
            .call(mhnNodeEnter, xScale, yScale);
        nodes
            .merge(newNodes)
            .call(mhnNodeUpdate, xScale, yScale);
    }
}
