export const evaluatePrevAndCurrent = (prev: boolean, curr: boolean): boolean => {
    if (prev === false) {
        return prev;
    } else {
        return curr;
    }
};
