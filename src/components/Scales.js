import React, { Component } from 'react';
import { EventBridge, Text, Button, ListView, View } from 'react-juce';
import { setParameterValueNotifyingHost } from '../natives';
import {
    getNamesList,
    getScaleByName,
    getScale,
    getScaleByIntervals,
    getModesCount,
    getScalesCount,
} from '../theory/scales/scale-db';

const BASE_SCALE_NAME = 'Ionian';

const notesCount = 12;
const minTones = 3;
const maxTones = 9;

const normalize = (int, range) => {
    if (range === 1) return int === 0 ? 0 : 1;
    return int / (range - 1);
}
const denormalize = (float, range) => Math.round(float * (range - 1));

class Scales extends Component {
    constructor(props) {
        super(props);

        this._onParameterValueChange = this._onParameterValueChange.bind(this);
        this._changeScale = this._changeScale.bind(this);

        this.state = {
            enabled: 'On',
            currentScale: getScaleByName(BASE_SCALE_NAME),
        };
    }

    componentDidMount() {
        EventBridge.addListener('parameterValueChange', this._onParameterValueChange);
    }

    componentWillUnmount() {
        EventBridge.removeListener('parameterValueChange', this._onParameterValueChange);
    }

    _onParameterValueChange(index, changedParamId, defaultValue, currentValue, stringValue) {
        if (changedParamId === 'index') {
            this.setState((prevState) => {
                const tonicsCount = prevState.currentScale?.tones;
                const nextIndex = denormalize(currentValue, getScalesCount(tonicsCount, notesCount));
                const prevIndex = prevState.currentScale?.baseIndex;
                if (prevIndex !== nextIndex) {
                    this._changeScale({ index: nextIndex });
                }
            });
        }
        if (changedParamId === 'mode') {
            this.setState((prevState) => {
                const prevMode = prevState.currentScale?.shift;
                const tonicsCount = prevState.currentScale?.tones;
                const modesCount = getModesCount(tonicsCount, prevMode, notesCount);
                const nextMode = denormalize(currentValue, modesCount);
                if (prevMode !== nextMode) {
                    this._changeScale({ mode: nextMode });
                }
            });
        }
        if (changedParamId === 'tonics') {
            this.setState((prevState) => {
                const prevTonics = prevState.currentScale?.tones;
                const nextTonics = parseInt(stringValue);
                if (prevTonics != nextTonics) {
                    this._changeScale({ tonics: nextTonics });
                }
            });
        }
    }

    _changeScale({ name, intervals, index, mode, tonics }) {
        this.setState((prevState) => {
            const tonicsCount = prevState.currentScale?.tones;
            let scale;
            if (name) {
                scale = getScaleByName(name, tonicsCount);
            } else if (intervals) {
                scale = getScaleByIntervals(intervals);
            } else if (tonics) {
                scale = getScale(tonics, 0, 0, notesCount);
            } else {
                const prevIndex = prevState.currentScale?.baseIndex;
                const prevMode = prevState.currentScale?.shift;
                if (index == undefined) index = prevIndex;
                if (mode == undefined) mode = prevMode;
                const modesCount = getModesCount(tonicsCount, index, notesCount);
                if (mode >= modesCount) mode = 0;
                scale = getScale(tonicsCount, index, mode, notesCount);
            }
            if (!scale) return;
            this._changeHostParams(scale, prevState.currentScale);
            return { currentScale: scale };
        });
    }

    _changeHostParams(scale, prevScale) {
        const keysCount = notesCount;
        if (scale.baseIndex !== prevScale?.baseIndex) {
            setParameterValueNotifyingHost(
                `index`,
                normalize(scale.baseIndex, getScalesCount(scale.tones, notesCount))
            );
        }
        if (scale.shift !== prevScale?.shift) {
            setParameterValueNotifyingHost(
                `mode`,
                normalize(scale.shift, getModesCount(scale.tones, scale.shift, notesCount))
            );
        }
        if (scale.tones !== prevScale?.tones) {
            setParameterValueNotifyingHost(`tonics`, normalize(scale.tones - minTones, maxTones - minTones + 1));
        }

        scale.intervals.forEach((val, i) => {
            setParameterValueNotifyingHost(`interval${i}`, normalize(val - 1, keysCount));
        });
    }

    renderClickableItem(text, color, callback) {
        return (
            <Button {...styles.button} onClick={callback}>
                <Text {...styles.text} color={color}>
                    {text}
                </Text>
            </Button>
        );
    }

    renderToggle() {
        const stateText = this.state.enabled;
        const isOn = stateText === 'On';
        const callback = () => {
            setParameterValueNotifyingHost('transformEnabled', !isOn);
        };
        const color = isOn ? colors.textActive : colors.textInactive;
        return (
            <Button {...styles.button} onClick={callback}>
                <Text {...styles.text} color={color}>
                    {stateText}
                </Text>
            </Button>
        );
    }

    renderBrowser() {
        const currentName = this.state.currentScale?.name;
        const tonicsCount = this.state.currentScale?.tones;
        const namesList = getNamesList(tonicsCount).sort((a, b) => {
            const getIndex = (a) => parseInt(a.substring(0, a.indexOf(':')));
            return getIndex(a) - getIndex(b);
        });
        const currentIndex = namesList.indexOf(currentName);
        // hack list view incorrectly renders items height
        const scrollableList = namesList.length > 12 ? styles.scrollableList : {};
        return (
            <View {...styles.listContainer}>
                <View {...styles.headingContainer}>
                    <Text {...styles.text}>{`Browser (${currentIndex + 1} of ${namesList.length})`}</Text>
                </View>
                <ListView
                    {...styles.list}
                    {...scrollableList}
                    data={namesList}
                    renderItem={(item) => {
                        const color = item === currentName ? colors.textActive : colors.text;
                        return this.renderClickableItem(item, color, () => {
                            this._changeScale({ name: item });
                        });
                    }}
                />
            </View>
        );
    }

    renderModes() {
        const { currentScale } = this.state;
        const currentIndex = currentScale?.baseIndex;
        const tonicsCount = currentScale?.tones;
        const scalesCount = getScalesCount(tonicsCount, notesCount);
        const modesCount = getModesCount(tonicsCount, currentIndex, notesCount);
        const currentModeIndex = currentScale?.shift;
        const getHandler = (index, count, property, forward) => () => {
            let next = forward ? index + 1 : index - 1;
            const overLimit = forward ? next > count - 1 : next < 0;
            if (overLimit) next = forward ? 0 : count - 1;
            this._changeScale({ [property]: next });
        };
        return (
            currentScale && (
                <View {...styles.listContainer}>
                    <View {...styles.headingContainer}>
                        <View {...styles.headingSubContainer}>
                            <Text {...styles.text}>Scale:</Text>
                            <View>
                                <Button onClick={getHandler(currentIndex, scalesCount, 'index', false)}>
                                    <Text {...styles.text}>{'<'}</Text>
                                </Button>
                                <Text {...styles.text}>{`${currentIndex + 1} of ${scalesCount}`}</Text>
                                <Button onClick={getHandler(currentIndex, scalesCount, 'index', true)}>
                                    <Text {...styles.text}>{'>'}</Text>
                                </Button>
                            </View>
                        </View>
                        <View {...styles.headingSubContainer}>
                            <Text {...styles.text}>{`Mode: `}</Text>
                            <View>
                                <Button onClick={getHandler(currentModeIndex, modesCount, 'mode', false)}>
                                    <Text {...styles.text}>{'<'}</Text>
                                </Button>
                                <Text {...styles.text}>{`${+currentModeIndex + 1} of ${modesCount}`}</Text>
                                <Button onClick={getHandler(currentModeIndex, modesCount, 'mode', true)}>
                                    <Text {...styles.text}>{'>'}</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                    <ListView
                        {...styles.list}
                        data={currentScale.generateIntervals()}
                        renderItem={(intervals) => {
                            const scale = getScaleByIntervals(intervals);
                            const id = scale.intervals.join(' ');
                            const currentId = currentScale.intervals.join(' ');
                            const name = scale.name || 'Unknown';
                            let color = colors.text;
                            if (id === currentId) {
                                color = colors.textActive;
                            } else if (name === 'Unknown') {
                                color = colors.textInactive;
                            }
                            return this.renderClickableItem(name, color, () => {
                                this._changeScale({ name: scale.name, intervals });
                            });
                        }}
                    />
                </View>
            )
        );
    }

    renderInfo() {
        const { currentScale } = this.state;
        if (!currentScale) return;
        const info = [`Name: ${currentScale.name}`, `Intervals: ${currentScale.intervals.join(' ')}`];

        return (
            <View {...styles.list} height={60} width={'100%'} flexDirection="column">
                {info.map((line, i) => (
                    <Text key={i} {...styles.text} color={colors.textInactive}>
                        {line}
                    </Text>
                ))}
            </View>
        );
    }

    renderTones() {
        const tonicsMap = {
            2: 'Dia',
            3: 'Tri',
            4: 'Tetra',
            5: 'Penta',
            6: 'Hexa',
            7: 'Hepta',
            8: 'Octa',
            9: 'Nona',
            10: 'Deca',
        };
        const { currentScale } = this.state;
        const tonics = currentScale.tones;
        const getNextTonics = (forward, tonics) => {
            let next = forward ? tonics + 1 : tonics - 1;
            const overflowCondition = forward ? next > maxTones : next < minTones;
            if (overflowCondition) {
                next = forward ? minTones : maxTones;
            }
            return next;
        };
        const tonicsPostfix = tonicsMap[tonics] ? `(${tonicsMap[tonics]}tonic)` : '';
        return (
            <View {...styles.headingSubContainer}>
                <Text {...styles.text}>Tones: </Text>
                <View>
                    <Button
                        onClick={() => {
                            this._changeScale({ tonics: getNextTonics(false, tonics) });
                        }}
                    >
                        <Text {...styles.text}>{'<'}</Text>
                    </Button>
                    <Text {...styles.text}>{`${tonics} `}</Text>
                    <Button
                        onClick={() => {
                            this._changeScale({ tonics: getNextTonics(true, tonics) });
                        }}
                    >
                        <Text {...styles.text}>{'>'}</Text>
                    </Button>
                    <Text {...styles.text}>{`${tonicsPostfix}`}</Text>
                </View>
            </View>
        );
    }

    render() {
        const { currentScale } = this.state;
        if (!currentScale) return null;
        return (
            <>
                <View {...styles.headingSubContainer} width="100%">
                    {this.renderTones()}
                    {this.renderToggle()}
                </View>
                <View>
                    {this.renderBrowser()}
                    {this.renderModes()}
                </View>
                {this.renderInfo()}
            </>
        );
    }
}

const colors = {
    outline: '#9196ff',
    detail: '#ff9000',
    textActive: '#86c400',
    textInactive: '#aaaaaa',
    text: '#dddddd',
};

const styles = {
    scrollableList: {
        itemHeight: 13, // 4
    },
    list: {
        height: 250,
        borderWidth: 3,
        borderColor: colors.outline,
        borderRadius: 3,
        overflowX: 'hidden',
        marginBottom: 5,
        itemHeight: 25,
    },
    listContainer: {
        height: 300,
        width: '50%',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    headingContainer: {
        flexDirection: 'column',
        height: '20%',
    },
    headingSubContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 25,
        color: '#dddddd',
        marginLeft: 5,
    },
    button: {
        height: 50,
    },
};

export default Scales;
