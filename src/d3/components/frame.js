import { defaultTransition } from './transitions';
import { getChartDimensions, getBoxSize } from '../util';

const createFrame = (element) => {
    const svg = element
        .append('svg')
        .classed('chart', true)
        .attr('version', '1.1')
        .attr('xmlns', 'http://www.w3.org/2000/svg');
    const container = svg.append('g')
        .classed('container-group', true);

    const sides = ['right', 'bottom', 'left', 'top'];
    sides.forEach((side) => {
        const axis = container
            .append('g')
            .classed(`${side}-axis-group axis`, true);
        axis
            .append('text')
            .classed('axis-label', true);
    });
    container
        .append('g')
        .classed('chart-group', true);
};

export function updateFrame(element, plot) {
    const frame = element.select('.chart');
    if (frame.empty()) {
        createFrame(element);
    }
    const dimensions = getChartDimensions(plot);
    const { spacing } = plot.schema.layout;
    const axes = plot.data.axes || {};
    const fullWidth = spacing.left + dimensions.width + spacing.right;
    const fullHeight = spacing.top + dimensions.height + spacing.bottom;
    element.select('.chart')
        .transition(defaultTransition)
        .attr('width', fullWidth)
        .attr('height', fullHeight);

    const transforms = {
        main: `translate(${spacing.left}, ${spacing.top})`,
        right: `translate(${dimensions.width + spacing.left}, ${spacing.top})`,
        bottom: `translate(${spacing.left}, ${dimensions.height + spacing.top})`,
        left: `translate(${spacing.left}, ${spacing.top})`,
        top: `translate(${spacing.left}, ${spacing.top})`,
    };
    Object.keys(spacing).forEach((side) => {
        const className = `.${side}-axis-group.axis`;
        const axis = axes[side] || {};
        axis.element = element.select(className);

        const size = getBoxSize(dimensions, spacing, side);
        const schema = axis.schema || {};
        const fontSize = schema.fontSize || '15px';
        const render = axis.render || (() => {});
        axis.element
            .transition(defaultTransition)
            .attr('transform', transforms[side])
            .attr('width', size.width)
            .attr('height', size.height)
            .style('font-size', fontSize)
            .call(render);

        // add a rotation to ticks labels
        if (schema.rotate) {
            // compute text alignment
            let textAlign = 'start';
            const radians = ((schema.rotate) / 180) * Math.PI;
            const dx = `${Math.sin(radians) * 10}px`;
            const dy = `${(Math.cos(radians) * 10) - 6}px`;
            if (side === 'bottom' || side === 'top') {
                textAlign = 'start';
            } else if (side === 'left') {
                textAlign = 'end';
            } else if (side === 'right') {
                textAlign = 'start';
            }
            axis.element.selectAll('g.tick').selectAll('text')
                .style('text-anchor', textAlign)
                .attr('dx', dx)
                .attr('dy', dy)
                .attr('transform', `rotate(${schema.rotate})`);
        }

        // update axis description/label
        if (schema.label) {
            const labelText = axis.element.select('text.axisLabel');
            let transf = '';
            const offset = schema.labelOffset || 30;
            if (side === 'left') {
                transf = `translate(${-offset}, ${(0.5 * size.height)}) rotate(-90)`;
            } else if (side === 'right') {
                transf = `translate(${offset}, ${0.5 * size.height}) rotate(-90)`;
            } else if (side === 'bottom') {
                transf = `translate(${0.5 * size.width}, ${offset})`;
            } else if (side === 'top') {
                transf = `translate(${0.5 * size.width}, ${-offset})`;
            }
            labelText
                .transition(defaultTransition)
                .attr('transform', transf)
                .text(schema.label)
                .style('font-size', fontSize);
        }
    });
    element.select('.chart-group')
        .transition(defaultTransition)
        .attr('transform', transforms.main);
}

