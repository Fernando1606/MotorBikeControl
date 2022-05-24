import 'react-native-gesture-handler';
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/screens/Home';
import Loading from './components/screens/Loading';


const Stack = createStackNavigator();

export default function App(){

  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name='Loading' component={Loading} options={{headerShown: false}}/>
      <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}/>
    </Stack.Navigator>
    </NavigationContainer>
    );
};

