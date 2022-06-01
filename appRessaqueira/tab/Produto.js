import React from 'react';

import CustomHeader from '../CustomHeader';
import { connect } from 'react-redux';
import mostrarProps, { widthToDp, heightToDp, formataMoeda } from '../utils/Utils'
import { Image, View, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Left, Body, Right, Toast } from 'native-base';
import InputSpinner from 'react-native-input-spinner';
import {addCarrinho, removeItem,incrementItem,decreaseItem} from '../model/carrinhoModel';
import { Icon, Button, Badge ,Text} from 'react-native-elements';
import {
  ListItem,
} from 'native-base';
function incrementrarItemPagProduto(item) {
  if (item.qtdeItems < item.qtdeDisponivel) {
   
      item.qtdeItems = item.qtdeItems + 1;
    
    
  }else if(item.qtdeItems == item.qtdeDisponivel){

  }
}
function decrementarItemPagProduto(item) {
  if (item.qtdeItems > 0) {
    item.qtdeItems = item.qtdeItems - 1;
  }else if(item.qtdeItems == 0){

  }
}

function addCarrinhoPagProduto(item, carrinho) {
  addCarrinho(item,carrinho)
  Toast.show({
    text: "Adicionado ao carrinho com sucesso!",
    buttonText: "Ok",
    type: "success",
    duration:4000
  });
  return {
    type:'UPDATE_CARRINHO',
    carrinho
  }      
}

const Produto = ({navigation,route,carrinho,dispatch}) => {
    const  item  = route.params;
    console.log(mostrarProps(item.item, 'ITEM'))
    return montarProduto(item.item,navigation,carrinho,dispatch)
};

function montarProduto(item, navigation,carrinho,dispatch){
    return (
      <ScrollView>
    <CustomHeader navigation={navigation} />
    
    <Card>
    <CardItem >
    
           <Body>
           {
              item.isPromocao && item.promocao.percent?
              <Badge badgeStyle={{width:widthToDp('14%'),height:heightToDp('8%'), borderRadius:widthToDp('25%')}}
              textStyle={{fontWeight:"bold"}}
              value={ <Text>-{item.promocao.percent}%</Text>}
              status="error"
              containerStyle={{ position:'absolute', bottom:heightToDp('17%')  ,right:widthToDp('48%'),zIndex:1 }}
            />
              :
              <Text></Text> 
              }
           <Image source={{uri: item.urlImagem}} style={{height: 200, width: 200,alignSelf:'center'}}/>
           </Body>
           
          
        </CardItem>
        <CardItem cardBody >
        <Left>
            <Body>
              <Text>{item.nome}</Text>
              <Text style={{marginBottom:5}} note>{item.subTitulo}</Text>
              <Text style={{marginBottom:5}}>Temos {item.qtdeDisponivel} em estoque</Text>
              {
              item.isPromocao && item.promocao.qtdeparaDesconto?
              <Text  style={{fontSize:18,color:'red', fontWeight:'bold'}}>Na Compra de 2 ganhe: {formataMoeda(item.promocao.valorDescontoAplicado)} de desconto</Text>
              :
              <Text></Text> 
              }
            </Body>
            
          </Left>
            
          <Right>
          {
              item.isPromocao && item.promocao.percent?
              <View >
              <Text style={{ 
    
    fontSize:widthToDp('3.7%'),
    fontWeight:'bold',
    fontStyle:'italic',
    textDecorationLine:'line-through',
    textDecorationStyle:'solid',
    color:'black',
    marginLeft:widthToDp('1%') ,
    marginTop:5 
  }}>{formataMoeda(item.preco)}</Text>
              <Text style={{color:'red',fontWeight:'bold',fontSize:20}}> {formataMoeda(item.promocao.precoComDesconto)}</Text>
              </View>
              :
              <Text style={{color:'red',fontWeight:'bold',fontSize:20,marginBottom:10}}> {formataMoeda(item.preco)}</Text>
              
              }
           
            <InputSpinner
                style={{marginBottom:25}}
                max={item.qtdeDisponivel}
                min={1}
                step={1}
                colorMax={'#f04048'}
                colorMin={'#40c5f4'}
                rounded={false}
                colorLeft={'black'}
                colorRight={'black'}
                buttonTextColor={'white'}
                showBorder={false}
                width={100}
                height={35}
                onMax={() => console.log('qtde maxima')}
                editable={false}
                onIncrease={() => incrementrarItemPagProduto(item)}
                onDecrease={() => decrementarItemPagProduto(item)}
                onChange={() =>
                  console.log('QUANTIDADE DE ITENS: ' + item.qtdeItems)
                }
                value={item.qtdeItems}
              />
              
              
              </Right>
         
            
        </CardItem>
        <CardItem>
        <View style={{flex:1}}>
            
        
              <Button title="Adicionar" onPress={()=>dispatch(addCarrinhoPagProduto(item, carrinho))}
              icon={
                <Icon name="shopping-cart" type="font-awesome" style={{padding:5}}/>
              }
              iconRight buttonStyle={{backgroundColor:'red'}} ></Button>
              </View>
        </CardItem>
        <CardItem>
          
          <Body><Text style={{fontSize:14}}>{item.descricao}</Text></Body>
              
        </CardItem>
        <CardItem>
          <Left>
          <Button title={item.likes} buttonStyle={{backgroundColor:'transparent'}}titleStyle={{color:'black',padding:5}} icon={
              <Icon active name="thumbs-o-up" type='font-awesome' />
            } >
              
            </Button>
          </Left>
          <Body>
          <Button title={item.comentarios.length} buttonStyle={{backgroundColor:'transparent'}}titleStyle={{color:'black',padding:10}} icon={
              <Icon active name="comments" type='font-awesome' />
            } >
              
            </Button>
          </Body>
         
        </CardItem>
    </Card>
    <View style={{alignContent:'center', padding:10}}>
      <Text style={{fontWeight:'bold'}}>Comentários</Text>
    </View>
    <FlatList
        data={item.comentarios}
        renderItem={({ item }) => (
          <ListItem selected key={item.key} >

<View style={{ alignContent:'stretch'}}>
    
    <Text>{item.texto}</Text>
       
        </View>

          </ListItem>

        )}></FlatList>
    </ScrollView>
  );
}

export default connect(state =>({carrinho: state.carrinhoReducer}))(Produto);
