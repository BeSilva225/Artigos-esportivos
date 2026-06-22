import 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getDatabase } from './database/database';

import Home from './Screens/Home';
import Mapa from './Screens/Mapa';
import Usuario from './Screens/Usuario';
import Login from './Screens/Login';
import Cadastro from './Screens/Cadastro';
import ProdutoForm from './Screens/ProdutoForm';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ route }) {
  const { usuario } = route.params || {};

  return (
    <Tab.Navigator screenOptions={({ route: tabRoute }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (tabRoute.name === 'Produtos') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (tabRoute.name === 'Mapa') {
          iconName = focused ? 'map' : 'map-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2b678f',
      tabBarInactiveTintColor: '#95a5a6',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        height: 60,
        paddingBottom: 8,
        paddingTop: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      headerShown: false,
    })}>
      <Tab.Screen
        name="Produtos"
        component={Home}
        initialParams={{ usuarioId: usuario?.id }}
      />
      <Tab.Screen name="Mapa" component={Mapa} />
    </Tab.Navigator>
  );
}

function HomeStack({ route }) {
  const { usuario } = route.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TabsHome"
        component={Tabs}
        initialParams={{ usuario }}
      />
      <Stack.Screen
        name="ProdutoForm"
        component={ProdutoForm}
        options={({ route: formRoute }) => ({
          headerShown: true,
          title: formRoute.params?.produtoId ? 'Editar Produto' : 'Novo Produto',
          headerStyle: { backgroundColor: '#2b678f' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      />
    </Stack.Navigator>
  );
}

function PerfilScreen({ route, navigation }) {
  const { usuario, onLogout } = route.params || {};

  return (
    <Usuario
      route={{ params: { usuario } }}
      onLogout={onLogout}
    />
  );
}

function DrawerApp({ usuario, onLogout }) {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTintColor: '#2c3e50',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={28}
            color="#2c3e50"
            style={{ marginLeft: 15 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        drawerActiveTintColor: '#2b678f',
        drawerInactiveTintColor: '#6c757d',
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          marginLeft: -10,
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 10,
          paddingVertical: 2,
        },
      })}
    >
      <Drawer.Screen
        name="Principal"
        component={HomeStack}
        initialParams={{ usuario }}
        options={{
          title: 'Início',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Meu Perfil"
        component={PerfilScreen}
        initialParams={{ usuario, onLogout }}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Cadastro">
        {(props) => <Cadastro {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [dbPronto, setDbPronto] = useState(false);

  useEffect(() => {
    async function initDB() {
      try {
        await getDatabase();
      } catch (error) {
        console.error('Erro ao inicializar banco:', error);
      } finally {
        setDbPronto(true);
      }
    }
    initDB();
  }, []);

  function handleLogin(user) {
    setUsuario(user);
  }

  function handleLogout() {
    setUsuario(null);
  }

  if (!dbPronto) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' }}>
        <ActivityIndicator size="large" color="#2b678f" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? (
        <DrawerApp usuario={usuario} onLogout={handleLogout} />
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}