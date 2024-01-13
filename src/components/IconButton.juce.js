import PropTypes from 'prop-types';
import { Button, Image, View } from 'react-juce';
import styles from '../styles';
import { colors } from '../theme';

const imageStyles = {
    width: 24,
    height: 24,
    padding: 5,
};

const iconContainer = {
    width: 24,
    height: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
};

export const IconButton = ({ callback, source }) => (
    <Button {...styles.button} onClick={callback}>
        <View {...iconContainer}>
            <Image {...imageStyles} stretchToFit={true} source={source} />
        </View>
    </Button>
);

IconButton.propTypes = {
    source: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
};
