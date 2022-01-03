import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, Button, ListView, View } from 'react-juce';
import { colors } from '../theme';
import OctaveKeyboard from './OctaveKeyboard';

class Scales extends Component {
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
        const { enabled, toggleEnabled } = this.props;
        const stateText = enabled ? 'On' : 'Off';
        const color = enabled ? colors.primary : colors.textInactive;
        return (
            <Button {...styles.button} onClick={toggleEnabled}>
                <Text {...styles.text} color={color}>
                    {stateText}
                </Text>
            </Button>
        );
    }

    renderBrowser() {
        const { names, current, selectName } = this.props;
        const currentIndex = names.indexOf(current.name);
        // hack list view incorrectly renders items height
        const scrollableList = names.length > 12 ? styles.scrollableList : {};
        return (
            <View {...styles.listContainer}>
                <View {...styles.headingContainer}>
                    <Text {...styles.text}>{`Browser (${currentIndex + 1} of ${names.length})`}</Text>
                </View>
                <ListView
                    {...styles.list}
                    {...scrollableList}
                    data={names}
                    renderItem={(name) => {
                        const color = name === current.name ? colors.primary : colors.text;
                        return this.renderClickableItem(name, color, () => selectName(name));
                    }}
                />
            </View>
        );
    }

    renderModes() {
        const { current, indexes, modes, siblings, nextMode, prevMode, nextIndex, prevIndex, selectIntervals } =
            this.props;
        const [currentIndex, maxIndex] = indexes;
        const [currentModeIndex, maxMode] = modes;
        return (
            <View {...styles.listContainer}>
                <View {...styles.headingContainer}>
                    <View {...styles.headingSubContainer}>
                        <Text {...styles.text}>Scale:</Text>
                        <View>
                            <Button onClick={prevIndex}>
                                <Text {...styles.text}>{'<'}</Text>
                            </Button>
                            <Text {...styles.text}>{`${currentIndex + 1} of ${maxIndex + 1}`}</Text>
                            <Button onClick={nextIndex}>
                                <Text {...styles.text}>{'>'}</Text>
                            </Button>
                        </View>
                    </View>
                    <View {...styles.headingSubContainer}>
                        <Text {...styles.text}>{`Mode: `}</Text>
                        <View>
                            <Button onClick={prevMode}>
                                <Text {...styles.text}>{'<'}</Text>
                            </Button>
                            <Text {...styles.text}>{`${+currentModeIndex + 1} of ${maxMode + 1}`}</Text>
                            <Button onClick={nextMode}>
                                <Text {...styles.text}>{'>'}</Text>
                            </Button>
                        </View>
                    </View>
                </View>
                <ListView
                    {...styles.list}
                    data={siblings}
                    renderItem={({ name, id, intervals }) => {
                        let color = colors.text;
                        if (id === current.id) {
                            color = colors.primary;
                        } else if (name === 'Unknown') {
                            color = colors.textInactive;
                        }
                        return this.renderClickableItem(name, color, () => selectIntervals(intervals));
                    }}
                />
            </View>
        );
    }

    renderInfo() {
        const { current } = this.props;
        const info = [`Name: ${current.name}`, `Intervals: ${current.id}`];

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
            1: 'Mono',
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
        const { tonics, nextTonics, prevTonics } = this.props;
        const tonicsPostfix = tonicsMap[tonics] ? `(${tonicsMap[tonics]}tonic)` : '';
        return (
            <View {...styles.headingSubContainer}>
                <Text {...styles.text}>Tones: </Text>
                <View>
                    <Button onClick={prevTonics}>
                        <Text {...styles.text}>{'<'}</Text>
                    </Button>
                    <Text {...styles.text}>{`${tonics} `}</Text>
                    <Button onClick={nextTonics}>
                        <Text {...styles.text}>{'>'}</Text>
                    </Button>
                    <Text {...styles.text}>{`${tonicsPostfix}`}</Text>
                </View>
            </View>
        );
    }

    renderRoot() {
        const { root, nextRoot, prevRoot } = this.props;
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootNote = notes[root];
        return (
            <View {...styles.headingSubContainer}>
                <Text {...styles.text}>Root: </Text>
                <View>
                    <Button onClick={prevRoot}>
                        <Text {...styles.text}>{'<'}</Text>
                    </Button>
                    <Text {...styles.text}>{`${rootNote}`}</Text>
                    <Button onClick={nextRoot}>
                        <Text {...styles.text}>{'>'}</Text>
                    </Button>
                </View>
            </View>
        );
    }

    handleKeyDown(keyIndex) {
        const { selectKey, current, root } = this.props;
        selectKey(current.intervals, root, keyIndex);
    }

    render() {
        return (
            <>
                {this.renderRoot()}
                <View {...styles.headingSubContainer} width="100%">
                    {this.renderTones()}
                    {this.renderToggle()}
                </View>
                <View>
                    <View {...styles.headingSubContainer} width="100%">
                        {this.renderBrowser()}
                        {this.renderModes()}
                    </View>
                </View>
                {this.renderInfo()}
                <OctaveKeyboard 
                    width={250}
                    height={100}
                    root={this.props.root}
                    intervals={this.props.current.intervals}
                    onKeyDown={(key) => this.handleKeyDown(key)}
                />
            </>
        );
    }
}

const styles = {
    scrollableList: {
        itemHeight: 13, // 4
    },
    list: {
        height: 250,
        borderWidth: 3,
        borderColor: colors.secondary,
        borderRadius: 3,
        overflowX: 'hidden',
        marginBottom: 5,
        itemHeight: 25,
    },
    listContainer: {
        height: 300,
        width: 250,
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
        color: colors.text,
        marginLeft: 5,
    },
    button: {
        height: 50,
    },
};

Scales.propTypes = {
    enabled: PropTypes.bool.isRequired,
    root: PropTypes.number.isRequired,
    modes: PropTypes.array.isRequired,
    indexes: PropTypes.array.isRequired,
    tonics: PropTypes.number.isRequired,
    names: PropTypes.arrayOf(PropTypes.string.isRequired),
    current: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number.isRequired),
    }),
    siblings: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            intervals: PropTypes.arrayOf(PropTypes.number.isRequired),
        })
    ),
    toggleEnabled: PropTypes.func.isRequired,
    nextRoot: PropTypes.func.isRequired,
    prevRoot: PropTypes.func.isRequired,
    nextIndex: PropTypes.func.isRequired,
    prevIndex: PropTypes.func.isRequired,
    nextMode: PropTypes.func.isRequired,
    prevMode: PropTypes.func.isRequired,
    nextTonics: PropTypes.func.isRequired,
    prevTonics: PropTypes.func.isRequired,
    selectName: PropTypes.func.isRequired,
    selectIntervals: PropTypes.func.isRequired,
    selectKey: PropTypes.func.isRequired,
};

export default Scales;
