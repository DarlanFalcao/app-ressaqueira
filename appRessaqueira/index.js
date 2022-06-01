/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
export * from './CustomHeader'
export * from './CustomDrawerContent'

AppRegistry.registerComponent(appName, () => App);
