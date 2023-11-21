import { Text, Pressable } from 'react-native';
import { colors } from '../theme';

export const ButtonWithText = ({ text, color, callback }) => (
    <Pressable style={styles.button} onPress={callback}>
        <Text style={[styles.text, { color }]}>{text}</Text>
    </Pressable>
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
