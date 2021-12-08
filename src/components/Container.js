import { connect } from 'react-redux';

import Component from './Scales';
import {
    getTonics,
    selectKnownNames,
    selectIndexes,
    selectModes,
    selectCurrent,
    selectSiblings,
} from '../store/selectors';

export const mapStateToProps = (state) => ({
    enabled: state.enabled,
    root: state.root,
    tonics: getTonics(state),
    modes: selectModes(state),
    indexes: selectIndexes(state),
    names: selectKnownNames(state),
    current: selectCurrent(state),
    siblings: selectSiblings(state),
});

export const mapDispatchToProps = (dispatch) => {
    return {
        nextRoot: () => dispatch({ type: 'root/next' }),
        prevRoot: () => dispatch({ type: 'root/prev' }),
        nextIndex: () => dispatch({ type: 'index/next' }),
        prevIndex: () => dispatch({ type: 'index/prev' }),
        nextMode: () => dispatch({ type: 'mode/next' }),
        prevMode: () => dispatch({ type: 'mode/prev' }),
        nextTonics: () => dispatch({ type: 'tonics/next' }),
        prevTonics: () => dispatch({ type: 'tonics/prev' }),
        selectName: (name) => dispatch({ type: 'name/selected', name }),
        selectIntervals: (intervals) => dispatch({ type: 'intervals/selected', intervals }),
        toggleEnabled: () => dispatch({ type: 'enabled/toggle' }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
