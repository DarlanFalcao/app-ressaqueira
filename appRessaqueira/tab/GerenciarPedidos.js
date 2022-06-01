import React, {Component, useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {View, StyleSheet} from 'react-native';

import {
  ListItem,
  
  Body,
} from 'native-base';

import firestore from '@react-native-firebase/firestore';
import mostrarProps, { formataMoeda } from '../utils/Utils';
import { Input, Text, Button } from 'react-native-elements';

// import { Container } from './styles';


function GerenciarPedidos({navigation}) {
  

  const [Pedidos, setPedidos] = useState([]);
  const [valorFrete,setValorFrete] = useState(0);

  function getStatus(idStatus){
    return idStatus === 0?'Pedido Realizado':idStatus === 1?'Pedido em separação':idStatus === 2?'Saiu para entrega':idStatus === 3 || idStatus === 4?'Finalizado':'Fora da area'
  }

  async function sendEmail(idCompra,toMailCliente,emailTipo,statusNovo){
    
    let URL_LOCAL = 'http://192.168.1.66:3000/sendEmail/'+idCompra+'/'+toMailCliente+'/'+emailTipo+'/'+statusNovo
    let URL = 'https://sendemailservice-323311.rj.r.appspot.com/sendEmail/'+idCompra+'/'+toMailCliente+'/'+emailTipo+'/'+statusNovo
  
    let resp = await fetch(URL);
    
    
    console.log('Chamada serviço Email' , URL_LOCAL);
  }
  
  function avancarStatus(pedido){

    firestore()
    .collection('Pedidos')
    .doc(pedido.key)
    .update({
      ...pedido,
      statusPedido:pedido.statusPedido+1,
      valorFrete:valorFrete
    }).then(()=>{
      console.log('Status Update')
      sendEmail(pedido.idPedido,pedido.emailUser,'ATUALIZACAO_STATUS',getStatus(pedido.statusPedido+1))
    })   
  }

  function finalizarPedido(pedido){

    firestore()
    .collection('Pedidos')
    .doc(pedido.key)
    .update({
      ...pedido,
      statusPedido:5
    }).then(()=>{
      console.log('Status Update')
      sendEmail(pedido.idPedido,pedido.emailUser,'ATUALIZACAO_STATUS',getStatus(pedido.statusPedido+1))
    })   
  }



  useEffect(() => {
    const subscriber = firestore()
      .collection('Pedidos')
      .orderBy("idPedido", "desc")
      .onSnapshot((querySnapshot) => {
        const Pedidos = [];
        if(querySnapshot){
        querySnapshot.forEach((documentSnapshot) => {
          
          Pedidos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id
          });
        });
        setPedidos(Pedidos);
      }});
    return () => subscriber();
  }, []);

  return (
    <FlatList
      data={Pedidos}
      renderItem={({item}) => (
        <ListItem  >
         <View>
         <Text style={styles.textoPedido}>Numero do Pedido: {item.idPedido}</Text>
         <Text style={styles.textoPedido}>Data Pedido: {item.dataPedido}</Text>
        
             <Text style={styles.textoPedido}>Nome do Cliente: {item.nomeUser}</Text>
            <Text style={styles.textoPedido}>Email do cliente: {item.emailUser}</Text>
            <Text style={styles.textoPedido}>Contato do cliente: {item.telUser}</Text>
            <Text style={styles.textoPedido}>Endereço: {item.enderecoEntrega}</Text>
            <Text style={styles.textoPedido}>Precisa de troco: {item.isTroco?'Sim':'Não'}</Text>
            <Text style={styles.textoPedido}>Levar troco para: {item.trocoPara}</Text>
            <Text h4 h4Style={{fontSize:15,marginBottom:10,marginTop:5}} style={styles.textoPedido}>Itens do Pedido</Text>
            {
            
            item.itens?(
              item.itens.map((it,ind) => (
              <Text style={styles.textoPedido}>{' - '+it.nome} x {it.qtdeItems}</Text>
            ))
            ):
            <View><Text style={styles.textoPedido}>Sem Pedidos!</Text></View>
            
            
            }
            <Text h4 h4Style={{fontSize:15, marginTop:10}}>Valor Total: {formataMoeda(item.valorTotal)}</Text>

            <Text h4 h4Style={{fontSize:15, marginTop:10,marginBottom:10, color:'red'}}>Status do Pedido</Text>
            <View>
            {
              item.statusPedido===0?
              <View>
                <Button title="Avançar para Em separação" onPress={()=>avancarStatus(item)}>
                  
                </Button>
              </View>:
              item.statusPedido===1?
              <View>
              <Button title="Avançar para Saiu para Entrega" onPress={()=>avancarStatus(item)}>
                
              </Button>
            </View>:
             item.statusPedido===2?
             <View>
               <Text>Pedido Entregue</Text>
               <Text style={{marginBottom:10}}>Aguardando confirmação!</Text>
               <Button title="Finalizar Pedido" onPress={()=>finalizarPedido(item)} buttonStyle={{width:150}}>
           
           </Button>
           </View>:item.statusPedido===3?
            <View>
            <Text>Pedido Finalizado</Text>
         
          </View>
            :item.statusPedido===4?
            <View>
              <Text>Pedido Finalizado</Text>
            
           </View>
            :item.statusPedido===5?
            <View style={{padding:1}}>
              <Text style={{marginBottom:10,marginTop:10}}>Cliente solicitou entrega fora da area!</Text>
              <Input label="Valor do Frete" keyboardType='number-pad' value={valorFrete} onChangeText={(valor)=>{
                setValorFrete(valor);
              }}></Input>
              
             
             <Button title="Aceitar" onPress={()=>avancarStatus(item)} buttonStyle={{marginBottom:10,marginLeft:15,marginRight:15}}>
               
             </Button>
             <Button title="Recusar" onPress={()=>avancarStatus(item)} buttonStyle={{marginBottom:10,marginLeft:15,marginRight:15}}>
               
             </Button>
           </View>:item.statusPedido===6?
            <View style={{padding:15}}>
              <Text>Aguardando confirmação o cliente</Text>
           </View>:
           <View>
             <Text>Pedido Finalizado</Text>
           
         </View>
            }


            </View>
         </View>
        </ListItem>
      )}
    >
    </FlatList>
  );
}


export default GerenciarPedidos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    
    height: 400,
  },
  imagemBox: {
    alignSelf: 'center',
    paddingRight: 10,
  },
  textoPedido:{
marginTop:5
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
  listaPedidosHeader: {
    fontSize: 20,
  },
});
