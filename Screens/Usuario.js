import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Usuario({ route, onLogout }) {
  const usuario = route?.params?.usuario || { nome: 'Usuário', email: 'usuario@email.com' };

  function handleLogout() {
    Alert.alert(
      'Sair da Conta',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            if (onLogout) onLogout();
          }
        }
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.fotoPerfil}>
          <Ionicons name="person" size={60} color="#fff" />
        </View>
        <Text style={styles.nome}>{usuario.nome}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={14} color="#27ae60" />
          <Text style={styles.badgeTexto}>Conta Verificada</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitulo}>Informações da Conta</Text>

        <View style={styles.configEsporte}>
          <View style={styles.configIcone}>
            <Ionicons name="person-outline" size={22} color="#2b678f" />
          </View>
          <View style={styles.configEsporteTexto}>
            <Text style={styles.configCards}>Nome</Text>
            <Text style={styles.configCardsTexto}>{usuario.nome}</Text>
          </View>
        </View>

        <View style={styles.configEsporte}>
          <View style={styles.configIcone}>
            <Ionicons name="mail-outline" size={22} color="#2b678f" />
          </View>
          <View style={styles.configEsporteTexto}>
            <Text style={styles.configCards}>E-mail</Text>
            <Text style={styles.configCardsTexto}>{usuario.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitulo}>Configurações de Esportes</Text>

        <View style={styles.configEsporte}>
          <View style={styles.configIcone}>
            <Ionicons name="football-outline" size={22} color="#2b678f" />
          </View>
          <View style={styles.configEsporteTexto}>
            <Text style={styles.configCards}>Esporte Favorito</Text>
            <Text style={styles.configCardsTexto}>Futebol / Futsal</Text>
          </View>
        </View>

        <View style={styles.configEsporte}>
          <View style={styles.configIcone}>
            <Ionicons name="notifications-outline" size={22} color="#2b678f" />
          </View>
          <View style={styles.configEsporteTexto}>
            <Text style={styles.configCards}>Notificações de Ofertas</Text>
            <Text style={styles.configCardsTexto}>Ativadas</Text>
          </View>
        </View>

        <View style={styles.configEsporte}>
          <View style={styles.configIcone}>
            <Ionicons name="location-outline" size={22} color="#2b678f" />
          </View>
          <View style={styles.configEsporteTexto}>
            <Text style={styles.configCards}>Região</Text>
            <Text style={styles.configCardsTexto}>Bagé - RS</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.sair} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
        <Text style={styles.sairTexto}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#2b678f',
    paddingVertical: 35,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a4d6e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#68a9f3',
  },
  nome: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 174, 96, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 10,
    gap: 5,
  },
  badgeTexto: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    paddingBottom: 5,
  },
  sectionTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#95a5a6',
    marginBottom: 12,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  configEsporte: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  configIcone: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configEsporteTexto: {
    marginLeft: 14,
    flex: 1,
  },
  configCards: {
    fontSize: 13,
    color: '#95a5a6',
  },
  configCardsTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 1,
  },
  sair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 5,
    marginBottom: 40,
  },
  sairTexto: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});