import React, { Component, useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';

import {
  ListItem,

} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';

import { Icon, Button } from 'react-native-elements';
import { formataMoeda } from '../utils/Utils';
// import { Container } from './styles';


function ListaProdutosAdmin({ navigation }) {



  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);


  function deletarProduto(item) {
    firestore()
      .collection('Produtos')
      .doc(item.key)
      .delete()
      .then(() => {
        console.log('Produto deleted!');
      });
  }

  useEffect(() => {
    const subscriber = firestore()
      .collection('Produtos')
      .orderBy('nome', 'asc')
      .onSnapshot((querySnapshot) => {
        const produtos = [];
        if (querySnapshot) {
          querySnapshot.forEach((documentSnapshot) => {
            console.log('Produto: ' + documentSnapshot.data().nome)
            produtos.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
              qtdeItems: 1,
            });
          });
          setProdutos(produtos);
          setLoading(true);
        }
      });
    return () => subscriber();
  }, []);

  return (
    <FlatList
      data={produtos}
      renderItem={({ item }) => (
        <ListItem selected>
          <View style={styles.container}>

            <View style={styles.imagemBox}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('ListaProdutosAdmin', {
                  item
                })
              }}>
                <Image style={styles.imagem} source={{ uri: item.urlImagem }} />
              </TouchableOpacity>
            </View>
            <View style={styles.nome}>
             
             
            </View>
            <View>
              <View style={styles.precoBox}>
                <Text style={styles.preco}>{formataMoeda(item.preco)}</Text>
                <Text style={styles.preco}>Nome do produto: {item.nome}</Text>
                <Text>
                Estoque:
                {item.qtdeDisponivel === 0
                  ? 'Indisponivel'
                  : item.qtdeDisponivel}
              </Text>
              </View>
              <View style={styles.carrinho}>
                <Button buttonStyle={{margin:10}}
                 onPress={() => {
                  navigation.navigate('Promocao', {
                    updateMode: item.isPromocao,
                    item

                  })
                }}
                  icon={
                    <Icon
                      name="price-tag"
                      type="entypo"
                      size={15}
                      color="white"
                    />
                  }
                  iconRight
                  title={item.isPromocao?"Editar Promoção":"Add Promoção"}
                />


                <Button buttonStyle={{margin:10}}
                  onPress={() => {
                    navigation.navigate('CadastroProdutos', {
                      updateMode: true,
                      item
                    })
                  }}
                  icon={
                    <Icon
                      name="edit"
                      type="font-awesome"
                      size={15}
                      color="white"
                    />
                  }
                  iconRight
                  title="Editar"
                />
                <Button buttonStyle={{margin:10}}
                  onPress={() => deletarProduto(item)}
                  icon={
                    <Icon
                      name="trash"
                      type="font-awesome"
                      size={15}
                      color="white"
                    />
                  }
                  iconRight
                  title="Remover"
                />


              </View>
            </View>
          </View>
        </ListItem>
      )}
    >
    </FlatList>
  );
}


export default ListaProdutosAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 250,
  },
  imagemBox: {
    alignSelf: 'center',
    paddingRight: 10,
  },

  imagem: {
    width: 80,
    height: 130,
  },
  nome: {
    flex: 1,
    justifyContent: 'space-between',
  },
  preco: {
    fontSize: 15,
  },
  precoBox: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  carrinho: {
   
    
    alignSelf: 'auto',
  },
  contador: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  listaProdutosHeader: {
    fontSize: 20,
  },
});
