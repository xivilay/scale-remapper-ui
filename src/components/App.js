import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import Scales from './Container';
import createParametersStore from '../store/parameters';
import { colors } from '../theme';

const App = () => {
    const [store, setStore] = useState();

    useEffect(() => {
        const init = async () => {
            const store = await createParametersStore();
            setStore(store);
        };
        init();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {store && (
                    <Provider store={store}>
                        <Scales />
                    </Provider>
                )}
            </View>
        </View>
    );
};

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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
    },
};

export default App;
