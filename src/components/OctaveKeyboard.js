import React, { Component } from 'react';
import { Canvas, View } from 'react-juce';
import { colors } from '../theme';

const keyColors = {
    root: colors.primary,
    active: '#9196ff',
    white: '#444444',
    black: '#333333',
    border: colors.background,
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

    renderKeyboard(ctx) {
        const { root, intervals, width, height } = this.props;

        const selected = intervals.reduce((acc, i) => {
            let last = acc[acc.length - 1];
            if (last == undefined) last = root;
            let next = last + parseInt(i);
            if (next >= totalCount) next = next - totalCount;
            acc.push(next);
            return acc;
        }, []);

        ctx.strokeStyle = keyColors.border;

        const whiteKeysEdges = this.getWhiteKeysEdges();
        const blackKeysEdges = this.getBlackKeysEdges();

        const drawKeys = (edges, keys, color) => {
            edges.forEach(([x0, y0, x1, y1], i) => {
                const isRoot = root === keys[i];
                const isInScale = selected.includes(keys[i]);
                let fillStyle = color;
                if (isInScale) fillStyle = keyColors.active;
                if (isRoot) fillStyle = keyColors.root;

                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(x0, y1);
                ctx.lineTo(x1, y1);
                ctx.lineTo(x1, y0);
                ctx.fillStyle = fillStyle;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            });
        };

        ctx.clearRect(0, 0, width, height);

        drawKeys(whiteKeysEdges, whiteKeys, keyColors.white);
        drawKeys(blackKeysEdges, blackKeys, keyColors.black);
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
        const { width, height, root, intervals, onKeyDown } = this.props;
        return (
            <View onMouseDown={(e) => onKeyDown(this.getKey(e))}>
                <Canvas width={width} height={height} animate={true} onDraw={(ctx) => this.renderKeyboard(ctx)} />
            </View>
        );
    }
}

export default OctaveKeyboard;
