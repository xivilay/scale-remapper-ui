import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-juce';
import Scales from './Container';
import createParametersStore, { subscribeGetLocalScales } from '../store/parameters';
import { colors } from '../theme';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { store: null };
    }

    async componentDidMount() {
        subscribeGetLocalScales();
        const store = await createParametersStore();
        this.setState({ store });
    }

    render() {
        const { store } = this.state;
        return (
            <View {...styles.container}>
                <View {...styles.content}>
                    {store && (
                        <Provider store={store}>
                            <Scales />
                        </Provider>
                    )}
                </View>
            </View>
        );
    }
}

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
