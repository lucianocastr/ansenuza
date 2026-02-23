import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BienvenidaScreen from '../screens/BienvenidaScreen';
import LoginProveedorScreen from '../screens/LoginProveedorScreen';
import NuevaPublicacionScreen from '../screens/NuevaPublicacionScreen';
import TouristTabs from './TouristTabs';
import ProviderTabs from './ProviderTabs';

const Stack = createStackNavigator();
const ProviderStack = createStackNavigator();

// Stack interno del área proveedor: permite pushear NuevaPublicacion sobre los tabs
function ProviderAreaStack() {
  return (
    <ProviderStack.Navigator screenOptions={{ headerShown: false }}>
      <ProviderStack.Screen name="ProviderTabs" component={ProviderTabs} />
      <ProviderStack.Screen name="NuevaPublicacion" component={NuevaPublicacionScreen} />
    </ProviderStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Bienvenida"
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="Bienvenida" component={BienvenidaScreen} />
        <Stack.Screen name="TouristArea" component={TouristTabs} />
        <Stack.Screen name="LoginProveedor" component={LoginProveedorScreen} />
        <Stack.Screen name="ProviderArea" component={ProviderAreaStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
