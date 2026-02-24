import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        {user ? (
          // Usuario autenticado → área proveedor
          <Stack.Screen name="ProviderArea" component={ProviderAreaStack} />
        ) : (
          // Sin sesión → flujo turista + login
          <>
            <Stack.Screen name="Bienvenida" component={BienvenidaScreen} />
            <Stack.Screen name="TouristArea" component={TouristTabs} />
            <Stack.Screen name="LoginProveedor" component={LoginProveedorScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
