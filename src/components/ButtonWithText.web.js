import { Text, Pressable } from 'react-native';
import styles from '../styles';

export const ButtonWithText = ({ text, color, callback }) => {
    const textStyles = color ? { style: { ...styles.text.style, color } } : styles.text;
    return (
        <Pressable {...styles.button} onPress={callback}>
            <Text {...textStyles}>{text}</Text>
        </Pressable>
    );
};
