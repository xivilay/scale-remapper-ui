import { ListView } from 'react-juce';
import styles from '../styles';

export const ScrollableList = ({ data, renderItem, keyExtractor }) => {
    return <ListView {...styles.scrollableList} data={data} renderItem={renderItem} />;
};