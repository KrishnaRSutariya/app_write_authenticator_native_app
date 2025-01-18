/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './src/App';
import { name as appName } from './app.json';

import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SnackbarProvider } from './src/contexts/SnackbarContext';


// AppRegistry.registerComponent(appName, () => App);

registerRootComponent(() => {
  return (
    <GestureHandlerRootView>
      <PaperProvider theme={DefaultTheme}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
});
