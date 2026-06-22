import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginUsuario } from '../database/database';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setCarregando(true);
    try {
      const resultado = await loginUsuario(email.trim(), senha);
      if (resultado.sucesso) {
        onLogin(resultado.usuario);
      } else {
        Alert.alert('Erro', resultado.erro);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.logoArea}>
          <View style={styles.iconContainer}>
            <Ionicons name="football" size={60} color="#fff" />
          </View>
          <Text style={styles.titulo}>Artigos Esportivos</Text>
          <Text style={styles.subtitulo}>Entre na sua conta</Text>
        </View>

        <View style={styles.formArea}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#95a5a6"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#95a5a6"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#7f8c8d"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btnLogin, carregando && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnLoginTexto}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separador}>
            <View style={styles.linha} />
            <Text style={styles.separadorTexto}>ou</Text>
            <View style={styles.linha} />
          </View>

          <TouchableOpacity
            style={styles.btnCadastro}
            onPress={() => navigation.navigate('Cadastro')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={18} color="#2b678f" />
            <Text style={styles.btnCadastroTexto}>Criar nova conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#2b678f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#2b678f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  formArea: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2c3e50',
  },
  btnLogin: {
    backgroundColor: '#2b678f',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 3,
    shadowColor: '#2b678f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnLoginTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  separadorTexto: {
    marginHorizontal: 15,
    color: '#95a5a6',
    fontSize: 14,
  },
  btnCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2b678f',
    borderRadius: 12,
    height: 50,
    gap: 8,
  },
  btnCadastroTexto: {
    color: '#2b678f',
    fontSize: 16,
    fontWeight: '600',
  },
});
