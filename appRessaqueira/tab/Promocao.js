import React, {Component} from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';


import CustomHeader from '../CustomHeader';

import mostrarProps from '../utils/Utils';
import { Input, Button, Text } from 'react-native-elements';
import { Icon } from 'react-native-elements';



export class Promocao extends Component {
    
  constructor(props) {
      
    super(props);
    const {updateMode} = this.props.route.params;
      const {item} = this.props.route.params;
      //console.log(mostrarProps(item, 'item'));
      this.state = {
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        qtdeDisponivel: item.qtdeDisponivel,
        imagemUpload: {},
        urlImagem: item.urlImagem,
        subTitulo: item.subTitulo,
        categoria: item.idCategoria,
        key: item.key,
        updateMode: true,
        isPromocao:item.isPromocao,
        promocao:{
         
            percent:item.isPromocao?item.promocao.percent==0?'':item.promocao.percent.toString():'',
            qtdeparaDesconto:item.isPromocao?item.promocao.qtdeparaDesconto==0?'':item.promocao.qtdeparaDesconto.toString():'',
            valorDescontoAplicado:item.isPromocao?item.promocao.valorDescontoAplicado==0?'':item.promocao.valorDescontoAplicado.toString():'',
           // percent:'',
           // qtdeparaDesconto:'',
           // valorDescontoAplicado:'',
            precoComDesconto: 0,
        }
      };
      console.log(mostrarProps(this.state, 'state'));
  }
   CalculaDesconto(){
    let percentDesconto = parseInt(this.state.promocao.percent)<10?parseFloat('0.0'+this.state.promocao.percent):parseFloat('0.'+this.state.promocao.percent);
    
    console.log('VALOR COM DESCONTO '+percentDesconto);
    return this.state.preco - (this.state.preco * percentDesconto);
  }

  salvarProduto() {
   console.log(mostrarProps(this.state,'state'))
   
    }
  

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader navigation={this.props.navigation} />
        <Text h4>Cadastro de Promoção</Text>
        <Input
  placeholder='Desconto'
  leftIcon={{ type: 'font-awesome', name: 'percent' }}
  keyboardType={'number-pad'}
  value={this.state.promocao.percent}
  onChangeText={(percent) => {
      console.log("SET STATE")
      this.setState({ promocao:{
        percent:percent,
        qtdeparaDesconto:this.state.promocao.qtdeparaDesconto,
        valorDescontoAplicado:this.state.promocao.valorDescontoAplicado
    }});  
      console.log(mostrarProps(this.state.promocao,"state"))}}
/>
<Input
  placeholder='A cada... de produtos comprados'
  leftIcon={{ type: 'font-awesome', name: 'plus' }}
  keyboardType={'number-pad'}
  value={this.state.promocao.qtdeparaDesconto}
  
  onChangeText={(qtdeparaDesconto) => {
    console.log("SET STATE")
    this.setState({ promocao:{
      percent:this.state.promocao.percent,
      qtdeparaDesconto:qtdeparaDesconto,
      valorDescontoAplicado:this.state.promocao.valorDescontoAplicado
  }});  
    console.log(mostrarProps(this.state.promocao,"state"))}}
/>
<Input
  placeholder='Aplicar... de desconto'
  leftIcon={{ type: 'font-awesome', name: 'money' }}
  keyboardType={'number-pad'}
  value={this.state.promocao.valorDescontoAplicado}
  onChangeText={(valorDescontoAplicado) => {
    console.log("SET STATE")
    this.setState({ promocao:{
      percent:this.state.promocao.percent,
      qtdeparaDesconto:this.state.promocao.qtdeparaDesconto,
      valorDescontoAplicado:valorDescontoAplicado
  }});  
    console.log(mostrarProps(this.state.promocao,"state"))}}
/>

<Button
  icon={
    <Icon
      name="save"
      type="FontAwesome"
      size={13}
      color="white"
    />
  }
  title="Salvar"
  onPress={()=>{
    firestore()
    .collection('Produtos')
    .doc(this.state.key)
    .update({
        nome: this.state.nome,
        descricao: this.state.descricao,
        preco: this.state.preco,
        qtdeDisponivel: this.state.qtdeDisponivel,
        urlImagem: this.state.urlImagem,
        subTitulo: this.state.subTitulo,
        idCategoria: this.state.categoria,
        key: this.state.key,
        isPromocao:true,
        promocao:{
            percent:parseInt(this.state.promocao.percent),
            qtdeparaDesconto:parseInt(this.state.promocao.qtdeparaDesconto),
            valorDescontoAplicado:parseInt(this.state.promocao.valorDescontoAplicado),
            precoComDesconto:this.CalculaDesconto()
        }
    }
      
    )
    .then(() => {
      console.log('Product update!');
    });
  }}
/>
      </SafeAreaView>
    );
  }
}
