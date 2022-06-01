import React, { Component, useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import {View, Text, Image, StyleSheet, Alert } from 'react-native';


import InputSpinner from 'react-native-input-spinner';
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';
import { addCarrinho, removeItem, incrementItem, decreaseItem } from '../model/carrinhoModel';
import { Icon, Button, Badge} from 'react-native-elements';
import { ListItem, Toast } from 'native-base';
import {formataMoeda } from '../utils/Utils'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function ListaProdutos({ navigation, categoria, nome, carrinho, usuarioLogado, dispatch }) {



  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);


  function incrementrarItemHome(item) {
    console.log('INCREMENTAR ITEM')
    if (item.qtdeItems <= item.qtdeDisponivel) {
      if (item.qtdeItems == item.qtdeDisponivel) {
        item.qtdeItems = item.qtdeDisponivel;
      } else {
        item.qtdeItems = item.qtdeItems + 1;
      }

    }
  }
  function decrementarItemHome(item) {
    if (item.qtdeItems > 0) {
      item.qtdeItems = item.qtdeItems - 1;
    }
  }

  function addCarrinhoHome(item) {
    addCarrinho(item, carrinho)
    Toast.show({
      text: "Adicionado ao carrinho com sucesso!",
      buttonText: "Ok",
      type: "success",
      duration: 3000,
      position:'bottom',
      useNativeDriver: true

    });
    return {
      type: 'UPDATE_CARRINHO',
      carrinho
    }
  }

  function qtdeMaxExcedida() {
    Alert.alert('Máximo de produtos disponiveis atingido!');
  }

  useEffect(() => {
    const subscriber = categoria ?
      firestore()
        .collection('Produtos')
        .where('idCategoria', '==', categoria)
        .onSnapshot((querySnapshot) => {
          const produtos = [];
          if (querySnapshot) {
            querySnapshot.forEach((documentSnapshot) => {

              produtos.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                qtdeItems: 1,
              });
            });
            setProdutos(produtos);
            setLoading(false);
          }
        }) :

      firestore()
        .collection('Produtos')
        .onSnapshot((querySnapshot) => {
          const produtos = [];
          console.log('LOADING: ', loading)
          if (querySnapshot) {
            querySnapshot.forEach((documentSnapshot) => {

              if (typeof (nome) != "undefined") {
                if (nome.length >= 3 && documentSnapshot.data().nome.toLowerCase().includes(nome.toLowerCase())) {

                  produtos.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                    qtdeItems: 1,
                  });
                }
              }

            });
            setProdutos(produtos);
            setLoading(false);
          }
        });
    return () => subscriber();
  }, []);
  if (loading) {
    return <ActivityIndicator color='red' style={{height:hp('10%')}} size='large'></ActivityIndicator>
  } else if (produtos.length == 0) {
    return (
      <View style={styles.listaVazia}>
        <Text style={{fontWeight:'bold',fontSize:hp('5%'),padding:hp('5%')}}>:( </Text>
          <Text style={{fontWeight:'bold',fontSize:hp('3%'),padding:hp('5%')}}>Busca sem resultados!</Text>
        <Image
     style={styles.imagemLogo}
      source={require('../assets/ressaqueira1.jpeg')}></Image></View>
    )
  }

  return (
    <FlatList
      data={produtos}
      renderItem={({ item }) => (
        <ListItem selected key={item.key}>
          <View style={styles.container}>
         
        
         <View style={styles.imagem}>
        

              <TouchableOpacity onPress={() => {
                navigation.navigate('Produto', {
                  item
                })
              }}>
                 {
              item.isPromocao && item.promocao.percent?
              <Badge badgeStyle={{width:wp('9%'),height:hp('5%'), borderRadius:wp('10%')}}
              textStyle={{fontWeight:"bold"}}
              value={ <Text>-{item.promocao.percent}%</Text>}
              status="error"
              containerStyle={{ position:'absolute', bottom:hp('7%')  ,right:wp('8%'),zIndex:1 }}
            />
              :
              <Text></Text> 
              }
                <Image style={styles.imagemBox} source={{ uri: item.urlImagem }} />
              </TouchableOpacity>
              </View>

         <View style={styles.conteudo}>
           
           <Text style={styles.nome}>{item.nome}</Text>
           <Text style={styles.subTitulo}>{item.subTitulo}</Text>
           
           {
              item.isPromocao && item.promocao.percent?
              <View >
              <Text style={styles.precoSemDesconto}>{formataMoeda(item.preco)}</Text>
              <Text style={styles.preco}> {formataMoeda(item.promocao.precoComDesconto)}</Text>
              </View>
              :
              <Text style={styles.preco}> {formataMoeda(item.preco)}</Text>
              
              }
           {
              item.isPromocao && item.promocao.qtdeparaDesconto?
              <Text style={styles.promocaoDesc}>Na Compra de 2 ganhe: {formataMoeda(item.promocao.valorDescontoAplicado)} de desconto</Text>
              :
              <Text></Text> 
              }
              {
                item.qtdeDisponivel > 0?
                <Text style={styles.qtdeDisponivel}>{item.qtdeDisponivel} em estoque</Text>:
                <Text style={styles.qtdeDisponivel}>Indisponivel</Text>
              }
           
         </View>
         
         
         <View  style={styles.botaoPreco}>

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
                onMax={() => qtdeMaxExcedida()}
                editable={false}
                onIncrease={() => incrementrarItemHome(item)}
                onDecrease={() => decrementarItemHome(item)}
                style={styles.botaoQuantidade}
                value={item.qtdeItems}
                
              />

               <Button title="Adicionar" onPress={() =>  dispatch(addCarrinhoHome(item))}
                disabled={item.qtdeDisponivel === 0}
                icon={
                  <Icon name="shopping-cart" type="font-awesome" style={{padding:wp('1%')}} />
                }
                iconRight
                buttonStyle={styles.botaoAddCarrinho}>
                  
                </Button>

         </View>
         </View>
        </ListItem>
      )}
    >
    </FlatList>
  );


}



export default connect(state => ({ carrinho: state.carrinhoReducer }))(ListaProdutos);

const styles = StyleSheet.create({
  qtdeDisponivel:{
   fontSize:wp('3%'),
   color:'gray'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    height:hp('20%'),
    
  },
  imagemLogo:{
    
    width:wp('25%'),
    height:hp('15%')
  },
  listaVazia:{
    flex:1,
    
    alignItems:'center',
    justifyContent:'center'
  },
  conteudo:{
  
  flex:4
  },
  botaoPreco:{
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
  imagemBox: {
    width:wp('12%'),
    height:hp('12%'),
   
  },

  imagem: {
   flex:1,
   flexDirection:'row',
   justifyContent:'center',
   alignItems:'center',
  
  },
  promocaoDesc:{
    flex:1,
    color:'red',
    fontWeight:'bold',
    fontSize:wp('2.6%'),
    marginTop:wp('2%')
  },
  subTitulo:{
    flex:1,
    color:'gray'
  },
  nome: {
    
    fontWeight:'bold',
    fontSize:wp('3.7%')
  },
  preco: {
    fontSize:wp('3.7%'),
    fontWeight:'bold',
    color:'red'
  },
  precoSemDesconto: {
    
    fontSize:wp('3.7%'),
    fontWeight:'bold',
    fontStyle:'italic',
    textDecorationLine:'line-through',
    textDecorationStyle:'solid',
    color:'black',
    marginLeft:wp('1%')
    
  },
  precoBox: {
    flex: 1,
   paddingLeft:25,
    
    
  },
  carrinho: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  contador: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  listaProdutosHeader: {
    fontSize: 20,
  },
  botaoAddCarrinho:{
    backgroundColor:'red',
    marginTop:hp('2%'),
    width:100,
    height:hp('5%'),
    marginRight:wp('11%')
  },
  botaoQuantidade:{
    marginRight:wp('10%')
    
  }
});
