const KEYS_COUNT = 12;

// gets next intervals after key was selected/deselected
export const getNextIntervals = (intervals, root, selectedKey) => {
    if (selectedKey === root) return intervals;
    let selected = getSelectedKeys(intervals, root);
    if (selected.includes(selectedKey)) {
        selected = selected.filter((s) => s !== selectedKey);
    } else {
        selected.push(selectedKey);
    }
    selected = selected.map((s) => (s >= root ? s : s + KEYS_COUNT));
    selected.sort((a, b) => parseInt(a) - parseInt(b));
    return selected.reduce((acc, val, i) => {
        let next = selected[i + 1];
        if (next == undefined) next = root + KEYS_COUNT;
        acc.push(next - val);
        return acc;
    }, []);
};

export const getSelectedKeys = (intervals, root) =>
    intervals.reduce(
        (acc, i) => {
            let last = acc[acc.length - 1];
            let next = last + parseInt(i);
            if (next >= KEYS_COUNT) next = next - KEYS_COUNT;
            if (next !== root) acc.push(next);
            return acc;
        },
        [root]
    );

export const denormalize = (float, range) => Math.round(float * range);

export const normalize = (int, range) => {
    if (range === 1) return int === 0 ? 0 : 1;
    return int / (range - 1);
};
