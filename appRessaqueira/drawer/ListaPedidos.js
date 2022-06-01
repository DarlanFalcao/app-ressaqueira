import React, { Component, useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import { View, StyleSheet } from 'react-native';

import {
  ListItem,
} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';
import mostrarProps, { formataMoeda } from '../utils/Utils';
import { Button, Text, Overlay } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function ListaPedidos({ navigation, user, dispatch }) {
  const [loading, setLoading] = useState(true);
  const [pedidos, setpedidos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmacaoVisible, setConfirmacaoVisible] = useState(false);
  const[itemAtual, setItemAtual] = useState({});
  const toggleOverlay = () => {
   
    setVisible(!visible);
  };
  const toggleOverlayConfirmacao = () => {
   
    setConfirmacaoVisible(!confirmacaoVisible);
  };
  useEffect(() => {
    if (user) {
      const subscriber = firestore()
        .collection('Pedidos')
        .where('uidUser', '==', user.uid)
        .orderBy("idPedido", "desc")
        .onSnapshot((querySnapshot) => {
          const pedidos = [];
          if (querySnapshot) {
            querySnapshot.forEach((documentSnapshot) => {
              console.log('PEDIDO_QUERY ', documentSnapshot.data().uid)
              pedidos.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
            setpedidos(pedidos);

            setLoading(true);
          }
        });
      return () => subscriber();
    }
  }, []);

  //if(loading){
  //return <ActivityIndicator />;
  //}
  function finalizarPedido(pedido,foraArea) {
    firestore()
      .collection('Pedidos')
      .doc(pedido.key)
      .update({
        ...pedido,
        statusPedido: foraArea?0:4,
      })
      .then(() => {
        setVisible(false);
        setConfirmacaoVisible(true);
        console.log('Status Update');
        navigation.navigate('HomeApp');
      });
  }
  function avancarCompra(pedido) {
    console.log(mostrarProps(pedido, 'PEDIDO'))
    navigation.navigate('FinalizarPedidoForaArea');
    console.log('FIM FUNCAO')
    return {
      type: "UPDATE_PEDIDO",
      pedido
    }

  }

  return (
    <View>
      <Overlay isVisible={visible} overlayStyle={{width:290,height:260,justifyContent:'center'}}>
        <View style={{alignItems:'center', flex:1}}>
        <Image style={{width:85,height:70}}
        source={require('../assets/ressaqueira1.jpeg')}></Image>
        
        <Text h4>Tem certeza que deseja finalizar a compra?</Text>
        <View style={{flexDirection:'row', padding:25}}>
        <Button title = 'Sim' onPress={() => finalizarPedido(itemAtual,true)} buttonStyle={{backgroundColor:'green',margin:10,width:wp('20%'),height:hp('7%') }}></Button>
        <Button title = 'Não' onPress={toggleOverlay} buttonStyle={{backgroundColor:'red',margin:10,width:wp('20%'),height:hp('7%')}}></Button>
        </View>
        </View>
      </Overlay>
      <Overlay isVisible={confirmacaoVisible} overlayStyle={{width:290,height:260,justifyContent:'center'}}>
        <View style={{alignItems:'center', flex:1}}>
        <Image style={{width:85,height:70}}
        source={require('../assets/ressaqueira1.jpeg')}></Image>
        
        <Text h6>Compra realizada com sucesso!Acompanhe seu pedido pela seção meus pedidos!</Text>
        <View style={{flexDirection:'row', padding:25}}>
        
        <Button title = 'Continuar' onPress={toggleOverlayConfirmacao} buttonStyle={{backgroundColor:'red',margin:10,width:wp('25%'),height:hp('10%')}}></Button>
        </View>
        </View>
      </Overlay>
      <FlatList
        data={pedidos}
        renderItem={({ item }) => (
          <ListItem selected key={item.key} >
            <View>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Código: {item.idPedido}</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Data: {item.dataPedido}</Text>

              <Text style={{ fontWeight: 'bold', marginTop: 2 }}>Itens do pedido:</Text>
              {item.itens.map((prop, key) => {
                return (
                  <View style={{ marginTop: 2 }}>
                    <Text style={{ fontSize: 13, color: 'black' }}>{prop.nome} x {prop.qtdeItems}</Text>
                    <Text style={{ fontSize: 13, color: 'black' }}>Valor do item {formataMoeda(prop.preco)}</Text>
                  </View>
                );
              })}
              <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Total: R$ {formataMoeda(item.valorTotal)}</Text>

              <Text style={{ marginBottom: 5, marginTop: 10, fontWeight: 'bold' }}>Status do Pedido</Text>
              {
                item.statusPedido == 0 ? (
                  <View>

                    <Text style={styles.textoStatus}>Pedido Realizado!</Text>
                    <Text style={styles.textoStatus}>...Aguardando</Text>

                  </View>
                ) :
                  item.statusPedido == 1 ? (
                    <View>

                      <Text style={styles.textoStatus}>Pedido em separação</Text>

                    </View>
                  ) :
                    item.statusPedido == 2 ? (
                      <View>

                        <Text style={styles.textoStatus}>Saiu para entrega</Text>
                        <Button buttonStyle={styles.botaoStatus} title='Já Recebi!' onPress={() => finalizarPedido(item,false)}>

                        </Button>
                      </View>
                    ) :
                      item.statusPedido == 3 || item.statusPedido == 4 ? (
                        <View>

                          <Text style={styles.textoStatus}>Finalizado</Text>

                        </View>
                      ) :
                        item.statusPedido == 5 ? (
                          <View>

                            <Text style={styles.textoStatus}>Pedido realizado....aguardando confirmação de possibilidade de entrega</Text>

                          </View>
                        ) :

                          <View>

                            <Text style={{marginBottom:5}}>Compra Liberada para sua localidade</Text>
                            <Text style={{marginTop:10,marginBottom:10}}>Valor do frete {formataMoeda(parseInt(item.valorFrete))}</Text>
                            <Button buttonStyle={styles.botaoStatus} title='Realizar Compra' onPress={() => 
                              {
                                setItemAtual(item);
                                setVisible(true);
                                
                              
                              }}>

                            </Button>

                          </View>


              }
            </View>

          </ListItem>

        )}></FlatList>
    </View>
  );
}

export default connect((state) => ({ user: state.authReducer }))(ListaPedidos);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  textoStatus:{
    color:'red',
    fontWeight:'bold'
  },
  botaoStatus: {
    backgroundColor: 'red',
    marginTop:10
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
  listapedidosHeader: {
    fontSize: 20,
  },
});
