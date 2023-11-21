import { createStore } from 'redux';
import reducer from './reducers';

const createParametersStore = async () => {
    const preloadedState = {
        rawTonics: 0.54,
        rawIndex: 0,
        rawMode: 0.16,
        rawRoot: 0,
        enabled: true,
        colorsEnabled: true,
    };
    return createStore(reducer, preloadedState);
};

export default createParametersStore;
