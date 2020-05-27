/**
 * Returns the string '<amount> <singular>' and adds a plural 's' if amount not equals one.
 * @param {number} amount
 * @param {string} singular
 */
export function plural(amount, singular) {
    return `${amount} ${singular}${amount === 1 ? '' : 's'}`;
}
