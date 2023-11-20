import {AppRegistry, Platform} from 'react-native';
import {createRoot} from 'react-dom/client';
import {name as appName} from './app.json';
import App from '../src/components/App';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
    const root = createRoot(document.getElementById('react-root'));
    root.render(<App />);
}
