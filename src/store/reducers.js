import { selectTonics, selectIndexes, selectModes } from '../store/selectors';
import { getScaleByName, getScaleByIntervals } from '../theory/scales/scale-db';

const NOTES_COUNT = 12;

const denormalize = (float, range) => Math.round(float * range);

const getNext = (forward, current, max, min = 0) => {
    let next = forward ? current + 1 : current - 1;
    const overLimit = forward ? next > max : next < min;
    if (overLimit) {
        next = forward ? min : max;
    }
    return next;
};

const reduceTonics = (state, forward, rawTonics) => {
    let nextTonics;
    const [tonics, maxTonics, minTonics] = selectTonics(state);
    const [mode] = selectModes(state);
    const [index] = selectIndexes(state);
    if (!isNaN(rawTonics)) {
        nextTonics = denormalize(rawTonics, maxTonics - minTonics) + minTonics;
        if (nextTonics > maxTonics) return state;
    } else {
        nextTonics = getNext(forward, tonics, maxTonics, minTonics);
    }
    let nextState = { ...state, tonics: nextTonics };
    const [, maxIndex] = selectIndexes(nextState);
    if (index > maxIndex) nextState = { ...nextState, index: maxIndex };
    const [, maxMode] = selectModes(nextState);
    if (mode > maxMode) nextState = { ...nextState, mode: maxMode };
    return nextState;
};

const reduceIndex = (state, forward, rawIndex) => {
    let nextIndex;
    const [index, maxIndex] = selectIndexes(state);
    if (!isNaN(rawIndex)) {
        nextIndex = denormalize(rawIndex, maxIndex);
        if (nextIndex > maxIndex) return state;
    } else {
        nextIndex = getNext(forward, index, maxIndex);
    }
    const [mode] = selectModes(state);
    let nextState = { ...state, index: nextIndex };
    const [, maxMode] = selectModes(nextState);
    if (mode > maxMode) nextState = { ...nextState, mode: maxMode };
    return nextState;
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
            const nextRoot = getNext(true, state.root, NOTES_COUNT - 1);
            return { ...state, root: nextRoot };
        }
        case 'root/prev': {
            const nextRoot = getNext(false, state.root, NOTES_COUNT - 1);
            return { ...state, root: nextRoot };
        }
        case 'root/set': {
            const nextRoot = denormalize(action.rawValue, NOTES_COUNT - 1);
            return { ...state, root: nextRoot };
        }
        case 'index/next': {
            return reduceIndex(state, true);
        }
        case 'index/prev': {
            return reduceIndex(state, false);
        }
        case 'index/set': {
            return reduceIndex(state, null, action.rawValue);
        }
        case 'tonics/next': {
            const nextState = reduceTonics(state, true);
            return { ...nextState, index: 0, mode: 0 };
        }
        case 'tonics/prev': {
            const nextState = reduceTonics(state, false);
            return { ...nextState, index: 0, mode: 0 };
        }
        case 'tonics/set': {
            const nextState = reduceTonics(state, null, action.rawValue);
            if (nextState.tonics === state.tonics) return state;
            return { ...nextState, index: 0, mode: 0 };
        }
        case 'mode/next': {
            const [mode, maxMode] = selectModes(state);
            const nextMode = getNext(true, mode, maxMode);
            return { ...state, mode: nextMode };
        }
        case 'mode/prev': {
            const [mode, maxMode] = selectModes(state);
            const nextMode = getNext(false, mode, maxMode);
            return { ...state, mode: nextMode };
        }
        case 'mode/set': {
            const [, maxMode] = selectModes(state);
            const nextMode = denormalize(action.rawValue, maxMode);
            if (nextMode > maxMode) return state;
            return { ...state, mode: nextMode };
        }
        case 'name/selected': {
            const [tonics] = selectTonics(state);
            const scale = getScaleByName(action.name, tonics);
            if (!scale) return state;
            const index = scale.baseIndex;
            const mode = scale.shift;
            if (isNaN(index) || isNaN(mode)) return state;
            return { ...state, tonics, index, mode };
        }
        case 'intervals/selected': {
            const scale = getScaleByIntervals(action.intervals);
            if (!scale) return state;
            const index = scale.baseIndex;
            const mode = scale.shift;
            const tonics = scale.tones;
            if (isNaN(tonics) || isNaN(index) || isNaN(mode)) return state;
            return { ...state, tonics, index, mode };
        }
        default:
            return state;
    }
};
