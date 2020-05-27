/* eslint-disable no-param-reassign */
import { extent } from 'd3';

export function fisheyeScale(scale, d = 3, a = 0) {
    function fisheye(_) {
        const x = scale(_);
        const left = x < a;
        const range = extent(scale.range());
        const min = range[0];
        const max = range[1];
        let m = left ? a - min : max - a;
        if (m === 0) m = max - min;
        return (((left ? -1 : 1) * m * (d + 1)) / (d + (m / Math.abs(x - a)))) + a;
    }

    fisheye.distortion = (_) => {
        if (!arguments.length) return d;
        d = +_;
        return fisheye;
    };

    fisheye.focus = (_) => {
        if (!arguments.length) return a;
        a = +_;
        return fisheye;
    };

    fisheye.copy = () => fisheyeScale(scale.copy(), d, a);

    fisheye.nice = scale.nice;
    fisheye.ticks = scale.ticks;
    fisheye.tickFormat = scale.tickFormat;
    fisheye.range = (...p) => scale.range(...p);
    fisheye.domain = (...p) => scale.domain(...p);
    return fisheye;
}
