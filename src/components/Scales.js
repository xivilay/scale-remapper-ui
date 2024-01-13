import PropTypes from 'prop-types';
import { Component } from 'react';
import { Text, View } from 'react-native';
import styles from '../styles';
import { colors } from '../theme'; // TODO: replace with styles
import ScaleKeyboard from './ScaleKeyboard';
import RemappedKeyboard from './RemappedKeyboard';
import { ButtonWithText } from './ButtonWithText';
import { ButtonWithIcon } from './ButtonWithIcon';
import { ScrollableList } from './ScrollableList';
import { notes } from '@xivilay/music-theory';

import paletteIcon from '../assets/palette.svg';

class Scales extends Component {
    renderClickableItem(text, color, callback, props = {}) {
        return <ButtonWithText text={text} callback={callback} color={color} props={props} />;
    }

    renderToggle() {
        const { enabled, toggleEnabled } = this.props;
        const stateText = enabled ? 'On' : 'Off';
        const color = enabled ? colors.primary : colors.textInactive;
        return <ButtonWithText text={stateText} callback={toggleEnabled} color={color} />;
    }

    renderBrowser() {
        const { names, current, selectName } = this.props;
        const currentIndex = names.indexOf(current.name);
        return (
            <View {...styles.listContainer}>
                <View {...styles.headingContainer}>
                    <Text {...styles.text}>{`Browser (${currentIndex + 1} of ${names.length})`}</Text>
                </View>
                <ScrollableList
                    keyExtractor={(item) => item}
                    data={names}
                    renderItem={(item, index, props) => {
                        const color = item === current.name ? colors.primary : colors.text;
                        return this.renderClickableItem(item, color, () => selectName(item), {
                            width: '100%',
                            ...props,
                        });
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
                        <View {...styles.buttonsContainer}>
                            <ButtonWithText text={'<'} callback={prevIndex} />
                            <Text {...styles.text}>{`${currentIndex + 1} of ${maxIndex + 1}`}</Text>
                            <ButtonWithText text={'>'} callback={nextIndex} />
                        </View>
                    </View>
                    <View {...styles.headingSubContainer}>
                        <Text {...styles.text}>{`Mode: `}</Text>
                        <View {...styles.buttonsContainer}>
                            <ButtonWithText text={'<'} callback={prevMode} />
                            <Text {...styles.text}>{`${+currentModeIndex + 1} of ${maxMode + 1}`}</Text>
                            <ButtonWithText text={'>'} callback={nextMode} />
                        </View>
                    </View>
                </View>
                <ScrollableList
                    keyExtractor={(item) => item.id}
                    data={siblings}
                    renderItem={(item) => {
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
            <View {...styles.info}>
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
        const [currentTonics] = tonics;
        const tonicsPostfix = tonicsMap[currentTonics] ? `(${tonicsMap[currentTonics]}tonic)` : '';
        return (
            <View {...styles.buttonsContainer}>
                <Text {...styles.text}>Tones: </Text>
                <ButtonWithText text={'<'} callback={prevTonics} />
                <Text {...{ ...styles.text, color: colors.primary }}>{`${currentTonics} `}</Text>
                <ButtonWithText text={'>'} callback={nextTonics} />
                <Text {...styles.text}>{`${tonicsPostfix}`}</Text>
            </View>
        );
    }

    renderRoot() {
        const { root, nextRoot, prevRoot } = this.props;
        const rootNote = notes[root];
        return (
            <View {...styles.buttonsContainer}>
                <Text {...styles.text}>Root: </Text>
                <ButtonWithText text={'<'} callback={prevRoot} />
                <Text {...{ ...styles.text, color: colors.primary }}>{`${rootNote}`}</Text>
                <ButtonWithText text={'>'} callback={nextRoot} />
            </View>
        );
    }

    renderKeyboard() {
        return (
            <ScaleKeyboard
                width={255}
                height={100}
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
        return (
            <View {...styles.buttonsContainer}>
                <ButtonWithText text={'<'} callback={this.props.prevShift} />
                <ButtonWithText text={'>'} callback={this.props.nextShift} />
            </View>
        );
    }

    render() { 
        return (
            <>
                {this.renderRoot()}
                <View {...styles.partContainer}>
                    {this.renderTones()}
                    <View {...styles.buttonsContainer}>
                        <ButtonWithIcon source={paletteIcon} callback={this.props.toggleColors} />
                        {this.renderToggle()}
                    </View>
                </View>
                <View>
                    <View {...styles.partContainer}>
                        {this.renderBrowser()}
                        {this.renderModes()}
                    </View>
                </View>
                {this.renderInfo()}
                <View {...styles.partContainer}>
                    <Text {...styles.text}>Original:</Text>
                    {this.renderShiftKeys()}
                </View>
                {this.renderKeyboard()}
                <Text {...styles.text}>Remapped:</Text>
                <RemappedKeyboard
                    width={255}
                    height={100}
                    root={this.props.root}
                    intervals={this.props.current.intervals}
                    colorsEnabled={this.props.colorsEnabled}
                    remapEnabled={this.props.enabled}
                />
            </>
        );
    }
}

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
        intervals: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    }),
    siblings: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            intervals: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
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
    colorsEnabled: PropTypes.bool,
};

export default Scales;
