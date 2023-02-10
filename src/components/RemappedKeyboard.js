import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-juce';
import { colors } from '../theme';
import OctaveKeyboard from './OctaveKeyboard';
import { getSelectedKeys } from '../store/utils';
import { notes, whiteNotes, notesPerOctave } from '../theory/chords/utils';

const KEYS_COUNT = notesPerOctave;

const fullColors = [
    '#cf3550',
    '#f55333',
    '#fd7033',
    '#ffa53e',
    '#ffc255',
    '#ffff00',
    '#d1d545',
    '#6da951',
    '#2191ce',
    '#4d6db5',
    '#564a9d',
    '#8c55a2',
];

class RemappedKeyboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { root, intervals, width, height, onKeyDown, colorsEnabled, remapEnabled } = this.props;
        const selected = getSelectedKeys(intervals, root);

        const indexes = [...Array(KEYS_COUNT * 2).keys()].map((i) => {
            const f = Math.floor(i / KEYS_COUNT);
            i = i % KEYS_COUNT;
            if (!whiteNotes.includes(i)) return;
            return (whiteNotes.indexOf(i) + f * whiteNotes.length) % selected.length;
        });

        const labels = indexes.map((i) => notes[selected[i]]);
        const keyColors = indexes.map((i) => {
            if (colorsEnabled) {
                if (i || i === 0) return fullColors[selected[i]];
            } else {
                if (i === 0) return colors.primary;
                if (i) return colors.secondaryBright;
            }
        });

        const getOctave = (labels, keyColors) => (
            <OctaveKeyboard
                width={width}
                height={height}
                colors={remapEnabled && keyColors}
                customLabels={labels}
                borderColor={colors.background}
                whiteColor={colors.white}
                blackColor={colors.black}
                onKeyDown={onKeyDown}
            />
        );

        return (
            <View>
                {getOctave(labels.slice(0, KEYS_COUNT), keyColors.slice(0, KEYS_COUNT))}
                {getOctave(labels.slice(KEYS_COUNT, KEYS_COUNT * 2), keyColors.slice(KEYS_COUNT, KEYS_COUNT * 2))}
            </View>
        );
    }
}

RemappedKeyboard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    root: PropTypes.number.isRequired,
    intervals: PropTypes.arrayOf(PropTypes.number.isRequired),
    onKeyDown: PropTypes.func.isRequired,
    colorsEnabled: PropTypes.bool,
    remapEnabled: PropTypes.bool
};

export default RemappedKeyboard;
