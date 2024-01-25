import { colors } from './theme';

const styles = {
    rootContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 20,
    },
    text: {
        fontSize: 24,
        color: colors.text,
        marginLeft: 5,
        marginRight: 5
    },
    highlightedText: {
        fontSize: 24,
        color: colors.primary,
        textAlign: 'center',
    },
    highlightedTextContainer: {
        width: 35,
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
    },
    listContainer: {
        height: 300,
        minWidth: 250,
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
        justifyContent: 'flex-start',
        minWidth: 500,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
};

export default styles;
