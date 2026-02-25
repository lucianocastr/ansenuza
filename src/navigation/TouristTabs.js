import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import ListadoOfertasScreen from '../screens/ListadoOfertasScreen';
import DetalleOfertaScreen from '../screens/DetalleOfertaScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ReservasScreen from '../screens/ReservasScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();
const ExplorarStack = createStackNavigator();

// Stack interno: Listado → Detalle (con tabs ocultos en Detalle)
function ExplorarNavigator() {
  return (
    <ExplorarStack.Navigator screenOptions={{ headerShown: false }}>
      <ExplorarStack.Screen name="ListadoOfertas" component={ListadoOfertasScreen} />
      <ExplorarStack.Screen name="DetalleOferta" component={DetalleOfertaScreen} />
    </ExplorarStack.Navigator>
  );
}

// Botón FAB flotante central
function FABButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('LoginProveedor')}
      activeOpacity={0.85}
    >
      <MaterialIcons name="add" size={30} color="white" />
    </TouchableOpacity>
  );
}

export default function TouristTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Explorar"
        component={ExplorarNavigator}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reservas"
        component={ReservasScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="confirmation-number" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Agregar"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: () => <FABButton />,
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-border" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  fab: {
    top: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
