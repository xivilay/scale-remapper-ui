import PropTypes from 'prop-types';
import { ListView } from 'react-juce';
import styles from '../styles';

export const ScrollableList = ({ data, renderItem }) => {
    return <ListView {...styles.scrollableList} data={data} renderItem={renderItem} />;
};

ScrollableList.propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func,
};
