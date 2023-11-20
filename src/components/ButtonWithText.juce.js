import { Button } from 'react-juce';
import { colors } from '../theme';

export const ButtonWithText = ({ text, color, callback }) => (
    <Button {...styles.button} onClick={callback} {...props}>
        <Text {...styles.text} color={color}>
            {text}
        </Text>
    </Button>
);

const styles = {
    text: {
        fontSize: 25,
        color: colors.text,
        marginLeft: 5,
    },
    button: {
        minWidth: 'max-content',
        userSelect: 'none',
    },
};
