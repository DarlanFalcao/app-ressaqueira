import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Button,

} from 'react-native';
import CustomHeader from '../CustomHeader';
import firestore from '@react-native-firebase/firestore';


export class Controle extends Component {

  listaCategorias = [];
  constructor(props) {
    super(props);
    this.listaCategorias = this.getCategorias();
  
  }
  render() {
    return (
        <View>
          <CustomHeader navigation={this.props.navigation}/>
          <View style={{padding:20,alignItems:'center'}}>
          <Text>Controle </Text>
          </View>
          <View style={{padding:20}}>
          <Button title='Cadastrar Categorias'
          onPress={()=>this.props.navigation.navigate('CadastroCategoria',{
            updateMode:false
          })}></Button>
          </View>
          <View style={{padding:20}}>
          <Button title='Lista de Categorias'
          onPress={()=>this.props.navigation.navigate('ListaCategoriasAdmin')}></Button>
          </View>
          <View style={{padding:20}}>
          <Button title='Cadastrar Produtos' 
          onPress={()=>this.props.navigation.navigate('CadastroProdutos',{
            updateMode:false,
            listaCategorias:this.listaCategorias
          })}></Button>
          </View>
          <View style={{padding:20}}>
          <Button title='Lista de Produtos'
          onPress={()=>this.props.navigation.navigate('ListaProdutosAdmin')}></Button>
          </View>
          <View style={{padding:20}}>
          <Button title='Gerenciar Pedidos'
          onPress={()=>this.props.navigation.navigate('GerenciarPedidos')}></Button>
          </View>
          
        </View>
    );
  }

   getCategorias() {
    const categorias = [];
    console.log('FUNCAO GET_CATEGORIAS NOVO')
    firestore()
      .collection('categorias')
      .orderBy('ordem','asc')
      .onSnapshot((querySnapshot) => {
        
        if (querySnapshot) {
          querySnapshot.forEach((documentSnapshot) => {
           
            categorias.push({
              label:documentSnapshot.data().descricao,
              value:documentSnapshot.data().nome
            });
           
          });
        }
      });
    
      
    return categorias;
  }
   
}