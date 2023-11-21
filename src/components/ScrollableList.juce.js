import { ListView } from 'react-juce';
import { colors } from '../theme';

export const ScrollableList = ({ data, renderItem, keyExtractor }) => {
    return <ListView {...styles.list} {...styles.scrollableList} data={data} renderItem={renderItem} />;
};

const styles = {
    scrollableList: {
        itemHeight: 25,
    },
    list: {
        height: 250,
        borderWidth: 3,
        borderColor: colors.secondary,
        borderRadius: 3,
        overflowX: 'hidden',
        marginBottom: 5,
        itemHeight: 25,
    },
};
