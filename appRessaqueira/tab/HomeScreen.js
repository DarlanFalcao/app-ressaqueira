import React, { Component, useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  View,

  StyleSheet,
  Alert,
} from 'react-native';

import {
  Container,
  Tabs,
  Tab,
  ScrollableTab,

} from 'native-base';
import { connect } from 'react-redux';
import ListaProdutos from './ListaProdutos';
import carrinhoReducer from '../store/reducers/carrinhoReducer';
import CustomHeader from '../CustomHeader';
import getCategorias from './ListaCategorias';
import Geolocation from 'react-native-geolocation-service';
import GeoFencing from 'react-native-geo-fencing';
import {  pointDentroArea, polygonAreaEntrega, widthToDp, heightToDp } from '../utils/Utils';
import { Button } from 'react-native-elements';
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from 'react-native-splash-screen';
import { Permission, PERMISSION_TYPE } from '../AppPermission';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';




const categorias = getCategorias();

let bool = false;

function mostrarPropsNovo(obj, nomeDoObj) {
  var resultado = '';
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      resultado += nomeDoObj + '.' + i + ' = ' + obj[i] + '\n';
    }
  }
  return resultado;
}







function HomeScreen({ carrinho, isDentroAreaEntrega, userLogado, dispatch, navigation }) {
  const [dentroArea, setDentroArea] = useState(false)
  const [erroGps,setErroGps] = useState(false);
  const unsubscribe = NetInfo.addEventListener(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
  });
 

  
function ButtonCarrinho({ navigation, carrinho, userLogado,erroGps }) {
  

  if (carrinho.showButtonCarrinho) {
    return (
      <Button title='Ir para o carrinho'

        buttonStyle={styles.buttonCarrinho}
        onPress={() => {
          getPosition();
          if(erroGps){
            Alert.alert('Necessário Ligar o GPS para avançar!');
            setErroGps(false);
          }else{
            dispatch(atualizarAreaEntrega());
            console.log('USUARIOLOGADO########## ', userLogado.displayName ? 'USUARIO_LOGADO' : 'USUARIO_NAO_LOGADO')
            console.log(mostrarPropsNovo( 'USER_LOGADO',userLogado))
            navigation.navigate(userLogado.uid ? 'Carrinho' : 'Perfil')
          }
        
        }}>

      </Button>
    );
  } else {
    return <View></View>;
  }
}
function atualizarAreaEntrega(){
  console.log("########## ATUALIZAR AREA ENTREGA",dentroArea)
  return {
    type: 'MAPS_UPDATE',
    isDentroAreaEntrega: dentroArea
  }
}

function getPosition()
{
  
  Geolocation.getCurrentPosition(
    (position) => {
      let point = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      GeoFencing.containsLocation(point, polygonAreaEntrega)
        .then(() => {
          console.log('point is within polygon',dentroArea)
          setDentroArea(true);
          setErroGps(false);
          
          console.log('point is within polygon',dentroArea)

        })
        .catch((error) => {
          
          console.log('point is NOT within polygon',error)
          setDentroArea(false)
          
          setErroGps(false);
          console.log('point is NOT within polygon',dentroArea)
        }

        )
        
    },
    (error) => setErroGps(true),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );

}



  useEffect(() => {
    console.log("###############################     USEEFFECT HOMESCREEN    ##############################################")
    
    Permission.requestMultiple([PERMISSION_TYPE.camera, PERMISSION_TYPE.localCoarse, PERMISSION_TYPE.localFine, PERMISSION_TYPE.photo]);
    
    
    bool = false;
    unsubscribe();
    let region = {};
    
    Geolocation.getCurrentPosition(
      (position) => {
        let point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
  
        GeoFencing.containsLocation(point, polygonAreaEntrega)
          .then(() => {
            setDentroArea(true);
            console.log('point is within polygon',dentroArea)
         })
          .catch((error) => {
            
            
            setDentroArea(false)
            
            console.log('point is NOT within polygon',error)
            console.log('point is NOT within polygon',dentroArea)
  
          }
  
          )
          setErroGps(false);
      },
      (error) => setErroGps(true),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );



   

    SplashScreen.hide();
  }, [])

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <CustomHeader isHome={true} navigation={navigation} />
      <Container>
        {
          dentroArea?
          <View></View>:
           <Text>Ops!! Sua localização atual é fora da nossa área de entrega....mas não se preocupe,você pode realizar o pedido que avaliaremos a possibilidade de entregar na sua região, acompanhe o andamento do seu pedido na seção Meus Pedidos</Text>
         
        }
        
        <Tabs
          style={{ backgroundColor: 'white' }}
          tabBarUnderlineStyle={{ borderBottomWidth: 1 }}
          renderTabBar={() => <ScrollableTab />}>
          {categorias.map((cat) => (
            <Tab key={cat.key}

              heading={cat.descricao}
              tabStyle={{ backgroundColor: 'white' }}
              textStyle={{ color: '#1a0000' }}
              activeTabStyle={{ backgroundColor: 'red' }}
              activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
              <ListaProdutos
                categoria={cat.nome}
                navigation={navigation}
                usuarioLogado={userLogado}></ListaProdutos>
            </Tab>
          ))}
        </Tabs>
      </Container>

      <View style={styles.footer}>
        <ButtonCarrinho
          carrinho={carrinho}
          navigation={navigation}
          userLogado={userLogado}
          erroGps={erroGps}></ButtonCarrinho>

      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,

  },
  listaItens: {
    backgroundColor: 'white',
    flex: 5
  },
  footer: {
    marginBottom: heightToDp('5%'),
    backgroundColor: 'white'
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
  listaProdutosHeader: {
    fontSize: 20,
  },
  buttonCarrinho: {
    backgroundColor: 'red',
    margin: widthToDp('1%')
  },
});

export default connect((state) => ({ carrinho: state.carrinhoReducer, isDentroAreaEntrega: state.mapsReducer, userLogado: state.authReducer }))(
  HomeScreen,
);
