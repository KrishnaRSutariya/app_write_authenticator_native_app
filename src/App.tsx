/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Product from './pages/Product';
import account from './auth/appWrite';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  Product: {
    productId: number
  };
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {

  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const getCurrentUser = async () => {
    await account.get().then(res => {
      setIsLoading(false);
      if (res) {
        setIsLoggedIn(true);
      }
    }).catch(_ => setIsLoading(false));
  };

  React.useEffect(() => {
    getCurrentUser();
  }, []);

  if (isLoading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  const screenOptions: NativeStackNavigationOptions = {
    headerTitleStyle: { fontWeight: 'bold' },
    headerShadowVisible: false,
    headerBackTitle: 'Back',
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'} screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="Registration" component={Registration} options={{ title: 'Registration' }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="Product" component={Product} options={{ title: 'Product' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
