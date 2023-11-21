import styles from './common-styles';

const overrides = {
    listContainer: {
        height: 350,
    },
    info: {
        height: 80,
    },
};

export default Object.keys(styles).reduce((acc, key) => {
    acc[key] = { style: { ...styles[key], ...(overrides[key] || {}) } };
    return acc;
}, {});
