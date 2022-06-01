import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,

  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import CustomHeader from '../CustomHeader';
import { ListItem, Body, Label } from 'native-base';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import Geocoder from 'react-native-geocoding';
import { Input, Overlay, Button, Text } from 'react-native-elements';
import {  polygonAreaEntrega } from '../utils/Utils';
import Geolocation from 'react-native-geolocation-service';
import GeoFencing from 'react-native-geo-fencing';
import { widthToDp, heightToDp, formataMoeda } from '../utils/Utils'
function FinalizarPedidoForaArea({ navigation, carrinho, userLogado, isDentroAreaEntrega, dispatch }) {

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBoxFormaPagamento, setToggleCheckBoxFormaPagamento] = useState(true);
  const [valorPago, setValorPago] = useState('0');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [telefoneUsuario, setTelefoneUsuario] = useState('');
  const [usuarioLog, setUsuarioLog] = useState('');
  const [dentroArea, setDentroArea] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sequence, setSequence] = useState(0);
  const [valorTotalDesconto, setValorTotalDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);





  useEffect(() => {

    console.log("###############################     USEEFFECT FINALIZAR PEDIDO FORA AREA    ##############################################")
   
   console.log(mostrarProps(userLogado,"USUARIO_LOGADO"))

      Geolocation.getCurrentPosition(
        (position) => {
          let point = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
    

          Geocoder.init("AIzaSyCFjOLcte8bwSs2sX4FjGnCy7LiWdBPgpk", { language: "pt" }); // use a valid API key
          // With more options
          // Geocoder.init("xxxxxxxxxxxxxxxxxxxxxxxxx", {language : "en"}); // set the language
      
          Geocoder.from("Colosseum")
            .then(json => {
              var location = json.results[0].geometry.location;
            })
            .catch(error => console.warn(error));
      
          Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
              var addressComponent = json.results[0].formatted_address;
              setEnderecoEntrega(addressComponent);
            })
            .catch(error => console.warn(error));

          GeoFencing.containsLocation(point, polygonAreaEntrega)
            .then(() => {
              console.log('point is within polygon')
              setDentroArea(true);
    
              
              console.log('point is within polygon')
    
            })
            .catch((error) => {
              
              console.log('point is NOT within polygon',error)
              setDentroArea(false)
    
            }
    
            )
        },
        (error) => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })

       

  }, [])
  function mostrarProps(obj, nomeDoObj) {
    var resultado = '';
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        resultado += nomeDoObj + '.' + i + ' = ' + obj[i] + '\n';
      }
    }
    return resultado;
  }

  function dataAtualFormatada() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }


  function finalizarCompra(carrinho, userLogado, navigation) {


    firestore()
      .collection('Pedidos')
      .add({
        dataPedido: dataAtualFormatada(),
        uidUser: userLogado.uid,
        emailUser: userLogado.email,
        nomeUser: userLogado.displayName,
        telUser: userLogado.telefoneUsuario,
        idPedido: idPedido(),
        itens: carrinho.itens,
        valorTotal: carrinho.itens.reduce(
          (valorAcumulado, item) => valorAcumulado + item.preco * item.qtdeItems,
          0,
        ),
        statusPedido: dentroArea ? 0 : 6,
        isTroco: toggleCheckBox,
        trocoPara: parseInt(valorPago),
        valorFrete: 0,
        enderecoEntrega: enderecoEntrega
      })
      .then(() => {
        console.log('Pedido added!');
        firestore().collection('ChavePedido').doc('B9UTDNHg0SJRzHzgaQIV').update({
          idPedido: sequence
        }).then(console.log('Chave Update', sequence))


        //this.setState({carrinho});
      }).catch(console.log('ERRO'));
    setVisible(true);
    carrinho = {
      itens: [],
      showButtonCarrinho: false,
      qtdeItensCarrinho: 0,
    };
    return {
      type: 'UPDATE_CARRINHO',
      carrinho,
    };
  }
  function idPedido() {

    firestore()
      .collection('ChavePedido')
      .onSnapshot((querySnapshot) => {

        if (querySnapshot) {
          querySnapshot.forEach((documentSnapshot) => {
            console.log('UPDATE CHAVE ### ', documentSnapshot.data())
            setSequence(parseInt(documentSnapshot.data().idPedido) + 1)
            console.log('UPDATE CHAVE setSequence ### ', sequence)
          });

        }
      });

    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return anoF + '' + mesF + '' + diaF + '' + sequence;
  }
  function setIsTroco(isTroco) {
    console.log('CHECKBOX!!!')
    isTroco ? setInfoPedido(infoPedido) : setInfoPedido(infoPedido)
    return isTroco
  }

  function TotalCompra({itens}) {
    useEffect(() => {
      setValorTotal(itens.reduce(
        (valorAcumulado, item) => valorAcumulado + item.preco * item.qtdeItems,
        0,
      ));
      console.log('TotalCompra ',valorTotal)
     }, []);

   
    return (
      <Text style={{color:'black',fontSize:widthToDp('5%'),fontWeight:'bold'}}>
        Valor Total: {formataMoeda(valorTotal - valorTotalDesconto)}
      </Text>
    );
  }
  function TotalDesconto({itens}) {

    useEffect(() => {
      let total = 0;
      let cont = 0;
      itens.forEach(item =>{
        
        if(item.isPromocao){
          if(item.promocao.percent){
            total = item.preco - item.promocao.precoComDesconto;
            total = total * item.qtdeItems; 
          }
          if(item.promocao.qtdeparaDesconto){
            for(var i=0;i<=item.qtdeItems;i++){
              if((cont-item.promocao.qtdeparaDesconto)==1){
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
      <Text style={{color:'green',fontSize:widthToDp('5%'),fontWeight:'bold'}}>
        Desconto: - {formataMoeda(valorTotalDesconto)}
      </Text>
    );
  }

  return (
    <View style={styles.container}>

      <CustomHeader navigation={navigation} />
      <Overlay isVisible={visible} animated animationType='fade' overlayStyle={{width:widthToDp('70%'),height:heightToDp('30%'),
      justifyContent:'space-around',alignItems:'center'}} >
        <View>
        <Text style={{fontWeight:'bold',fontSize:widthToDp('5%')}}>Compra Realizada!</Text>
        <Button buttonStyle={{ backgroundColor: 'red' ,width:widthToDp('20%')}} title='Ok' onPress={() => {
          setVisible(false);
          navigation.popToTop();
        }}></Button>
        </View>
      </Overlay>
      <ScrollView>
        <View style={styles.enderecoEntrega}>
        <Text>Finalizar compra dora da area</Text>
        <Text>Nome: {userLogado.displayName}</Text>
        <Text>Telefone: {userLogado.telefoneUsuario}</Text>
        <Text>Endereço de Envio</Text>
         
        <Text>{enderecoEntrega}</Text></View>
        <View style={styles.itensPedido}>
          <Text>Itens do Pedido</Text>
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

                      <Text style={{ fontSize: widthToDp('3%') }}>{item.nome}</Text>
                    </View>
                    <View style={styles.qtdeProduto}>
                      <View style={{ flexDirection: 'row', flex: 1 }}><Text>X</Text>
                        <Text style={{ fontWeight: 'bold', marginLeft: widthToDp('1%') }}>{item.qtdeItems}</Text></View>
                      <View style={{ flex: 1 }}>

                        {item.isPromocao ?
                          <Text style={{ fontWeight: 'bold' }}>{formataMoeda(item.preco * item.qtdeItems)}</Text> :
                          <Text style={{ fontWeight: 'bold' }}>{formataMoeda(item.preco * item.qtdeItems)}</Text>
                        }

                      </View>

                    </View>
                  </View>
                  <View style={styles.botoesItem}>


                  </View>
                </View>
              </ListItem>
            )}
          />
        </View>
        <View style={styles.metodoPagamento}>
          <Text>Forma de pagamento</Text>
          <Body style={{ flexDirection: 'row', alignSelf: 'flex-start' ,padding:10}}>
            <CheckBox
              disabled={true}
              value={toggleCheckBoxFormaPagamento}
              onValueChange={() => toggleCheckBoxFormaPagamento ? setToggleCheckBoxFormaPagamento(false) : setToggleCheckBoxFormaPagamento(true)}
            />
            <Label>Dinheiro</Label>
          </Body></View>
        <View style={styles.total}>
        <Text style={{fontWeight:'bold'}}>Valor frete:         {isDentroAreaEntrega?'Gratis': carrinho.valorFrete}</Text>
        <TotalDesconto itens={carrinho.itens}></TotalDesconto>
        <TotalCompra itens={carrinho.itens}></TotalCompra>
      
        </View>
      </ScrollView>
      <View style={styles.footer}>
      <Button title="Finalizar Compra" buttonStyle={{backgroundColor:'red',margin:5}}
            success
            onPress={() =>
              dispatch(finalizarCompra(carrinho, userLogado, navigation))
             
            }>
          </Button>
      </View>


    </View>
  );
}


export default connect((state) => ({
  carrinho: state.carrinhoReducer,
  userLogado: state.authReducer,
  isDentroAreaEntrega: state.mapsReducer
}))(FinalizarPedidoForaArea);

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  enderecoEntrega: {
    height: heightToDp('15%'),

  },
  itensPedido: {
    borderTopColor: 'black',
    borderWidth: 1
    , padding: 5
  },
  metodoPagamento: {
    padding:10
  },
  total: {
    
    borderTopColor: 'black',
    borderWidth: 1,
    padding:10
  },
  footer: {
    padding:10
  },
  info: {
    flex: 3,

  },
  titulo: {
    height: 50,
    backgroundColor: 'red',
    alignItems: 'center'
  },
  conteudo: {
    flex: 4,
  },


  listaItensContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightToDp('10%')
  },
  imagemBox: {
    width: widthToDp('10%'),
    height: heightToDp('10%')
  },
  conteudoItem: {
    justifyContent: 'space-around',
    flex: 1
  },
  botoesItem: {
    width: widthToDp('22%')
  },
  imagem: {

    width: widthToDp('15%')
  },


  titulo: {
    borderBottomWidth: 1,
    height: heightToDp('6%'),
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

    marginTop: widthToDp('1%'),
    width: widthToDp('10%')

  },
  footerCarrinho: {
    flex: 1
  },
  listaItens: {

    height: heightToDp('55%')
  },

  safeAreaStyle: {
    backgroundColor: 'white',
    flex: 1,
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
