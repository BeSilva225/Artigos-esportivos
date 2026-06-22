import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  Modal, Alert, ActivityIndicator
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { listarProdutos, deletarProduto } from '../database/database';

const IMAGENS_PADRAO = {
  'Chuteira Futebol Profissional': require('../assets/Chuteira.jpg'),
  'Bola de Campo Profissional': require('../assets/bola.jpeg'),
  'Camisa de Treino Dry-Fit': require('../assets/Camiseta.jpg'),
  'Par de Caneleiras': require('../assets/caneleira.jpg'),
  'Luvas de Goleiro Grip': require('../assets/luvas de goleiro.jpg'),
};

function getImagemProduto(produto) {
  if (produto.imagem) {
    return { uri: produto.imagem };
  }
  if (IMAGENS_PADRAO[produto.nome]) {
    return IMAGENS_PADRAO[produto.nome];
  }
  return null;
}

function lerProduto(item) {
  const texto = `${item.nome}. Categoria: ${item.categoria}. Preço: R$ ${item.preco.toFixed(2).replace('.', ',')}`;
  Speech.stop();
  Speech.speak(texto, { language: 'pt-BR', pitch: 1, rate: 0.95 });
}

export default function Home({ navigation, route }) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const usuarioId = route?.params?.usuarioId || 1;

  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [])
  );

  async function carregarProdutos() {
    try {
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produtos.');
    } finally {
      setCarregando(false);
    }
  }

  function abrirModal(produto) {
    setProdutoSelecionado(produto);
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setProdutoSelecionado(null);
  }

  function handleEditar(produto) {
    fecharModal();
    navigation.navigate('ProdutoForm', {
      produtoId: produto.id,
      usuarioId: usuarioId,
    });
  }

  function handleDeletar(produto) {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir "${produto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarProduto(produto.id);
              fecharModal();
              carregarProdutos();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir produto.');
            }
          }
        }
      ]
    );
  }

  function renderProduto({ item }) {
    const imagemSource = getImagemProduto(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => abrirModal(item)}
        activeOpacity={0.85}
      >
        {imagemSource ? (
          <Image source={imagemSource} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={[styles.img, styles.imgPlaceholder]}>
            <Ionicons name="image-outline" size={40} color="#bdc3c7" />
          </View>
        )}

        <TouchableOpacity
          style={styles.VozIcone}
          onPress={() => lerProduto(item)}
        >
          <Ionicons name="volume-medium" size={14} color="#fff" />
          <Text style={styles.VozTexto}> OUVIR</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.Produto} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.Categoria}>{item.categoria}</Text>
          <Text style={styles.Preco}>R$ {item.preco.toFixed(2).replace('.', ',')}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.btnAcao}
            onPress={() => handleEditar(item)}
          >
            <Ionicons name="create-outline" size={20} color="#2b678f" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnAcao}
            onPress={() => handleDeletar(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2b678f" />
        <Text style={{ marginTop: 10, color: '#7f8c8d' }}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.titulo}>Artigos de Futebol</Text>
        <TouchableOpacity
          style={styles.btnNovo}
          onPress={() => navigation.navigate('ProdutoForm', { usuarioId })}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.btnNovoTexto}>Novo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>
        {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </Text>

      {produtos.length === 0 ? (
        <View style={styles.vazio}>
          <Ionicons name="cart-outline" size={80} color="#dee2e6" />
          <Text style={styles.vazioTexto}>Nenhum produto cadastrado</Text>
          <Text style={styles.vazioSub}>Toque em "Novo" para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduto}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={fecharModal}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => { }}
          >
            {produtoSelecionado && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitulo}>Detalhes do Produto</Text>
                  <TouchableOpacity onPress={fecharModal}>
                    <Ionicons name="close-circle" size={28} color="#95a5a6" />
                  </TouchableOpacity>
                </View>

                {getImagemProduto(produtoSelecionado) ? (
                  <Image
                    source={getImagemProduto(produtoSelecionado)}
                    style={styles.modalImagem}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.modalImagem, styles.imgPlaceholder]}>
                    <Ionicons name="image-outline" size={60} color="#bdc3c7" />
                  </View>
                )}

                <Text style={styles.modalNome}>{produtoSelecionado.nome}</Text>

                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="pricetag" size={16} color="#2b678f" />
                    <Text style={styles.modalInfoLabel}>Categoria</Text>
                    <Text style={styles.modalInfoValor}>{produtoSelecionado.categoria}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="cash" size={16} color="#27ae60" />
                    <Text style={styles.modalInfoLabel}>Preço</Text>
                    <Text style={[styles.modalInfoValor, { color: '#27ae60' }]}>
                      R$ {produtoSelecionado.preco.toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                </View>

                {produtoSelecionado.usuario_nome && (
                  <View style={styles.modalCriador}>
                    <Ionicons name="person-outline" size={14} color="#95a5a6" />
                    <Text style={styles.modalCriadorTexto}>
                      Cadastrado por: {produtoSelecionado.usuario_nome}
                    </Text>
                  </View>
                )}

                <View style={styles.modalBotoes}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnEditar]}
                    onPress={() => handleEditar(produtoSelecionado)}
                  >
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.modalBtnTexto}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnOuvir]}
                    onPress={() => lerProduto(produtoSelecionado)}
                  >
                    <Ionicons name="volume-high-outline" size={20} color="#fff" />
                    <Text style={styles.modalBtnTexto}>Ouvir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnDeletar]}
                    onPress={() => handleDeletar(produtoSelecionado)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.modalBtnTexto}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitulo: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 15,
  },
  btnNovo: {
    flexDirection: 'row',
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
    elevation: 3,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnNovoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  imgPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  Produto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  Categoria: {
    fontSize: 13,
    color: '#95a5a6',
    marginTop: 2,
  },
  Preco: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: 4,
  },
  VozIcone: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(37, 170, 211, 0.9)',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 10,
  },
  VozTexto: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardActions: {
    justifyContent: 'center',
    gap: 8,
    marginLeft: 5,
  },
  btnAcao: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioTexto: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 15,
    fontWeight: '600',
  },
  vazioSub: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalImagem: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  modalNome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  modalInfoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  modalInfoItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: '#95a5a6',
  },
  modalInfoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalCriador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  modalCriadorTexto: {
    fontSize: 13,
    color: '#95a5a6',
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 5,
  },
  modalBtnEditar: {
    backgroundColor: '#2b678f',
  },
  modalBtnOuvir: {
    backgroundColor: '#25aad3',
  },
  modalBtnDeletar: {
    backgroundColor: '#e74c3c',
  },
  modalBtnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});