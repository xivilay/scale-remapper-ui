import { createStore } from 'redux';
import reducer from './reducers';
import { EventBridge } from 'react-juce';
import { setParameterValueNotifyingHost } from '../natives';
import { selectCurrent } from '../store/selectors';
import { notesPerOctave } from '../theory/chords/utils';
import { normalize } from './utils';

const NOTES_COUNT = notesPerOctave;

const getStoreUpdateHandler = (store) => {
    let prevState;
    return () => {
        const state = store.getState();
        const { rawTonics, rawIndex, rawMode, rawRoot, enabled } = state;
        const paramsToUpdate = [];

        if (prevState) {
            const prevTonics = prevState.rawTonics;
            const prevIndex = prevState.rawIndex;
            const prevMode = prevState.rawMode;
            const prevEnabled = prevState.enabled;
            const prevRoot = prevState.rawRoot;
            if (prevTonics !== rawTonics) paramsToUpdate.push('tonics');
            if (prevIndex !== rawIndex) paramsToUpdate.push('index');
            if (prevMode !== rawMode) paramsToUpdate.push('mode');
            if (prevEnabled !== enabled) paramsToUpdate.push('enabled');
            if (prevRoot !== rawRoot) paramsToUpdate.push('root');
        } else {
            paramsToUpdate.push(...[`index`, `mode`, `tonics`, `enabled`, `root`]);
        }

        if (paramsToUpdate.includes('enabled')) {
            setParameterValueNotifyingHost('transformEnabled', enabled);
        }
        if (paramsToUpdate.includes('root')) {
            setParameterValueNotifyingHost(`root`, rawRoot);
        }
        if (paramsToUpdate.includes('tonics')) {
            setParameterValueNotifyingHost(`tonics`, rawTonics);
        }
        if (paramsToUpdate.includes('index')) {
            setParameterValueNotifyingHost(`index`, rawIndex);
        }
        if (paramsToUpdate.includes('mode')) {
            setParameterValueNotifyingHost(`mode`, rawMode);
        }
        if (paramsToUpdate.includes('tonics') || paramsToUpdate.includes('index') || paramsToUpdate.includes('mode')) {
            const { intervals } = selectCurrent(state);
            intervals.forEach((val, i) => {
                setParameterValueNotifyingHost(`interval${i}`, normalize(val - 1, NOTES_COUNT));
            });
        }

        prevState = state;
    };
};

const getParameterValueChangeHandler = (dispatch) => (index, changedParamId, defaultValue, rawValue) => {
    switch (changedParamId) {
        case 'transformEnabled':
            return dispatch({ type: 'enabled/set', value: !!rawValue });
        case 'root':
            return dispatch({ type: 'root/set', rawValue });
        case 'mode':
            return dispatch({ type: 'mode/set', rawValue });
        case 'index':
            return dispatch({ type: 'index/set', rawValue });
        case 'tonics':
            return dispatch({ type: 'tonics/set', rawValue });
    }
};

const retrieveInitialParameters = () => {
    const expectedParams = ['tonics', 'index', 'mode', 'root', 'transformEnabled'];
    let restoredParams = {};
    const isRestored = () => expectedParams.every((key) => Object.keys(restoredParams).includes(key));

    return new Promise((resolve) => {
        const setupInitialParameters = (index, changedParamId, defaultValue, currentValue) => {
            if (isRestored()) {
                EventBridge.removeListener('parameterValueChange', setupInitialParameters);
                resolve(restoredParams);
            } else {
                restoredParams[changedParamId] = currentValue;
            }
        };
        EventBridge.addListener('parameterValueChange', setupInitialParameters);
    });
};

const getInitialStateFromRaw = (rawState) => {
    const { tonics, index, mode, root, transformEnabled } = rawState;

    return { enabled: transformEnabled, rawRoot: root, rawTonics: tonics, rawIndex: index, rawMode: mode };
};

const createParametersStore = async () => {
    const restoredRawParams = await retrieveInitialParameters();

    const defaultState = getInitialStateFromRaw(restoredRawParams);
    const store = createStore(reducer, defaultState);

    const { dispatch, subscribe } = store;

    const storeUpdateHandler = getStoreUpdateHandler(store);
    const parameterValueChangeHandler = getParameterValueChangeHandler(dispatch);

    subscribe(storeUpdateHandler);
    EventBridge.addListener('parameterValueChange', parameterValueChangeHandler);

    return store;
};

export default createParametersStore;
