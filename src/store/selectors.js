import { createSelector } from 'reselect';
import { getNamesList, getScale, getScaleByIntervals, getModesCount, getScalesCount } from '../theory/scales/scale-db';
import { notesPerOctave } from '../theory/chords/utils';

const NOTES_COUNT = notesPerOctave;
const minTonics = 1;
const maxTonics = NOTES_COUNT;

const getRawTonics = (store) => store.rawTonics;
const getRawIndex = (store) => store.rawIndex;
const getRawMode = (store) => store.rawMode;
const getRawRoot = (store) => store.rawRoot;

const denormalize = (float, range) => Math.round(float * range);

const getId = (scale) => scale.intervals.join(' ');

const selectTonics = createSelector(getRawTonics, (rawTonics) => [
    denormalize(rawTonics, maxTonics - minTonics) + minTonics,
    maxTonics,
    minTonics,
]);

const selectIndexes = createSelector([selectTonics, getRawIndex], ([tonics], rawIndex) => {
    const maxIndex = getScalesCount(tonics, NOTES_COUNT) - 1;
    return [denormalize(rawIndex, maxIndex), maxIndex];
});

const selectModes = createSelector([selectTonics, selectIndexes, getRawMode], ([tonics], [index], rawMode) => {
    const maxMode = getModesCount(tonics, index, NOTES_COUNT) - 1;
    return [denormalize(rawMode, maxMode), maxMode];
});

const selectCurrent = createSelector([selectTonics, selectIndexes, selectModes], ([tonics], [index], [mode]) => {
    const scale = getScale(tonics, index, mode, NOTES_COUNT);
    return { id: getId(scale), name: scale.name, intervals: scale.intervals };
});

const selectSiblings = createSelector([selectTonics, selectIndexes], ([tonics], [index]) => {
    return getScale(tonics, index, 0, NOTES_COUNT)
        .generateIntervals()
        .map((intervals) => {
            const scale = getScaleByIntervals(intervals);
            const id = getId(scale);
            const name = scale.name || 'Unknown';
            return { id, name, intervals };
        });
});

const selectKnownNames = createSelector(selectTonics, ([tonics]) =>
    getNamesList(tonics).sort((a, b) => {
        const getIndex = (a) => parseInt(a.substring(0, a.indexOf(':')));
        return getIndex(a) - getIndex(b);
    })
);

const selectRoot = createSelector(getRawRoot, (rawRoot) => {
    return denormalize(rawRoot, NOTES_COUNT - 1);
});

export { selectKnownNames, selectIndexes, selectModes, selectCurrent, selectSiblings, selectTonics, selectRoot };
