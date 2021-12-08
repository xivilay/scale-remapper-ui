import { createSelector } from 'reselect';
import { getNamesList, getScale, getScaleByIntervals, getModesCount, getScalesCount } from '../theory/scales/scale-db';

const NOTES_COUNT = 12;
const minTonics = 3;
const maxTonics = 12;

const getTonics = (store) => store.tonics;
const getIndex = (store) => store.index;
const getMode = (store) => store.mode;

const getId = (scale) => scale.intervals.join(' ');

const selectKnownNames = createSelector(getTonics, (tonics) =>
    getNamesList(tonics).sort((a, b) => {
        const getIndex = (a) => parseInt(a.substring(0, a.indexOf(':')));
        return getIndex(a) - getIndex(b);
    })
);

const selectTonics = createSelector(getTonics, (tonics) => [tonics, maxTonics, minTonics]);

const selectIndexes = createSelector([getTonics, getIndex], (tonics, index) => {
    const max = getScalesCount(tonics, NOTES_COUNT) - 1;
    return [index, max];
});

const selectModes = createSelector([getTonics, getIndex, getMode], (tonics, index, mode) => {
    const max = getModesCount(tonics, index, NOTES_COUNT) - 1;
    return [mode, max];
});

const selectCurrent = createSelector([getTonics, getIndex, getMode], (tonics, index, mode) => {
    const scale = getScale(tonics, index, mode, NOTES_COUNT);
    return { id: getId(scale), name: scale.name, intervals: scale.intervals };
});

const selectSiblings = createSelector([getTonics, getIndex], (tonics, index) => {
    return getScale(tonics, index, 0, NOTES_COUNT)
        .generateIntervals()
        .map((intervals) => {
            const scale = getScaleByIntervals(intervals);
            const id = getId(scale);
            const name = scale.name || 'Unknown';
            return { id, name, intervals };
        });
});

export { selectKnownNames, selectIndexes, selectModes, selectCurrent, selectSiblings, getTonics, selectTonics };
