import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-juce';
import { colors } from '../theme';
import OctaveKeyboard from './OctaveKeyboard';
import { getSelectedKeys } from '../store/utils';
import { notes, whiteNotes, notesPerOctave } from '../theory/chords/utils';

const KEYS_COUNT = notesPerOctave;

class ScaleKeyboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { root, intervals, width, height, onKeyDown } = this.props;
        const selected = getSelectedKeys(intervals, root);

        const indexes = [...Array(KEYS_COUNT * 2).keys()].map((i) => {
            const f = Math.floor(i / KEYS_COUNT);
            i = i % KEYS_COUNT;
            if (!whiteNotes.includes(i)) return;
            return (whiteNotes.indexOf(i) + f * whiteNotes.length) % selected.length;
        })

        const labels = indexes.map((i) => notes[selected[i]]);
        const keyColors = indexes.map((i) => {
            if (i === 0) return colors.primary;
            if (i) return '#9196ff';
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
                {getOctave(labels.slice(0, KEYS_COUNT), keyColors.slice(0, KEYS_COUNT))}
                {getOctave(labels.slice(KEYS_COUNT, KEYS_COUNT * 2), keyColors.slice(KEYS_COUNT, KEYS_COUNT * 2))}
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
