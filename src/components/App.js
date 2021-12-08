import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-juce';
import Scales from './Container';
import store from '../store/parameters';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View {...styles.container}>
                <View {...styles.content}>
                    <Provider store={store}>
                        <Scales />
                    </Provider>
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
};

export default App;
