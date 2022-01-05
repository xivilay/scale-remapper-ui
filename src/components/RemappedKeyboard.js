import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-juce';
import { colors } from '../theme';
import OctaveKeyboard from './OctaveKeyboard';

const KEYS_COUNT = 12;
const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

class ScaleKeyboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { root, intervals, width, height, onKeyDown } = this.props;
        const selected = intervals.reduce(
            (acc, i) => {
                let last = acc[acc.length - 1];
                let next = last + parseInt(i);
                if (next >= KEYS_COUNT) next = next - KEYS_COUNT;
                if (next !== root) acc.push(next);
                return acc;
            },
            [root]
        );

        const labels = [...Array(KEYS_COUNT * 2).keys()].map((i) => {
            const f = Math.floor(i / KEYS_COUNT);
            i = i % KEYS_COUNT;
            if (!whiteKeys.includes(i)) return;
            const index = (whiteKeys.indexOf(i) + f * whiteKeys.length) % selected.length;
            return notes[selected[index]];
        });

        const keyColors = [...Array(KEYS_COUNT * 2).keys()].map((i) => {
            const f = Math.floor(i / KEYS_COUNT);
            i = i % KEYS_COUNT;
            if (!whiteKeys.includes(i)) return;
            const index = (whiteKeys.indexOf(i) + f * whiteKeys.length) % selected.length;
            if (index === 0) return colors.primary;
            return '#9196ff';
        });

        const getOctave = (labels, colors) => (
            <OctaveKeyboard
                width={width}
                height={height}
                colors={colors}
                customLabels={labels}
                borderColor={colors.background}
                whiteColor={'#444444'}
                blackColor={'#333333'}
                onKeyDown={onKeyDown}
            />
        );

        return (
            <View>
                {getOctave(labels.slice(0, 12), keyColors.slice(0, 12))}
                {getOctave(labels.slice(12, 24), keyColors.slice(12, 24))}
            </View>
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
