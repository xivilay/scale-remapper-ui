import PropTypes from 'prop-types';
import { Component } from 'react';
import { View } from 'react-native';
import { colors } from '../theme';
import OctaveKeyboard from './OctaveKeyboard';
import { getSelectedKeys } from '../store/utils';
import { notesPerOctave } from '@xivilay/music-theory';

const KEYS_COUNT = notesPerOctave;

class ScaleKeyboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { root, intervals, width, height, onKeyDown } = this.props;
        const selected = getSelectedKeys(intervals, root);

        const keyColors = [...Array(KEYS_COUNT * 2).fill(0)].map((v, i) => {
            if (root === i) return colors.primary;
            if (selected.includes(i)) return colors.secondaryBright;
        });

        const octave = (
            <OctaveKeyboard
                width={width}
                height={height}
                colors={keyColors}
                borderColor={colors.background}
                whiteColor={colors.white}
                blackColor={colors.black}
                onKeyDown={onKeyDown}
            />
        );

        return (
            <View style={{ flexDirection: 'row' }}>
                {octave}
                {octave}
            </View>
        );
    }
}

ScaleKeyboard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    root: PropTypes.number.isRequired,
    intervals: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    onKeyDown: PropTypes.func.isRequired,
};

export default ScaleKeyboard;
