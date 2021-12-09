import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Text, View } from 'react-juce';
import Scales from './Container';
import createParametersStore from '../store/parameters';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { store: null };
    }

    async componentDidMount() {
        const store = await createParametersStore();
        this.setState({ store });
    }

    renderSpinner() {
        return <Text {...styles.loading}>Loading...</Text>;
    }

    render() {
        const { store } = this.state;
        return (
            <View {...styles.container}>
                <View {...styles.content}>
                    {(store && (
                        <Provider store={store}>
                            <Scales />
                        </Provider>
                    )) ||
                        this.renderSpinner()}
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#323e44',
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
    loading: {
        fontSize: 50,
        color: '#dddddd'
    }
};

export default App;
