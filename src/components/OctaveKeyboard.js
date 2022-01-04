import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Canvas, View } from 'react-juce';

const defaultColors = {
    white: '#edf2f4',
    black: '#8d99ae',
    border: '#2b2d42',
};

const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
const blackKeys = [1, 3, 6, 8, 10];
const whiteCount = whiteKeys.length;
const blackCount = blackKeys.length;
const totalCount = whiteCount + blackCount;

class OctaveKeyboard extends Component {
    constructor(props) {
        super(props);
    }

    getWhiteKeysEdges() {
        const { width: keyboardWidth, height: keyboardHeight } = this.props;
        const width = keyboardWidth / whiteCount;
        const height = keyboardHeight;
        const whiteKeysEdges = whiteKeys.map((n, i) => {
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
        const width = keyboardWidth / whiteKeys.length;
        const height = keyboardHeight;
        const blackKeysEdges = blackKeys.map((val) => {
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

    renderKeyText(ctx, zone, text) {
        const FONT_SIZE = 16;
        const FONT = `${FONT_SIZE}px monospace`;
        const [x0, y0, x1, y1] = zone;
        const center = [x0 + (x1 - x0) / 2, (y1 - y0) * 0.8];
        ctx.font = FONT;
        const height = FONT_SIZE;
        const width = FONT_SIZE * text.length;

        const [x, y] = center;
        ctx.beginPath();

        if (this.props.showLabelCircle) {
            ctx.fillStyle = defaultColors.white;
            ctx.moveTo(x, y);
            ctx.arc(x, y, (height / 5) * 3, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.fillStyle = defaultColors.border;
        ctx.fillText(text, x - width / 3, y + height / 3);
        ctx.closePath();
    }

    renderKeyboard(ctx) {
        const { width, height, colors, borderColor, whiteColor, blackColor, showLabels = true } = this.props;

        ctx.strokeStyle = borderColor || defaultColors.border;

        const whiteKeysEdges = this.getWhiteKeysEdges();
        const blackKeysEdges = this.getBlackKeysEdges();

        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        const drawKeys = (edges, keys, color) => {
            edges.forEach(([x0, y0, x1, y1], i) => {
                let fillStyle = color;
                const overrideColor = colors?.[keys[i]];
                if (overrideColor) fillStyle = overrideColor;

                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(x0, y1);
                ctx.lineTo(x1, y1);
                ctx.lineTo(x1, y0);
                ctx.fillStyle = fillStyle;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                if (showLabels) {
                    this.renderKeyText(ctx, [x0, y0, x1, y1], notes[keys[i]]);
                }
            });
        };

        ctx.clearRect(0, 0, width, height);

        drawKeys(whiteKeysEdges, whiteKeys, whiteColor || defaultColors.white);
        drawKeys(blackKeysEdges, blackKeys, blackColor || defaultColors.black);
    }

    getKey(e) {
        const { x, y } = e;
        const whiteKeysEdges = this.getWhiteKeysEdges();
        const blackKeysEdges = this.getBlackKeysEdges();
        const isBelong = ([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1;
        const black = blackKeysEdges.findIndex(isBelong);
        if (black >= 0) return blackKeys[black];
        const white = whiteKeysEdges.findIndex(isBelong);
        if (white >= 0) return whiteKeys[white];
    }

    render() {
        const { width, height, onKeyDown } = this.props;
        const onMouseDown = onKeyDown && ((e) => onKeyDown(this.getKey(e)));
        return (
            <View onMouseDown={onMouseDown}>
                <Canvas width={width} height={height} animate={true} onDraw={(ctx) => this.renderKeyboard(ctx)} />
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
    onKeyDown: PropTypes.func.isRequired,
    showLabels: PropTypes.bool,
    showLabelCircle: PropTypes.bool,
};

export default OctaveKeyboard;
