import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import styles from '../styles';
import { colors } from '../theme'; // TODO: replace with styles
import ScaleKeyboard from './ScaleKeyboard';
import RemappedKeyboard from './RemappedKeyboard';
import { TextButton } from './TextButton';
import { IconButton } from './IconButton';
import { ScrollableList } from './ScrollableList';
import { notes } from '@xivilay/music-theory';

import paletteIcon from '../assets/palette.svg';

const Part = ({ children }) => <View {...styles.partContainer}>{children}</View>;

const ClickableItem = ({ item, color, callback, props = {} }) => (
    <TextButton text={item} callback={callback} color={color} props={props} />
);

const Toggle = ({ enabled, toggleEnabled }) => {
    const stateText = enabled ? 'On' : 'Off';
    const color = enabled ? colors.primary : colors.textInactive;
    return <TextButton text={stateText} callback={toggleEnabled} color={color} />;
};

const Browser = ({ names, current, selectName }) => (
    <View {...styles.listContainer}>
        <View {...styles.headingContainer}>
            <Text {...styles.text}>{`Browser (${names.indexOf(current.name) + 1} of ${names.length})`}</Text>
        </View>
        <ScrollableList
            keyExtractor={(item) => item}
            data={names}
            renderItem={(item, index, props) => {
                const color = item === current.name ? colors.primary : colors.text;
                return (
                    <ClickableItem
                        item={item}
                        color={color}
                        callback={() => selectName(item)}
                        props={{ width: '100%', ...props }}
                    />
                );
            }}
        />
    </View>
);

const Modes = ({ current, indexes, modes, siblings, nextMode, prevMode, nextIndex, prevIndex, selectIntervals }) => {
    const [currentIndex, maxIndex] = indexes;
    const [currentModeIndex, maxMode] = modes;
    return (
        <View {...styles.listContainer}>
            <View {...styles.headingContainer}>
                <View {...styles.headingSubContainer}>
                    <Text {...styles.text}>Scale:</Text>
                    <View {...styles.buttonsContainer}>
                        <TextButton text={'<'} callback={prevIndex} />
                        <Text {...styles.text}>{`${currentIndex + 1} of ${maxIndex + 1}`}</Text>
                        <TextButton text={'>'} callback={nextIndex} />
                    </View>
                </View>
                <View {...styles.headingSubContainer}>
                    <Text {...styles.text}>{`Mode: `}</Text>
                    <View {...styles.buttonsContainer}>
                        <TextButton text={'<'} callback={prevMode} />
                        <Text {...styles.text}>{`${+currentModeIndex + 1} of ${maxMode + 1}`}</Text>
                        <TextButton text={'>'} callback={nextMode} />
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
                    return <ClickableItem item={name} color={color} callback={() => selectIntervals(intervals)} />;
                }}
            />
        </View>
    );
};

const Info = ({ current }) => {
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
};

const Tones = ({ tonics, nextTonics, prevTonics }) => {
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
    const [currentTonics] = tonics;
    const tonicsPostfix = tonicsMap[currentTonics] ? `(${tonicsMap[currentTonics]}tonic)` : '';
    return (
        <View {...styles.buttonsContainer}>
            <Text {...styles.text}>Tones: </Text>
            <TextButton text={'<'} callback={prevTonics} />
            <View {...styles.highlightedTextContainer}>
                <Text {...styles.highlightedText}>{`${currentTonics} `}</Text>
            </View>
            <TextButton text={'>'} callback={nextTonics} />
            <Text {...styles.text}>{`${tonicsPostfix}`}</Text>
        </View>
    );
};

const Root = ({ root, nextRoot, prevRoot }) => {
    const rootNote = notes[root];
    return (
        <View {...styles.buttonsContainer}>
            <Text {...styles.text}>Root: </Text>
            <TextButton text={'<'} callback={prevRoot} />
            <View {...styles.highlightedTextContainer}>
                <Text {...styles.highlightedText}>{`${rootNote}`}</Text>
            </View>
            <TextButton text={'>'} callback={nextRoot} />
        </View>
    );
};

const ShiftKeys = ({ prevShift, nextShift }) => (
    <View {...styles.buttonsContainer}>
        <TextButton text={'<'} callback={prevShift} />
        <TextButton text={'>'} callback={nextShift} />
    </View>
);

const Scales = ({
    colorsEnabled,
    current,
    enabled,
    indexes,
    modes,
    names,
    nextIndex,
    nextMode,
    nextRoot,
    nextShift,
    nextTonics,
    prevIndex,
    prevMode,
    prevRoot,
    prevShift,
    prevTonics,
    root,
    selectIntervals,
    selectKey,
    selectName,
    siblings,
    toggleColors,
    toggleEnabled,
    tonics,
}) => (
    <>
        <Part>
            <View {...styles.buttonsContainer}>
                <Toggle enabled={enabled} toggleEnabled={toggleEnabled} />
                <IconButton source={paletteIcon} callback={toggleColors} />
            </View>
        </Part>
        <Part>
            <Root root={root} nextRoot={nextRoot} prevRoot={prevRoot} />
        </Part>
        <Part>
            <Tones tonics={tonics} nextTonics={nextTonics} prevTonics={prevTonics} />
        </Part>
        <Part>
            <Browser names={names} current={current} selectName={selectName} />
            <Modes
                current={current}
                indexes={indexes}
                modes={modes}
                siblings={siblings}
                nextMode={nextMode}
                prevMode={prevMode}
                nextIndex={nextIndex}
                prevIndex={prevIndex}
                selectIntervals={selectIntervals}
            />
        </Part>
        <Part>
            <Info current={current} />
        </Part>

        <Part>
            <Text {...styles.text}>Original:</Text>
            <ShiftKeys prevShift={prevShift} nextShift={nextShift} />
        </Part>
        <ScaleKeyboard
            width={255}
            height={100}
            root={root}
            intervals={current.intervals}
            onKeyDown={(keyIndex) => {
                selectKey(current.intervals, root, keyIndex);
            }}
        />

        <Part {...styles.partContainer}>
            <Text {...styles.text}>Remapped:</Text>
        </Part>
        <RemappedKeyboard
            width={255}
            height={100}
            root={root}
            intervals={current.intervals}
            colorsEnabled={colorsEnabled}
            remapEnabled={enabled}
        />
    </>
);

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
