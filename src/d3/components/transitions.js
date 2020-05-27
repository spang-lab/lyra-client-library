import { easeCubicInOut, transition } from 'd3';


export const defaultTransition = name => transition(name)
    .duration(500)
    .ease(easeCubicInOut);

export const slowTransition = name => transition(name)
    .duration(1000)
    .ease(easeCubicInOut);

export const debugTransition = name => transition(name)
    .duration(5000)
    .ease(easeCubicInOut);
