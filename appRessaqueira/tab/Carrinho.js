import React, { Component, useEffect, useState } from 'react';
import {

  SafeAreaView,
  View,
  FlatList,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';

import {


  ListItem,

} from 'native-base';
import InputSpinner from 'react-native-input-spinner';
import { connect } from 'react-redux';
import CustomHeader from '../CustomHeader';
import { incrementItem, decreaseItem } from '../model/carrinhoModel';
import { Icon, Button, Text } from 'react-native-elements';
import { mostrarProps, pointDentroArea, polygonAreaEntrega } from '../utils/Utils';
import Geolocation from 'react-native-geolocation-service';
import GeoFencing from 'react-native-geo-fencing';
import {  formataMoeda } from '../utils/Utils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function Carrinho({ navigation, carrinho, userLogado, isDentroAreaEntrega, dispatch }) {

  const [dentroArea, setDentroArea] = useState(false);
  const [valorTotalDesconto, setValorTotalDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);



  let bool = false;
  let x = bool.toString();


  useEffect(() => {

    console.log("###############################     USEEFFECT CARRINHO    ##############################################",isDentroAreaEntrega)


    let region = {};

    Geolocation.getCurrentPosition(
      (position) => {
        let point = {
          lat: 38.641245,
          lng:  -9.207988
        };

        GeoFencing.containsLocation(point, polygonAreaEntrega)
          .then(() => {
            console.log('point is within polygon')
            setDentroArea(true);


            console.log('point is within polygon')

          })
          .catch((error) => {

            console.log('point is NOT within polygon', error)
            setDentroArea(false)

          }

          )
      },
      (error) => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })

  }, [])


  function addItemCarrinho(item) {

    if (item.qtdeItems < item.qtdeDisponivel) {
      incrementItem(item, true, carrinho)
    }
    return {
      type: 'UPDATE_CARRINHO',
      carrinho
    }
  }
  function removeItemCarrinho(item) {
    console.log('DIMINUI CARRINHO ',item.qtdeItems)
    
      
      decreaseItem(item, true, carrinho)
      return {
        type: 'UPDATE_CARRINHO',
        carrinho
      }
    
  }



  function TotalDesconto({ itens }) {

    useEffect(() => {
      let total = 0;
      let cont = 0;
      itens.forEach(item => {

        if (item.isPromocao) {
          if (item.promocao.percent) {
            total = item.preco - item.promocao.precoComDesconto;
            total = total * item.qtdeItems;
          }
          if (item.promocao.qtdeparaDesconto) {
            for (var i = 0; i <= item.qtdeItems; i++) {
              if ((cont - item.promocao.qtdeparaDesconto) == 1) {
                total = total + item.promocao.valorDescontoAplicado;
                cont = 0;
                continue
              }
              cont++;
            }
          }
        }

      })
      setValorTotalDesconto(total);
    }, []);




    return (
      <Text style={{ color: 'green', fontSize: wp('5%'), fontWeight: 'bold' }}>
        Desconto: - {formataMoeda(valorTotalDesconto)}
      </Text>
    );
  }


  function TotalCompra({ itens }) {


    useEffect(() => {
      setValorTotal(itens.reduce(
        (valorAcumulado, item) => valorAcumulado + item.preco * item.qtdeItems,
        0,
      ));
      console.log('TotalCompra ', valorTotal)
    }, []);


    return (
      <Text style={{ color: 'black', fontSize: wp('5%'), fontWeight: 'bold' }}>
        Valor Total: {formataMoeda(valorTotal - valorTotalDesconto)}
      </Text>
    );
  }
  function removeCarrinhoButton(item, carrinho) {
    carrinho.itens.pop(item);
    return {
      type: 'UPDATE_CARRINHO',
      carrinho
    }
  }
  function ListaCarrinho({ carrinho }) {
    if (carrinho.qtdeItensCarrinho == 0) {
      return (
        <View style={styles.listaVazia}>
          <Text style={{ fontWeight: 'bold', fontSize: hp('5%'), padding: hp('1%') }}>:( </Text>
          <Text style={{ fontWeight: 'bold', fontSize: hp('3%'), padding: hp('5%') }}>Carrinho Vazio!</Text>
          <Image
            style={styles.imagemLogo}
            source={require('../assets/ressaqueira1.jpeg')}></Image></View>
      )
    } else {
      return (

        <FlatList

          data={carrinho.itens}
          renderItem={({ item }) => (
            <ListItem selected>
              <View style={styles.listaItensContainer} key={item.key}>
                <View style={styles.imagem}>
                  <Image style={styles.imagemBox} source={{ uri: item.urlImagem }} />
                </View>
                <View style={styles.conteudoItem}>
                  <View style={styles.nomeProduto}>

                    <Text style={{ fontSize: wp('3%') }}>{item.nome}</Text>
                  </View>
                  <View style={styles.qtdeProduto}>
                    <View style={{ flexDirection: 'row', flex: 1 }}><Text>X</Text>
                      <Text style={{ fontWeight: 'bold', marginLeft: wp('1%') }}>{item.qtdeItems}</Text></View>
                    <View style={{ flex: 1 }}>

                      {item.isPromocao ?
                        <Text style={{ fontWeight: 'bold' }}>{formataMoeda(item.preco * item.qtdeItems)}</Text> :
                        <Text style={{ fontWeight: 'bold' }}>{formataMoeda(item.preco * item.qtdeItems)}</Text>
                      }

                    </View>

                  </View>
                </View>
                <View style={styles.botoesItem}>
                  <InputSpinner
                    max={item.qtdeDisponivel}
                    min={1}
                    step={1}
                    colorMax={'#000000'}
                    colorMin={'#000000'}
                    rounded={false}
                    colorLeft={'black'}
                    colorRight={'black'}
                    buttonTextColor={'white'}
                    showBorder={false}
                    width={wp('30%')}
                    height={hp('6%')}
                    onMax={() => Alert.alert('Quantidade maxima disponiveis para este produto')}
                    onMin={() => console.log('Quantidade minima')}
                    onIncrease={() => dispatch(addItemCarrinho(item, carrinho))}
                    onDecrease={() => dispatch(removeItemCarrinho(item, carrinho))}
                    value={item.qtdeItems}
                    editable={false}
                    style={styles.botaoQuantidade}
                    
                    
                  />
                  <Button buttonStyle={styles.buttonRemoverCarrinho} type='outline'

                    icon={<Icon name="trash-o" type="font-awesome" iconStyle={{ color: 'black' }} />} onPress={() => dispatch(removeCarrinhoButton(item, carrinho))}>

                  </Button>
                </View>
              </View>
            </ListItem>
          )}
        />
      );
    }


  }

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <CustomHeader navigation={navigation} />

      <View style={styles.container}>
        <View style={styles.titulo}><Text h4>Dados do Carrinho</Text></View>


        <View style={styles.listaItens}><ListaCarrinho carrinho={carrinho}></ListaCarrinho></View>


        <View style={styles.footerCarrinho}>
          <Text style={{ fontWeight: 'bold' }}>Valor frete:         {isDentroAreaEntrega.isDentroAreaEntrega ? 'Gratis' : 'A calcular'}</Text>
          <TotalDesconto itens={carrinho.itens}></TotalDesconto>
          <TotalCompra itens={carrinho.itens}></TotalCompra>

          <Button title='Finalizar Pedido' buttonStyle={{ backgroundColor: 'red' }}
            onPress={() => 
              navigation.navigate(!userLogado ? 'Perfil' : 'FinalizarPedido', {
              carrinho
            })} disabled={carrinho.qtdeItensCarrinho == 0}>

          </Button>



        </View>
      </View>
    </SafeAreaView>
  );
}

export default connect(state => ({ carrinho: state.carrinhoReducer, isDentroAreaEntrega: state.mapsReducer, userLogado: state.authReducer }))(Carrinho);


const styles = StyleSheet.create({
  listaItensContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp('15%')
  },
  botaoQuantidade:{
    marginRight:wp('18%'),
    padding:5
    
  }
  , listaVazia: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center'
  }, imagemLogo: {

    width: wp('25%'),
    height: hp('15%')
  },
  imagemBox: {
    width: wp('10%'),
    height: hp('10%')
  },
  conteudoItem: {
    justifyContent: 'space-around',
    flex: 1
  },
  botoesItem: {
    width: wp('25%')
  },
  imagem: {

    width: wp('15%')
  },


  titulo: {
    borderBottomWidth: 1,
    height: hp('6%'),
    alignItems: 'center'
  },

  nomeProduto: {

  },
  qtdeProduto: {

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center'
  },

  buttonRemoverCarrinho: {

    marginTop: wp('0%'),
    marginLeft:5,
    width: wp('10%'),
    padding:2,
    marginTop:5

  },







  footerCarrinho: {
    marginLeft: wp('3%'),
    marginRight: wp('3%'),
    
    height: hp('25%')
  },
  listaItens: {

    height: hp('55%')
  },

  safeAreaStyle: {
    backgroundColor: 'white',
    flex: 1,
    
  },
  container: {
    flex: 1
  },

  nome: {
    flex: 1,
    justifyContent: 'space-between',
  },
  preco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red'
  },
  precoSemDesconto: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: 'black'
  },
  precoBox: {
    flex: 1,
    paddingLeft: 25,


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
  buttonCarrinho: {
    backgroundColor: 'red',
  },

});
