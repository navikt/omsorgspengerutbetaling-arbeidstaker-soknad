export const evaluatePrevAndCurrent = (prev: boolean, curr: boolean) => {
    if (prev === false) {
        return prev;
    } else {
        return curr;
    }
};