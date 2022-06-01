import React, {Component, useState, useEffect} from 'react';
import {View,   StyleSheet, ScrollView} from 'react-native';

import { connect } from 'react-redux';
import ListaPedidos from './ListaPedidos';
import { Text } from 'react-native-elements';
import CustomHeader from '../CustomHeader';


function MeusPedidos({navigation,user,dispatch}) {

  return (
    <View>
      <ScrollView>
      <CustomHeader navigation={navigation} />
      
      <View style={{alignItems:'center'}}><Text h4>Meus Pedidos</Text></View>
      <View>
      <ListaPedidos user={user} navigation={navigation}></ListaPedidos> 
      </View>
      </ScrollView>  
    </View>
  );
}


export default connect(state => ({user: state.authReducer}))(MeusPedidos);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
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
