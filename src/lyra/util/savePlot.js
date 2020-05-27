/* eslint-disable import/prefer-default-export */
/* global document, XMLSerializer, Image, btoa */
import { select } from 'd3';

export async function convertToDataUrl(element) {
    const dimensions = {
        width: element.clientWidth,
        height: element.clientHeight,
    };
    const svg = select(element)
        .select('svg')
        .node();
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const html = new XMLSerializer().serializeToString(svg);
    const base64String = btoa(html);
    const imageSrc = `data:image/svg+xml;base64,${base64String}`;
    const context = canvas.getContext('2d');

    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            context.fillStyle = '#FFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const data = canvas.toDataURL('image/png');
            resolve(data);
        };
    });
}
