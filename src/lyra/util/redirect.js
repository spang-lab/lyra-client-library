/* eslint-disable import/prefer-default-export, no-useless-escape */
export function getSearchRedirect(token, origin) {
    if (origin) {
        const match = origin.match(/\/r\/[^\/]+\/(\S+)/);
        if (!match || !match[1]) {
            return `/r/${token}/`;
        }
        return `/r/${token}/${match[1]}`;
    }
    return `/r/${token}/`;
}
