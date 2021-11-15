import React, { Component } from 'react';
import { View } from 'react-juce';
import Scales from './Scales';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View {...styles.container}>
                <View {...styles.content}>
                    <Scales />
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
