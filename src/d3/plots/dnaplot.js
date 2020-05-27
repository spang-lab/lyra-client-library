import { select, mouse } from 'd3';
import {
    updateFrame,
    rectEnter,
    rectUpdate,
    lineEnter,
    lineUpdate,
} from '../components';
import { wrapSelection } from '../util';

const groupEnter = wrapSelection((request, lineAxis) => {
    const { element } = request;
    const group = select(element);
    group.append('g')
        .classed('group-axis', true)
        .attr('width', 40)
        .call(lineAxis.render);
    group.append('g')
        .classed('group-body', true);
});

const groupUpdate = wrapSelection((request, lineAxis, xScale) => {
    const { element, data } = request;
    const group = select(element);
    group.select('.group-axis')
        .call(lineAxis.render);

    const body = group.select('.group-body');
    const lines = body.selectAll('.line')
        .data(data.lines);

    lines.exit().remove();

    const newLines = lines.enter()
        .append('g')
        .classed('line', true)
        .call(lineEnter, xScale, lineAxis.scale);
    lines
        .merge(newLines)
        .call(lineUpdate, xScale, lineAxis.scale);
});

export default class Dnaplot {
    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);

        const { data } = plot;

        const xAxis = data.axes.bottom;
        const annotationAxis = data.axes.annotation;
        const groupAxis = data.axes.groups;
        const lineAxis = data.axes.lines;


        const annotation = element.select('.chart-group')
            .selectAll('.annotation-section')
            .data(data.annotation);

        annotation.exit().remove();

        const newAnnotation = annotation.enter()
            .append('g')
            .classed('annotation-section', true)
            .call(rectEnter, xAxis.scale, annotationAxis.scale);

        annotation
            .merge(newAnnotation)
            .call(rectUpdate, xAxis.scale, annotationAxis.scale);


        const lineGroups = element.select('.chart-group')
            .selectAll('.line-group')
            .data(data.lineGroups);

        lineGroups.exit().remove();

        const newGroups = lineGroups.enter()
            .append('g')
            .classed('line-group', true)
            .call(groupEnter, lineAxis, xAxis.scale);

        lineGroups
            .merge(newGroups)
            .attr(
                'transform',
                d => `translate(0,${groupAxis.scale(d.label)})`,
            )
            .call(groupUpdate, lineAxis, xAxis.scale);

        const mousemove = function _() {
            const pos = mouse(this);
            xAxis.scale.distortion(10).focus(pos[0]);
            xAxis.element.call(xAxis.render);

            annotation
                .merge(newAnnotation)
                .call(rectUpdate, xAxis.scale, annotationAxis.scale);

            lineGroups
                .merge(newGroups)
                .call(groupUpdate, lineAxis, xAxis.scale);
        };

        element.select('.chart')
            .on('mousemove', mousemove);
    }
}
