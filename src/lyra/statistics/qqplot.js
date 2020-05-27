import { range } from 'd3';
import { probit } from 'simple-statistics';

export function normalValues(n, mean, sd) {
    const step = 1.0 / (n - 1);
    const quantiles = range(0.0, 1.0 + step, step);
    const sNormal = quantiles.map(q => probit(q));
    const values = sNormal.map(v => (v * sd) + mean);
    return values;
}

