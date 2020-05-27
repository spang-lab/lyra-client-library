export class Tooltip {
    constructor(root) {
        this.container = root.append('g')
            .classed('tooltip', true);
        this.bg = this.container.append('rect')
            .attr('fill', 'white');
        this.text = this.container.append('text')
            .attr('text-anchor', 'middle');

        this.updateContent('Tooltip');
        this.setVisible(false);
    }

    setVisible(visible) {
        this.container.style('visibility', visible ? 'visible' : 'hidden');
    }

    updateContent(newText) {
        this.text.text(newText);
        const bounds = this.text.node().getBBox();
        this.bg.attr('x', bounds.x)
            .attr('y', bounds.y)
            .attr('width', bounds.width)
            .attr('height', bounds.height);
    }

    updatePosition(newPosition) {
        this.container.attr('transform', `translate(${newPosition[0]}, ${newPosition[1] - 10})`);
    }
}
