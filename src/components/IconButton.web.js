import PropTypes from 'prop-types';
import { Pressable } from 'react-native';
import styles from '../styles';
import { colors } from '../theme';

const iconContainer = {
    width: 24,
    height: 24,
    padding: 5,
    backgroundColor: colors.background
};

export const IconButton = ({ callback, source }) => (
    <Pressable {...styles.button} onPress={callback}>
        <div style={iconContainer} dangerouslySetInnerHTML={{ __html: source }} />
    </Pressable>
);

IconButton.propTypes = {
    source: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
};
