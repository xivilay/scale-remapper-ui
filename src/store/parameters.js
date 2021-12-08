import { createStore } from 'redux';
import reducer from './reducers';
import { EventBridge } from 'react-juce';
import { setParameterValueNotifyingHost } from '../natives';
import { selectTonics, selectIndexes, selectModes, selectCurrent } from '../store/selectors';

const normalize = (int, range) => {
    if (range === 1) return int === 0 ? 0 : 1;
    return int / (range - 1);
};

const NOTES_COUNT = 12;

const defaultState = { tonics: 7, index: 0, mode: 5, root: 0, enabled: true };
const store = createStore(reducer, defaultState);

const { dispatch, subscribe } = store;

const parameterValueChangeHandler = (index, changedParamId, defaultValue, currentValue) => {
    switch (changedParamId) {
        case 'transformEnabled':
            return dispatch({ type: 'enabled/set', value: !!currentValue });
        case 'root':
            return dispatch({ type: 'root/set', rawValue: currentValue });
        case 'mode':
            return dispatch({ type: 'mode/set', rawValue: currentValue });
        case 'index':
            return dispatch({ type: 'index/set', rawValue: currentValue });
        case 'tonics':
            return dispatch({ type: 'tonics/set', rawValue: currentValue });
    }
};

EventBridge.addListener('parameterValueChange', parameterValueChangeHandler);
// EventBridge.removeListener('parameterValueChange', parameterValueChangeHandler);

let prevState;
subscribe(() => {
    const state = store.getState();
    const [tonics, maxTonics, minTonics] = selectTonics(state);
    const [index, maxIndex] = selectIndexes(state);
    const [mode, maxMode] = selectModes(state);
    const { enabled, root } = state;
    const paramsToUpdate = [];
    if (prevState) {
        const prevTonics = selectTonics(prevState)[0];
        const prevIndex = selectIndexes(prevState)[0];
        const prevMode = selectModes(prevState)[0];
        const prevEnabled = prevState.enabled;
        const prevRoot = prevState.root;
        if (prevTonics !== tonics) paramsToUpdate.push('tonics');
        if (prevIndex !== index) paramsToUpdate.push('index');
        if (prevMode !== mode) paramsToUpdate.push('mode');
        if (prevEnabled !== enabled) paramsToUpdate.push('enabled');
        if (prevRoot !== root) paramsToUpdate.push('root');
    } else {
        paramsToUpdate.push(...[`index`, `mode`, `tonics`, `enabled`, `root`]);
    }

    if (paramsToUpdate.includes('enabled')) {
        setParameterValueNotifyingHost('transformEnabled', enabled);
    }
    if (paramsToUpdate.includes('root')) {
        setParameterValueNotifyingHost(`root`, normalize(root, NOTES_COUNT));
    }
    if (paramsToUpdate.includes('tonics')) {
        setParameterValueNotifyingHost(`tonics`, normalize(tonics - minTonics, maxTonics - minTonics + 1));
    }
    if (paramsToUpdate.includes('index')) {
        setParameterValueNotifyingHost(`index`, normalize(index, maxIndex + 1));
    }
    if (paramsToUpdate.includes('mode')) {
        setParameterValueNotifyingHost(`mode`, normalize(mode, maxMode + 1));
    }
    if (paramsToUpdate.includes('tonics') || paramsToUpdate.includes('index') || paramsToUpdate.includes('mode')) {
        const { intervals } = selectCurrent(state);
        intervals.forEach((val, i) => {
            setParameterValueNotifyingHost(`interval${i}`, normalize(val - 1, NOTES_COUNT));
        });
    }

    prevState = state;
});

export default store;
