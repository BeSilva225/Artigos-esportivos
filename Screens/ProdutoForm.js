import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, Alert, ScrollView, KeyboardAvoidingView, Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { criarProduto, atualizarProduto, buscarProduto } from '../database/database';

const CATEGORIAS = ['Chuteiras', 'Bolas', 'Vestuário', 'Acessórios', 'Equipamentos', 'Suplementos'];

export default function ProdutoFormScreen({ route, navigation }) {
  const { produtoId, usuarioId } = route.params || {};
  const editando = !!produtoId;

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(editando);

  useEffect(() => {
    if (editando) {
      carregarProduto();
    }
  }, []);

  async function carregarProduto() {
    try {
      const produto = await buscarProduto(produtoId);
      if (produto) {
        setNome(produto.nome);
        setPreco(produto.preco.toString().replace('.', ','));
        setCategoria(produto.categoria);
        setImagem(produto.imagem);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produto.');
    } finally {
      setCarregandoDados(false);
    }
  }

  async function escolherImagem() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar uma imagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      const asset = resultado.assets[0];
      if (asset.base64) {
        const mimeType = asset.mimeType || 'image/jpeg';
        setImagem(`data:${mimeType};base64,${asset.base64}`);
      } else {
        setImagem(asset.uri);
      }
    }
  }

  async function tirarFoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar uma foto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      const asset = resultado.assets[0];
      if (asset.base64) {
        const mimeType = asset.mimeType || 'image/jpeg';
        setImagem(`data:${mimeType};base64,${asset.base64}`);
      } else {
        setImagem(asset.uri);
      }
    }
  }

  async function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do produto.');
      return;
    }
    if (!preco.trim()) {
      Alert.alert('Atenção', 'Informe o preço do produto.');
      return;
    }
    if (!categoria) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }

    const precoNumero = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNumero) || precoNumero <= 0) {
      Alert.alert('Atenção', 'Informe um preço válido.');
      return;
    }

    setCarregando(true);
    try {
      if (editando) {
        await atualizarProduto(produtoId, nome.trim(), precoNumero, categoria, imagem);
        Alert.alert('Sucesso! ✅', 'Produto atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await criarProduto(nome.trim(), precoNumero, categoria, imagem, usuarioId);
        Alert.alert('Sucesso! 🎉', 'Produto cadastrado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar produto. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoDados) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2b678f" />
        <Text style={{ marginTop: 10, color: '#7f8c8d' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>{editando ? 'Editar Produto' : 'Novo Produto'}</Text>

        {/* Área de Imagem */}
        <View style={styles.imagemArea}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagemPreview} />
          ) : (
            <View style={styles.imagemPlaceholder}>
              <Ionicons name="image-outline" size={50} color="#bdc3c7" />
              <Text style={styles.imagemPlaceholderTexto}>Adicionar Imagem</Text>
            </View>
          )}
          <View style={styles.imagemBotoes}>
            <TouchableOpacity style={styles.btnImagem} onPress={escolherImagem}>
              <Ionicons name="images-outline" size={20} color="#2b678f" />
              <Text style={styles.btnImagemTexto}>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnImagem} onPress={tirarFoto}>
              <Ionicons name="camera-outline" size={20} color="#2b678f" />
              <Text style={styles.btnImagemTexto}>Câmera</Text>
            </TouchableOpacity>
            {imagem && (
              <TouchableOpacity style={[styles.btnImagem, styles.btnRemover]} onPress={() => setImagem(null)}>
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                <Text style={[styles.btnImagemTexto, { color: '#e74c3c' }]}>Remover</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Campos do Formulário */}
        <View style={styles.formArea}>
          <Text style={styles.label}>Nome do Produto</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Chuteira Nike Mercurial"
              placeholderTextColor="#95a5a6"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <Text style={styles.label}>Preço (R$)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIconText}>R$</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              placeholderTextColor="#95a5a6"
              value={preco}
              onChangeText={setPreco}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categoriasContainer}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoriaChip,
                  categoria === cat && styles.categoriaChipAtivo
                ]}
                onPress={() => setCategoria(cat)}
              >
                <Text style={[
                  styles.categoriaChipTexto,
                  categoria === cat && styles.categoriaChipTextoAtivo
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.btnSalvar, carregando && styles.btnDisabled]}
          onPress={handleSalvar}
          disabled={carregando}
          activeOpacity={0.8}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.btnSalvarTexto}>
                {editando ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </Text>
            </>
          )}
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  imagemArea: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imagemPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  imagemPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagemPlaceholderTexto: {
    marginTop: 10,
    fontSize: 14,
    color: '#bdc3c7',
  },
  imagemBotoes: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  btnImagem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  btnRemover: {
    backgroundColor: '#fde8e8',
  },
  btnImagemTexto: {
    fontSize: 14,
    color: '#2b678f',
    fontWeight: '600',
  },
  formArea: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 5,
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
  inputIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2c3e50',
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 5,
  },
  categoriaChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f4f8',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoriaChipAtivo: {
    backgroundColor: '#2b678f',
    borderColor: '#2b678f',
  },
  categoriaChipTexto: {
    fontSize: 14,
    color: '#6c757d',
  },
  categoriaChipTextoAtivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnSalvar: {
    flexDirection: 'row',
    backgroundColor: '#27ae60',
    borderRadius: 14,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnSalvarTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
