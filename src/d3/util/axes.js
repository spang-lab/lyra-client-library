import { extent } from 'd3';
/**
 * Calculate the dimensions of the content area
 * @param {Object}  plot - the plot object
 * @param {Object}  plot.init.options.dimensions - the outer dimensions
 * @param {integer} plot.init.options.dimensions.width - outer width
 * @param {integer} plot.init.options.dimensions.height - outer height
 * @param {Object}  plot.schema - the schema
 * @param {Object}  plot.schema.layout - the plot layout
 * @param {Object}  plot.schema.layout.spacing - margins for axis and spacing
 * @param {integer} plot.schema.layout.spacing.top - margin
 * @param {integer} plot.schema.layout.spacing.right - margin
 * @param {integer} plot.schema.layout.spacing.bottom - margin
 * @param {integer} plot.schema.layout.spacing.left - margin
 */
export function getChartDimensions(plot) {
    const { width, height } = plot.init;
    const { spacing } = plot.schema.layout;

    const cHeight = height - (spacing.top + spacing.bottom);
    const cWidth = width - (spacing.left + spacing.right);
    return {
        height: cHeight,
        width: cWidth,
    };
}

export function getPlotDimensions(plot) {
    const { width, height } = plot.init;
    return {
        width,
        height,
    };
}

/**
 * return the length of the side
 * @param {Object} dimensions - dimensions object
 * @param {integer} dimensions.height - the content height
 * @param {integer} dimensions.width - the content width
 * @param {string} side - "top", "left", "bottom" or "right"
 */
export function getDimension(dimensions, side) {
    if (side === 'left' || side === 'right') {
        return dimensions.height;
    }
    return dimensions.width;
}

/**
 * return the size of the axis box
 * @param {Object} dimensions - dimensions object
 * @param {integer} dimensions.height - the content height
 * @param {integer} dimensions.width - the content width
 * @param {Object} spacing - spacing values
 * @param {number} spacing.top - top spacing
 * @param {number} spacing.bottom - bottom spacing
 * @param {number} spacing.left - left spacing
 * @param {number} spacing.right - right spacing
 * @param {string} side - "top", "left", "bottom" or "right"
 */
export function getBoxSize(dimensions, spacing, side) {
    const space = spacing[side] || 0;
    if (side === 'left' || side === 'right') {
        return {
            width: space,
            height: dimensions.height,
        };
    }
    return {
        width: dimensions.width,
        height: space,
    };
}


/**
 * return the pixel range of the side
 * for use in the scale construction
 * @param {Object} dimensions - dimensions object
 * @param {integer} dimensions.height - the content height
 * @param {integer} dimensions.width - the content width
 * @param {string} side - "top", "left", "bottom" or "right"
 */
export function getRange(dimensions, side) {
    if (side === 'left' || side === 'right') {
        return [dimensions.height, 0];
    }
    return [0, dimensions.width];
}


/**
 * get the scale domain
 * @param {Array} values - list of values that should be included
 * @param {Object} schema - domain parameters (optional)
 * @param {number} schema.padding - padding in percent
 * @param {number} schema.min - fixed minimum
 * @param {number} schema.max - fixed maximum
 */
export function getDomain(values, schema) {
    const params = schema || {};
    if (!values || !values.length) {
        return [params.min, params.max];
    }
    const [dmin, dmax] = extent(values);
    const paddingPercent = params.padding || 0.0;
    const padding = (dmax - dmin) * paddingPercent;
    let min = dmin - padding;
    let max = dmax + padding;
    if (params.min !== undefined &&
        params.min !== null) {
        min = Math.min(params.min, min);
    }
    if (params.max !== undefined &&
        params.max !== null) {
        max = Math.max(params.max, max);
    }
    return [min, max];
}
