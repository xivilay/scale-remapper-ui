import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import Scales from './Container';
import createParametersStore from '../store/parameters';
import styles from '../styles';

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
        <View {...styles.rootContainer}>
            {store && (
                <Provider store={store}>
                    <Scales />
                </Provider>
            )}
        </View>
    );
};

export default App;
