import { Button, Text } from 'react-juce';
import styles from '../styles';
import { colors } from '../theme';

export const ButtonWithText = ({ text, color = colors.text, callback, props = {} }) => (
    <Button {...styles.button} onClick={callback} {...props}>
        <Text {...styles.text} color={color}>
            {text}
        </Text>
    </Button>
);