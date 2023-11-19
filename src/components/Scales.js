import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, Pressable, VirtualizedList, View } from 'react-native';
import { colors } from '../theme';
import ScaleKeyboard from './ScaleKeyboard';
import RemappedKeyboard from './RemappedKeyboard';
import { notes } from '../theory/chords/utils';

const ButtonWithText = ({text, color, callback}) => (
    <Pressable style={styles.button} onPress={callback}>
        <Text style={styles.text} color={color}>
            {text}
        </Text>
    </Pressable>
)

class Scales extends Component {
    renderClickableItem(text, color, callback) {
        return (
            <ButtonWithText text={text} callback={callback} color={color}/>
        );
    }

    renderToggle() {
        const { enabled, toggleEnabled } = this.props;
        const stateText = enabled ? 'On' : 'Off';
        const color = enabled ? colors.primary : colors.textInactive;
        return <ButtonWithText text={stateText} callback={toggleEnabled} color={color} />
    }

    renderBrowser() {
        const { names, current, selectName } = this.props;
        const currentIndex = names.indexOf(current.name);
        return (
            <View style={styles.listContainer}>
                <View style={styles.headingContainer}>
                    <Text style={styles.text}>{`Browser (${currentIndex + 1} of ${names.length})`}</Text>
                </View>
                <VirtualizedList
                    style={[ styles.list, styles.scrollableList]}
                    getItem={(_data, id) => names[id]}
                    getItemCount={() => names.length}
                    renderItem={({item}) => {
                        const color = item === current.name ? colors.primary : colors.text;
                        return this.renderClickableItem(item, color, () => selectName(item));
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
            <View style={styles.listContainer}>
                <View style={styles.headingContainer}>
                    <View style={styles.headingSubContainer}>
                        <Text style={styles.text}>Scale:</Text>
                        <View style={styles.buttonsContainer}>
                            <ButtonWithText text={'<'} callback={prevIndex}/>
                            <Text style={styles.text}>{`${currentIndex + 1} of ${maxIndex + 1}`}</Text>
                            <ButtonWithText text={'>'} callback={nextIndex}/>
                        </View>
                    </View>
                    <View style={styles.headingSubContainer}>
                        <Text style={styles.text}>{`Mode: `}</Text>
                        <View style={styles.buttonsContainer}>
                            <ButtonWithText text={'<'} callback={prevMode} />
                            <Text style={styles.text}>{`${+currentModeIndex + 1} of ${maxMode + 1}`}</Text>
                            <ButtonWithText text={'>'} callback={nextMode} />
                        </View>
                    </View>
                </View>
                <VirtualizedList
                    style={styles.list}
                    getItem={(_data, id) => siblings[id]}
                    getItemCount={() => siblings.length}
                    renderItem={({ item }) => {
                        const { name, id, intervals } = item;
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
        const info = [`Name: ${current.name || 'Unknown'}`, `Intervals: ${current.id}`];

        return (
            <View style={[styles.list, { height: 80, width: '100%', flexDirection: "column" }]}>
                {info.map((line, i) => (
                    <Text key={i} style={styles.text} color={colors.textInactive}>
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
        const [currentTonics] = tonics;
        const tonicsPostfix = tonicsMap[currentTonics] ? `(${tonicsMap[currentTonics]}tonic)` : '';
        return (
                <View style={styles.buttonsContainer}>
                    <Text style={styles.text}>Tones: </Text>
                    <ButtonWithText text={'<'} callback={prevTonics} />
                    <Text style={styles.text} color={colors.primary}>{`${currentTonics} `}</Text>
                    <ButtonWithText text={'>'} callback={nextTonics} />
                    <Text style={styles.text}>{`${tonicsPostfix}`}</Text>
                </View>
        );
    }

    renderRoot() {
        const { root, nextRoot, prevRoot } = this.props;
        const rootNote = notes[root];
        return (
                <View style={styles.buttonsContainer}>
                    <Text style={styles.text}>Root: </Text>
                    <ButtonWithText text={'<'} callback={prevRoot} />
                    <Text style={styles.text} color={colors.primary}>{`${rootNote}`}</Text>
                    <ButtonWithText text={'>'} callback={nextRoot} />
                </View>
        );
    }

    renderKeyboard() {
        return (
            <ScaleKeyboard
                style={styles.keyboard}
                root={this.props.root}
                intervals={this.props.current.intervals}
                onKeyDown={(keyIndex) => {
                    const { selectKey, current, root } = this.props;
                    selectKey(current.intervals, root, keyIndex);
                }}
            />
        );
    }

    renderShiftKeys() {
        return <View style={styles.buttonsContainer}>
            <ButtonWithText text={'<'} callback={this.props.prevShift} />
            <ButtonWithText text={'>'} callback={this.props.nextShift} />
        </View>
    }

    render() {
        return (
            <>
                {this.renderRoot()}
                <View style={styles.headingSubContainer}>
                    {this.renderTones()}
                    <View style={styles.buttonsContainer}>
                        <ButtonWithText text={'🔴'} callback={this.props.toggleColors} />
                        {this.renderToggle()}
                    </View>
                </View>
                <View>
                    <View style={styles.headingSubContainer}>
                        {this.renderBrowser()}
                        {this.renderModes()}
                    </View>
                </View>
                {this.renderInfo()}
                <View style={styles.headingSubContainer}>
                    <Text style={styles.text}>Original:</Text>
                    {this.renderShiftKeys()}
                </View>
                {this.renderKeyboard()}
                <Text style={styles.text}>Remapped:</Text>
                <RemappedKeyboard
                    style={styles.keyboard}
                    root={this.props.root}
                    intervals={this.props.current.intervals}
                    colorsEnabled={this.props.colorsEnabled}
                    remapEnabled={this.props.enabled}
                />
            </>
        );
    }
}

const styles = {
    scrollableList: {
        itemHeight: 25,
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
        height: '30%',
    },
    headingSubContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%"
    },
    buttonsContainer: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 25,
        color: colors.text,
        marginLeft: 5,
    },
    button: {
        minWidth: 'max-content'
    },
    keyboard: {
        width: 255,
        height: 100,
    },
};

Scales.propTypes = {
    enabled: PropTypes.bool.isRequired,
    root: PropTypes.number.isRequired,
    modes: PropTypes.array.isRequired,
    indexes: PropTypes.array.isRequired,
    tonics: PropTypes.arrayOf(PropTypes.number.isRequired),
    names: PropTypes.arrayOf(PropTypes.string.isRequired),
    current: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string.isRequired,
        intervals: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    }),
    siblings: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            intervals: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
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
    prevShift: PropTypes.func.isRequired,
    nextShift: PropTypes.func.isRequired,
    selectName: PropTypes.func.isRequired,
    selectIntervals: PropTypes.func.isRequired,
    selectKey: PropTypes.func.isRequired,
    toggleColors: PropTypes.func.isRequired,
    colorsEnabled: PropTypes.bool
};

export default Scales;
