import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Mapa() {
  // Coordenadas do IFSul Bagé para o Google Maps
  const mapaUrl = "https://www.google.com/maps/search/?api=1&query=-31.3075,-54.0645";

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nossas Lojas em Bagé</Text>
      <WebView
        source={{ uri: mapaUrl }}
        style={styles.mapa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titulo: { padding: 15, fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50' },
  mapa: { flex: 1 }
});