
import { select } from 'd3';

import { updateFrame, boxEnter, boxUpdate } from '../components';

export default class Boxplot {
    updateFocus(plot, element) {
        const { setTooltip } = plot.init;
        if (element) {
            setTooltip({
                type: 'boxplot',
                show: true,
                data: select(element).data()[0],
            });
            return;
        }
        setTooltip({
            type: 'boxplot',
            show: false,
        });
    }

    render(rootElement, plot) {
        const element = select(rootElement);
        updateFrame(element, plot);
        const { data } = plot;

        const xScale = data.axes.bottom.scale;
        const yScale = data.axes.left.scale;

        const boxes = element.select('.chart-group')
            .selectAll('.boxplot-box')
            .data(data.boxes);

        boxes.exit().remove();

        const newBoxes = boxes.enter()
            .append('g')
            .classed('boxplot-box', true)
            .call(boxEnter, xScale, yScale)
            .on('mouseover', (d, i, nodes) => this.updateFocus(plot, nodes[i]))
            .on('mouseout', () => this.updateFocus(plot, null));

        boxes
            .merge(newBoxes)
            .call(boxUpdate, xScale, yScale);
    }
}
