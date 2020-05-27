export function getFocused(selection) {
    if (selection.hover) {
        return selection.hover;
    } else if (selection.fixed) {
        return selection.fixed;
    }
    return null;
}
