import PropTypes from 'prop-types';
import { Component } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';
import { notes, whiteNotes, blackNotes, notesPerOctave } from '@xivilay/music-theory';

const defaultColors = {
    white: '#edf2f4',
    black: '#8d99ae',
    border: '#2b2d42',
};

const whiteCount = whiteNotes.length;
const totalCount = notesPerOctave;

class OctaveKeyboard extends Component {
    constructor(props) {
        super(props);
    }

    getWhiteKeysEdges() {
        const { width: keyboardWidth, height: keyboardHeight } = this.props;
        const width = keyboardWidth / whiteCount;
        const height = keyboardHeight;
        const whiteKeysEdges = whiteNotes.map((n, i) => {
            const x0 = i * width;
            const x1 = x0 + width;
            const y0 = 0;
            const y1 = height;
            return [x0, y0, x1, y1];
        });
        return whiteKeysEdges;
    }

    getBlackKeysEdges() {
        const { width: keyboardWidth, height: keyboardHeight } = this.props;
        const width = keyboardWidth / whiteCount;
        const height = keyboardHeight;
        const blackKeysEdges = blackNotes.map((val) => {
            const w = (width * 2) / 3;
            const n = (val * whiteCount) / totalCount;
            const x0 = n * width;
            const x1 = x0 + w;
            const y0 = 0;
            const y1 = (height / 3) * 2;
            return [x0, y0, x1, y1];
        });
        return blackKeysEdges;
    }

    renderKeyboard() {
        const { colors, borderColor, whiteColor, blackColor } = this.props;

        const strokeStyle = borderColor || defaultColors.border;

        const whiteKeysEdges = this.getWhiteKeysEdges();
        const blackKeysEdges = this.getBlackKeysEdges();

        const drawKeys = (edges, keys, color) => {
            return edges.map(([x0, y0, x1, y1], i) => {
                let fillStyle = color;
                const overrideColor = colors?.[keys[i]];
                if (overrideColor) fillStyle = overrideColor;
                return (
                    <Rect
                        key={color + i}
                        x={x0}
                        y={y0}
                        width={x1 - x0}
                        height={y1 - y0}
                        fill={fillStyle}
                        stroke={strokeStyle}
                        strokeWidth="1"
                    />
                );
            });
        };

        const whitePaths = drawKeys(whiteKeysEdges, whiteNotes, whiteColor || defaultColors.white);
        const blackPaths = drawKeys(blackKeysEdges, blackNotes, blackColor || defaultColors.black);
        return [...whitePaths, ...blackPaths];
    }

    renderKeyText() {
        const { showLabels = true, customLabels } = this.props;

        if (!showLabels) return;

        const whiteKeysEdges = this.getWhiteKeysEdges();
        const blackKeysEdges = this.getBlackKeysEdges();

        const drawKeys = (edges, keys) => {
            return edges.map(([x0, y0, x1, y1], i) => {
                let labelText = notes[keys[i]];
                if (customLabels) labelText = customLabels[keys[i]];
                if (!labelText) labelText = '';

                const FONT_SIZE = 16;
                const width = FONT_SIZE * labelText.length;
                return (
                    <Text
                        key={`${keys.length}-${i}`}
                        x={x0 - (x1 - x0) / 2 - width / 3}
                        y={y0 - (y1 - y0) * 0.1}
                        dx={x1 - x0}
                        dy={y1 - y0}
                        fill={defaultColors.border}
                        fontFamily="sans-serif, monospace"
                        fontSize={FONT_SIZE}
                        fontWeight={300}
                    >
                        {labelText}
                    </Text>
                );
            });
        };

        const whitePaths = drawKeys(whiteKeysEdges, whiteNotes);
        const blackPaths = drawKeys(blackKeysEdges, blackNotes);
        return [...whitePaths, ...blackPaths];
    }

    getKey(e) {
        const { offsetX, offsetY } = e.nativeEvent;
        const x = offsetX;
        const y = offsetY;
        const whiteKeysEdges = this.getWhiteKeysEdges();
        const blackKeysEdges = this.getBlackKeysEdges();
        const isBelong = ([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1;
        const black = blackKeysEdges.findIndex(isBelong);
        if (black >= 0) return blackNotes[black];
        const white = whiteKeysEdges.findIndex(isBelong);
        if (white >= 0) return whiteNotes[white];
    }

    render() {
        const { width, height, onKeyDown } = this.props;
        const onMouseDown = onKeyDown && ((e) => onKeyDown(this.getKey(e)));
        return (
            <View onMouseDown={onMouseDown}>
                <Svg width={width} height={height}>
                    {this.renderKeyboard()}
                    {this.renderKeyText()}
                </Svg>
            </View>
        );
    }
}

OctaveKeyboard.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    borderColor: PropTypes.string,
    whiteColor: PropTypes.string,
    blackColor: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string),
    onKeyDown: PropTypes.func,
    showLabels: PropTypes.bool,
    showLabelCircle: PropTypes.bool,
    customLabels: PropTypes.arrayOf(PropTypes.string),
};

export default OctaveKeyboard;
