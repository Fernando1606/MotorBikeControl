import 'react-native-gesture-handler';
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/screens/Home';
import Racing from './components/screens/Racing'


const Stack = createStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name='RacingWindow' component={Racing} options={{ headerShown: false }}/>
    </Stack.Navigator>
    </NavigationContainer>
    );
};

