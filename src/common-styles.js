import { colors } from './theme';

const styles = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        flex: 1.0,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 24,
        color: colors.text,
        marginLeft: 5,
        marginRight: 5,
    },
    highlightedText: {
        fontSize: 24,
        color: colors.primary,
        textAlign: 'center'
    },
    highlightedTextContainer: {
        width: 35
    },
    button: {
        minWidth: 'max-content'
    },
    scrollableList: {
        height: 250,
        borderWidth: 3,
        borderColor: colors.secondary,
        borderRadius: 3,
        overflowX: 'hidden',
        marginBottom: 5,
        marginTop: 5,
        itemHeight: 25,
    },
    info: {
        height: 60,
        borderWidth: 3,
        borderColor: colors.secondary,
        borderRadius: 3,
        flexDirection: 'column',
        width: '100%',
    },
    listContainer: {
        height: 300,
        width: 250,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    headingContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '20%',
    },
    headingSubContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    partContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
};

export default styles;
