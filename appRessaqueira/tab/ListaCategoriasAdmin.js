import React, {Component, useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {View, Text, Image, StyleSheet, Alert} from 'react-native';

import {
  ListItem,
  
  
} from 'native-base';

import firestore from '@react-native-firebase/firestore';
import { Icon, Button } from 'react-native-elements';



function ListaCategoriaAdmin({navigation}) {
  

  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  

  useEffect(() => {
    const subscriber = firestore()
      .collection('categorias')
      .orderBy('ordem','asc')
      .onSnapshot((querySnapshot) => {
        const categorias = [];
        if(querySnapshot){
        querySnapshot.forEach((documentSnapshot) => {
          categorias.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            qtdeItems: 1,
          });
        });
        setCategorias(categorias);
        setLoading(true);
      }});
    return () => subscriber();
  }, []);

function deletarCategoria(item){
  firestore()
  .collection('categorias')
  .doc(item.key)
  .delete()
  .then(() => {
    console.log('Categoria deleted!');
  });
}


  return (
    
    <FlatList
      data={categorias}
      renderItem={({item}) => (
        <ListItem selected>
          <View style={styles.container}>
            
                <Text>{item.nome}</Text>
                <Text>{item.descricao}</Text>
                <Text>{item.ordem}</Text>
                <Button title="Editar" buttonStyle={{padding:10,alignContent:'center'}}
                icon = { <Icon name="edit" type="font-awesome"/>}
                onPress={()=>{
                navigation.navigate('CadastroCategoria',{
                  updateMode:true,
                  item
                })
              }}>
                 
                </Button>
                <Button title="Remover" icon={
                  <Icon name="trash" type="font-awesome"/>
                } onPress={()=>deletarCategoria(item)}>
                  
                </Button>
            
          </View>
        </ListItem>
      )}
    >
    </FlatList>
  );
}


export default ListaCategoriaAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  imagemBox: {
    alignSelf: 'center',
    paddingRight: 10,
  },

  imagem: {
    width: 60,
    height: 60,
  },
  nome: {
    flex: 1,
    justifyContent: 'space-between',
  },
  preco: {
    fontSize: 20,
  },
  precoBox: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  carrinho: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignSelf: 'flex-start',
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
