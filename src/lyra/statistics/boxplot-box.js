
import { quantileSorted, interquartileRange } from 'simple-statistics';

export function calculateBox(samples, accessor) {
    const accessorFunc = accessor || (v => v);
    const sorted = samples
        .slice(0)
        .sort((a, b) => accessorFunc(a) - accessorFunc(b));
    const data = sorted.map(accessorFunc);
    const q25 = quantileSorted(data, 0.25);
    const median = quantileSorted(data, 0.5);
    const q75 = quantileSorted(data, 0.75);
    const iqr = interquartileRange(data);
    const sIqr = iqr * 1.5;

    let lowerIndex = data.findIndex(v => v > q25 - sIqr);
    let upperIndex = data.findIndex(v => v > q75 + sIqr) - 1;
    if (upperIndex < 0) {
        upperIndex = data.length - 1;
    }
    if (lowerIndex < 0) {
        lowerIndex = 0;
    }

    const n = (upperIndex - lowerIndex) + 1;
    sorted.splice(lowerIndex, n);
    const box = {
        whiskerTop: data[upperIndex],
        whiskerBottom: data[lowerIndex],
        q25,
        median,
        q75,
        outliers: sorted,
    };
    return box;
}
