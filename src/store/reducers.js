import { selectCurrent, selectRoot, selectTonics, selectIndexes, selectModes } from '../store/selectors';
import { getScaleByName, getScaleByIntervals } from '../theory/scales/scale-db';
import { notesPerOctave } from '../theory/chords/utils';
import { normalize, getSelectedKeys } from './utils';

const NOTES_COUNT = notesPerOctave;

const getRawValues = (state, tonics, index, mode) => {
    const [, maxTonics, minTonics] = selectTonics(state);
    let nextState = { ...state, rawTonics: normalize(tonics - minTonics, maxTonics - minTonics + 1) };
    const [, maxIndex] = selectIndexes(nextState);
    nextState = { ...nextState, rawIndex: normalize(index, maxIndex + 1) };
    const [, maxMode] = selectModes(nextState);
    nextState = { ...nextState, rawMode: normalize(mode, maxMode + 1) };
    return nextState;
};

const getNext = (forward, current, max, min = 0) => {
    let next = forward ? current + 1 : current - 1;
    const overLimit = forward ? next > max : next < min;
    if (overLimit) {
        next = forward ? min : max;
    }
    return next;
};

const reduceTonics = (state, forward) => {
    const [tonics, maxTonics, minTonics] = selectTonics(state);
    const nextTonics = getNext(forward, tonics, maxTonics, minTonics);
    return { ...state, rawTonics: normalize(nextTonics - minTonics, maxTonics - minTonics + 1) };
};

const reduceIndex = (state, forward) => {
    const [index, maxIndex] = selectIndexes(state);
    const nextIndex = getNext(forward, index, maxIndex);
    return { ...state, rawIndex: normalize(nextIndex, maxIndex + 1) };
};

const reduceShift = (state, forward) => {
    const { intervals } = selectCurrent(state);
    const root = selectRoot(state);
    const selected = getSelectedKeys(intervals, root);
    const rootIndex = selected.indexOf(root);
    const nextRootIndex = getNext(forward, rootIndex, selected.length - 1);
    const nextRoot = selected[nextRootIndex];
    const [mode, maxMode] = selectModes(state);
    const nextMode = getNext(forward, mode, maxMode);
    return { ...state, rawMode: normalize(nextMode, maxMode + 1), rawRoot: normalize(nextRoot, NOTES_COUNT) };
};

export default (state, action) => {
    switch (action.type) {
        case 'enabled/toggle': {
            return { ...state, enabled: !state.enabled };
        }
        case 'enabled/set': {
            return { ...state, enabled: action.value };
        }
        case 'root/next': {
            const nextRoot = getNext(true, selectRoot(state), NOTES_COUNT - 1);
            return { ...state, rawRoot: normalize(nextRoot, NOTES_COUNT) };
        }
        case 'root/prev': {
            const nextRoot = getNext(false, selectRoot(state), NOTES_COUNT - 1);
            return { ...state, rawRoot: normalize(nextRoot, NOTES_COUNT) };
        }
        case 'root/set': {
            return { ...state, rawRoot: action.rawValue };
        }
        case 'index/next': {
            return reduceIndex(state, true);
        }
        case 'index/prev': {
            return reduceIndex(state, false);
        }
        case 'index/set': {
            return { ...state, rawIndex: action.rawValue };
        }
        case 'tonics/next': {
            const nextState = reduceTonics(state, true);
            return { ...nextState, rawIndex: 0, rawMode: 0 };
        }
        case 'tonics/prev': {
            const nextState = reduceTonics(state, false);
            return { ...nextState, rawIndex: 0, rawMode: 0 };
        }
        case 'tonics/set': {
            return { ...state, rawTonics: action.rawValue };
        }
        case 'mode/next': {
            const [mode, maxMode] = selectModes(state);
            const nextMode = getNext(true, mode, maxMode);
            return { ...state, rawMode: normalize(nextMode, maxMode + 1) };
        }
        case 'mode/prev': {
            const [mode, maxMode] = selectModes(state);
            const nextMode = getNext(false, mode, maxMode);
            return { ...state, rawMode: normalize(nextMode, maxMode + 1) };
        }
        case 'mode/set': {
            return { ...state, rawMode: action.rawValue };
        }
        case 'shift/next': {
            return reduceShift(state, true);
        }
        case 'shift/prev': {
            return reduceShift(state, false);
        }
        case 'name/selected': {
            const [tonics] = selectTonics(state);
            const scale = getScaleByName(action.name, tonics);
            if (!scale) return state;
            const index = scale.baseIndex;
            const mode = scale.shift;
            if (isNaN(index) || isNaN(mode)) return state;

            return getRawValues(state, tonics, index, mode);
        }
        case 'intervals/selected': {
            const scale = getScaleByIntervals(action.intervals);
            if (!scale) return state;
            const index = scale.baseIndex;
            const mode = scale.shift;
            const tonics = scale.tones;
            if (isNaN(tonics) || isNaN(index) || isNaN(mode)) return state;
            return getRawValues(state, tonics, index, mode);
        }
        case 'settings/colorsEnabled': {
            const colorsEnabled = state.colorsEnabled;
            const nextState = { ...state, colorsEnabled: !colorsEnabled };
            return nextState;
        }
        default:
            return state;
    }
};
