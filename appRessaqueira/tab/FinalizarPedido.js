import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  SafeAreaView,

  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../CustomHeader';
import { ListItem, Body, Label } from 'native-base';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import Geocoder from 'react-native-geocoding';
import { Input, Overlay, Button, Text } from 'react-native-elements';
import {  point, polygonAreaEntrega } from '../utils/Utils';
import Geolocation from 'react-native-geolocation-service';
import GeoFencing from 'react-native-geo-fencing';
import { formataMoeda } from '../utils/Utils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function FinalizarPedido({ navigation, carrinho, userLogado, isDentroAreaEntrega, dispatch }) {

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBoxFormaPagamento, setToggleCheckBoxFormaPagamento] = useState(true);
  const [valorPago, setValorPago] = useState('0');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [telefoneUsuario, setTelefoneUsuario] = useState('');
  const [usuarioLog, setUsuarioLog] = useState('');
  const [dentroArea, setDentroArea] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleLoading, setVisibleLoading] = useState(false);
  const [sequence, setSequence] = useState(0);
  const [valorTotalDesconto, setValorTotalDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [codigoPedido, setCodigoPedido] = useState('');




  useEffect(() => {


    console.log(mostrarProps(userLogado,'USER_LOGADO_FINALIZAR_PEDIDO_INICIO'));

    console.log(mostrarProps(userLogado.providerData,'providerData_FINALIZAR_PEDIDO_INICIO'));


    Geolocation.getCurrentPosition(
      (position) => {
        let point = {
          lat: -22.608012,
          lng: -43.178515
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

            console.log('point is NOT within polygon', error)
            setDentroArea(false)

          }

          )
      },
      (error) => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })

  }, [])

  function dataAtualFormatada() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  async function buscarCodigo(){

  console.log('INICIO FUNCAO BUSCAR CODIGO')

  const users = await firestore()
  .collection('ChavePedido')
  .get();
var codigo;
users.forEach((doc) => {

  var data = new Date(),
  dia = data.getDate().toString(),
  diaF = (dia.length == 1) ? '0' + dia : dia,
  mes = (data.getMonth() + 1).toString(),
  mesF = (mes.length == 1) ? '0' + mes : mes,
  anoF = data.getFullYear();


codigo = anoF + "" + mesF + "" + diaF + "" + parseInt(doc.data().idPedido + 1);
console.log('FOR EACH ',codigo)
});
console.log('FIM FUNCAO BUSCAR CODIGO')
return codigo;

}
async function salvarPedido(codigo){

  console.log('INICIO FUNCAO SALVAR PEDIDO')
  firestore()
  .collection('Pedidos')
  .add({
    dataPedido: dataAtualFormatada(),
    uidUser: userLogado.uid,
    emailUser: userLogado.email,
    nomeUser: userLogado.displayName,
    telUser: userLogado.telefoneUsuario,
    idPedido: codigo,
    itens: carrinho.itens,
    valorTotal: carrinho.itens.reduce(
      (valorAcumulado, item) => valorAcumulado + item.preco * item.qtdeItems,
      0,
    ),
    statusPedido: dentroArea ? 0 : 5,
    isTroco: toggleCheckBox,
    trocoPara: parseInt(valorPago),
    valorFrete: 0,
    enderecoEntrega: enderecoEntrega
  })
  .then(() => {
    console.log('Pedido added!');
    //updateSequence();
  }).catch(console.log('ERRO'));
  atualizarEstoque(carrinho.itens);
  setVisibleLoading(false);
  setVisible(true);


console.log('FIM FUNCAO SALVAR PEDIDO')
return {
  itens: carrinho.itens,
  valorTotal: carrinho.itens.reduce(
    (valorAcumulado, item) => valorAcumulado + item.preco * item.qtdeItems,
    0,
  ),
  emailUser: userLogado.email,
  nomeUser: userLogado.displayName,
  telUser: userLogado.telefoneUsuario,
  enderecoEntrega: enderecoEntrega
};

}
async function sendEmail(idCompra,toMailCliente,emailTipo,statusNovo,carrinhoCompra){

  console.log('### FUNCAO ENVIAR EMAIL ',carrinhoCompra)
    
  let URL_LOCAL = 'http://192.168.1.66:8080/sendEmail/'+idCompra+'/'+toMailCliente+'/'+emailTipo+'/'+statusNovo
  let URL = 'https://sendemailservice-323311.rj.r.appspot.com/sendEmail/'+idCompra+'/'+toMailCliente+'/'+emailTipo+'/'+statusNovo

  let resp = await fetch(URL_LOCAL,{
    method:'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(carrinhoCompra)
  });
  
  
  console.log('Chamada serviço Email' , URL);
}

function atualizarEstoque(itens){
  itens.forEach((it,index)=>{
    const item = firestore().doc(`Produtos/${it.key}`);
    console.log(mostrarProps(it,'ITEM_UPDATE'))
    it.qtdeDisponivel = it.qtdeDisponivel - it.qtdeItems;
    item.update(it).then(console.log('Produto Update',it.key)).catch((error)=>{
      console.log(error,it.key)
    })
  })
  

}

 async  function finalizarCompra() {
  console.log('INICIO FUNCAO FINALIZAR COMPRA')
    
      //getIdPedido();

      const codigo = await buscarCodigo();


      console.log('######CODIGO FORA', codigo);
    const carrinhoCompra =   await salvarPedido(codigo);
      console.log('FIM FUNCAO FINALIZAR COMPRA', carrinhoCompra)
      setCodigoPedido(codigo)
      dispatch(updateCarrinho());
      let tipoEmail = isDentroAreaEntrega.isDentroAreaEntrega ? 'NOVA_COMPRA' : 'NOVA_COMPRA_FORA_AREA'
      console.log('###### TIPO_EMAIL ',tipoEmail,isDentroAreaEntrega)
      sendEmail(codigo,userLogado.email,tipoEmail,'Recebido',carrinhoCompra)
  

  }
  function updateCarrinho(){
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
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();



    //console.log(mostrarProps(getIdPedido(),'getIdPedido'))
    return anoF + '' + mesF + '' + diaF + '' + idPedidoGlobal;

  }


  function getIdPedido() {
    firestore()
      .collection('ChavePedido')
      .onSnapshot((querySnapshot) => {

        if (querySnapshot) {
          querySnapshot.forEach((documentSnapshot) => {

            var data = new Date(),
              dia = data.getDate().toString(),
              diaF = (dia.length == 1) ? '0' + dia : dia,
              mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
              mesF = (mes.length == 1) ? '0' + mes : mes,
              anoF = data.getFullYear();
            console.log('#######QUERY_ID_PEDIDO', documentSnapshot.get('idPedido'))
            setCodigoPedido(anoF + "" + mesF + "" + diaF + "" + documentSnapshot.get('idPedido'))
            console.log('######CODIGO', codigoPedido);
          });

        }
      });

  }

  function updateSequence() {

    firestore()
      .collection('ChavePedido')
      .doc('B9UTDNHg0SJRzHzgaQIV')
      .get()
      .then(documentSnapshot => getIdCode(documentSnapshot))
      .then(idCodigo => {
        const chavePedido = firestore().doc('ChavePedido/B9UTDNHg0SJRzHzgaQIV');
        let seq = parseInt(idCodigo);
        seq++;
        chavePedido.update(
          {
            idPedido: seq
          })
          ;
      });
    //getIdPedido();

  }

  function getIdCode(documentSnapshot) {

    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    setCodigoPedido("Teste");
    console.log('############TESTE');
    //setCodigoPedido(anoF + "" + mesF + "" + diaF + "" +documentSnapshot.get('idPedido'))
    return documentSnapshot.get('idPedido');
  }

  function mostrarProps(obj, nomeDoObj) {
    var resultado = '';
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        resultado += nomeDoObj + '.' + i + ' = ' + obj[i] + '\n';
      }
    }
    return resultado;
  }



  //REALTIME GET FUNCTION
  async function getTelUsuario() {

    const users = await firestore()
      .collection('Usuarios')
      .get();
    var telCad;
    users.forEach((doc) => {

      if (userLogado.uid === doc.data().uid) {


        setTelefoneUsuario(doc.data().telefoneUsuario);
        telCad = doc.data().telefoneUsuario
      }
    });

    return telCad;
  }



  async function isTelCadastrado() {

    var telCad = await getTelUsuario();




    if (telCad) {

      return true;
    } else {

      return false;
    }

  }
  function setIsTroco(isTroco) {
    console.log('CHECKBOX!!!')
    isTroco ? setInfoPedido(infoPedido) : setInfoPedido(infoPedido)
    return isTroco
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

  return (
    <View style={styles.container}>

      <CustomHeader navigation={navigation} />

     



      <Overlay isVisible={visible} animated animationType='fade' overlayStyle={{
        width: wp('70%'), height: hp('35%')
      }} >
        <View style={{  flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{width:85,height:70}}
        source={require('../assets/ressaqueira1.jpeg')}></Image>
          <View style={{ flex:1 }}><Text>Compra Realizada!</Text></View>
          <View style={{flex:1 }}><Text>Numero do pedido: {codigoPedido}</Text></View>
          <View style={{flex:1 }}><Button buttonStyle={{ backgroundColor: 'red', width: wp('20%') }} title='Ok' onPress={() => {
            setVisible(false);
            updateSequence();
            navigation.popToTop();
          }}></Button></View>

        </View>
      </Overlay>
      <Overlay isVisible={visibleLoading} animated animationType='fade' overlayStyle={{
          width: wp('70%'), height: hp('35%'),
          justifyContent: 'space-around', alignItems: 'center'
        }}>
          <Image style={{width:85,height:70}}
           source={require('../assets/ressaqueira1.jpeg')}></Image>
          <Text>...Finalizando a compra</Text>
          <ActivityIndicator color='red' size='large'></ActivityIndicator>

        </Overlay>
      <ScrollView>
        <View style={styles.enderecoEntrega}>
          <Text h4>Informações do pedido</Text>
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


                  </View>
                </View>
              </ListItem>
            )}
          />
        </View>
        <View style={styles.metodoPagamento}>
          <Text>Forma de pagamento</Text>
          <Body style={{ flexDirection: 'row', alignSelf: 'flex-start', padding: 10 }}>
            <CheckBox
              disabled={true}
              value={toggleCheckBoxFormaPagamento}
              onValueChange={() => toggleCheckBoxFormaPagamento ? setToggleCheckBoxFormaPagamento(false) : setToggleCheckBoxFormaPagamento(true)}
            />
            <Label>Dinheiro</Label>
          </Body></View>
        <View style={styles.total}>
          <Text style={{ fontWeight: 'bold' }}>Valor frete:         {isDentroAreaEntrega.isDentroAreaEntrega ? 'Gratis' : 'A calcular'}</Text>
          <TotalDesconto itens={carrinho.itens}></TotalDesconto>
          <TotalCompra itens={carrinho.itens}></TotalCompra>

        </View>
      </ScrollView>
      <View style={styles.footer}>

       
            <Button title="Finalizar Compra" buttonStyle={{ backgroundColor: 'red', margin: 5 }}
              success
              onPress={async () => {

                if (!userLogado.uid) {
                  navigation.navigate('Perfil')
                } else{
                  console.log("INICIO FUNCAO BOTAO FINALIZAR", userLogado)
                  var telCad = await isTelCadastrado();
                  if (!telCad) {
                    console.log("Necessário cadastrar um telefone para avançar")
                    Alert.alert('Necessário cadastrar um telefone para avançar')
                  } else {
                    console.log("telefone para avançar")
                    setVisibleLoading(true)
                    dispatch( finalizarCompra(carrinho, userLogado, navigation))
                  }
                  console.log("FIM FUNCAO BOTAO FINALIZAR")
                }
            
              }
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
}))(FinalizarPedido);

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  enderecoEntrega: {
    height: hp('27%'),
    padding: 10,
    marginBottom: 5

  },
  itensPedido: {
    borderTopColor: 'black'
   
    , padding: 5
  },
  metodoPagamento: {
    padding: 10
  },
  total: {

    borderTopColor: 'black',
    borderWidth: 1,
    padding: 10
  },
  footer: {
    padding: 10
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
    height: hp('10%')
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
    width: wp('22%')
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

    marginTop: wp('1%'),
    width: wp('10%')

  },
  footerCarrinho: {
    flex: 1
  },
  listaItens: {

    height: hp('55%')
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
