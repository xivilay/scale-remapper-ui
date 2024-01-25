import styles from './common-styles';

const overrides = {
    listContainer: {
        height: 350,
    },
    info: {
        height: 80,
    },
    rootContainer: {
        userSelect: 'none',
    },
};

export default Object.keys(styles).reduce((acc, key) => {
    acc[key] = { style: { ...styles[key], ...(overrides[key] || {}) } };
    return acc;
}, {});
