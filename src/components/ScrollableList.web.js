import PropTypes from 'prop-types';
import { VirtualizedList } from 'react-native';
import styles from '../styles';

export const ScrollableList = ({ data, renderItem, keyExtractor }) => {
    return (
        <VirtualizedList
            {...styles.scrollableList}
            keyExtractor={keyExtractor}
            getItem={(_data, id) => data[id]}
            getItemCount={() => data.length}
            renderItem={({ item }) => {
                return renderItem(item);
            }}
        />
    );
};

ScrollableList.propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func,
};
