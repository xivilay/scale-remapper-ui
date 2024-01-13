import PropTypes from 'prop-types';
import { Button, Text } from 'react-juce';
import styles from '../styles';
import { colors } from '../theme';

export const TextButton = ({ text, color = colors.text, callback, props = {} }) => (
    <Button {...styles.button} onClick={callback} {...props}>
        <Text {...styles.text} color={color}>
            {text}
        </Text>
    </Button>
);

TextButton.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
    callback: PropTypes.func.isRequired,
    props: PropTypes.object,
};
