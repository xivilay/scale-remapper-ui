import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { colors } from '../theme';
import OctaveKeyboard from './OctaveKeyboard';

const KEYS_COUNT = 12;

class ScaleKeyboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { root, intervals, width, height, onKeyDown } = this.props;
        const selected = intervals.reduce((acc, i) => {
            let last = acc[acc.length - 1];
            if (last == undefined) last = root;
            let next = last + parseInt(i);
            if (next >= KEYS_COUNT) next = next - KEYS_COUNT;
            acc.push(next);
            return acc;
        }, []);

        const keyColors = [...Array(12).keys()].map((i) => {
            if (root === i) return colors.primary;
            if (selected.includes(i)) return '#9196ff';
        });

        return (
            <OctaveKeyboard
                width={width}
                height={height}
                colors={keyColors}
                borderColor={colors.background}
                whiteColor={'#444444'}
                blackColor={'#333333'}
                onKeyDown={onKeyDown}
            />
        );
    }
}

ScaleKeyboard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    root: PropTypes.number.isRequired,
    intervals: PropTypes.arrayOf(PropTypes.number.isRequired),
    onKeyDown: PropTypes.func.isRequired,
};

export default ScaleKeyboard;
