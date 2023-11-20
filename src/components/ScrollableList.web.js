import { VirtualizedList } from 'react-native';
import { colors } from '../theme';

export const ScrollableList = ({ data, renderItem, keyExtractor }) => {
    return (
        <VirtualizedList
            keyExtractor={keyExtractor}
            style={[styles.list, styles.scrollableList]}
            getItem={(_data, id) => data[id]}
            getItemCount={() => data.length}
            renderItem={({ item }) => {
                return renderItem(item);
            }}
        />
    );
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
