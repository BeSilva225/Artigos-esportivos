import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { criarUsuario } from '../database/database';

export default function CadastroScreen({ navigation, onLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    if (senha.length < 4) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Atenção', 'Insira um e-mail válido.');
      return;
    }

    setCarregando(true);
    try {
      const resultado = await criarUsuario(nome.trim(), email.trim(), senha);
      if (resultado.sucesso) {
        Alert.alert(
          'Sucesso! 🎉',
          'Conta criada com sucesso! Faça login para continuar.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erro', resultado.erro);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar conta. Tente novamente.');
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
        <View style={styles.headerArea}>
          <TouchableOpacity
            style={styles.btnVoltar}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2b678f" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={50} color="#fff" />
          </View>
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>
        </View>

        <View style={styles.formArea}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#95a5a6"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

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

          <View style={styles.inputContainer}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#95a5a6"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarSenha}
            />
          </View>

          <TouchableOpacity
            style={[styles.btnCadastro, carregando && styles.btnDisabled]}
            onPress={handleCadastro}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnCadastroTexto}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkLogin}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkLoginTexto}>
              Já possui conta? <Text style={styles.linkLoginDestaque}>Entrar</Text>
            </Text>
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
  headerArea: {
    alignItems: 'center',
    marginBottom: 30,
  },
  btnVoltar: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 15,
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
  btnCadastro: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 3,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnCadastroTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkLogin: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkLoginTexto: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  linkLoginDestaque: {
    color: '#2b678f',
    fontWeight: 'bold',
  },
});
