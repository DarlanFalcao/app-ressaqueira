import React, { Component, useEffect, useState } from 'react';
import { View, SafeAreaView,Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-elements';
import mostrarProps from '../utils/Utils';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import sendEmail from '../utils/sendEmail';




function LoginScreen({ carrinho, isDentroAreaEntrega, userLogado, dispatch, navigation }) {


  const [userInicio, setUserInicio] = useState(
    {
     
     }
  );
  const [listaUser,setListaUser] = useState([]);
  const [telUsuario, setTelUsuario] = useState()

  

  useEffect(() => {
    console.log('####### USER EFFECT LOGIN SCREEN');
   
    
    carregarAplicacao();
  }, [])


  async function carregarAplicacao(){
    const userAux = auth().currentUser._user;
    const telefone = await getData();
    console.log(telefone);
    userLogado = {
      phoneNumber: userAux.phoneNumber,
      photoURL: userAux.photoURL,
      displayName: userAux.displayName,
      email: userAux.email,
      isAnonymous: userAux.isAnonymous,
      emailVerified: userAux.emailVerified,
      providerId: userAux.providerId,
      uid: userAux.uid,
      telefoneUsuario:telefone
     }
    dispatch({
      type: 'AUTH_UPDATE',
      userLogado
    });
 
  }
//idCompra/:toEmailCliente/:emailTipo/:statusNovo
  async function sendEmail(idCompra,toMailCliente,emailTipo,statusNovo){
    
   let URL = 'http://192.168.1.66:3000/sendEmail/'+idCompra+'/'+toMailCliente+'/'+emailTipo+'/'+statusNovo

   let resp = await fetch(URL);
   
   
   console.log('Chamada serviço Email' , URL);
 }


const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@telefone')
    console.log("ler dados ",value);
    return value;
  } catch(e) {
    console.log(e);
  }
}



  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'black' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image style={{width:wp('100%'),height:hp('20%'),borderRadius:30}}
        source={require('../assets/logoNovoRemovebg.png')}></Image>
        <Text h5 style={{color:'white',marginTop:45,padding:20, fontWeight:'bold'}}>SEJA BEM VINDO A RESSAQUEIRA!</Text>
        <Text h4 style={{color:'red', fontWeight:'bold'}}>VOCÊ TEM MAIS DE 18 ANOS?</Text>
        <View style={{flexDirection:'row'}}>
        <Button title="Sim" buttonStyle={{ backgroundColor: 'green', marginTop: 100,margin:10,width:wp('20%'),height:hp('7%') }} onPress={() => {
        //sendEmail('12345678','darlanfalcao123@gmail.com','ATUALIZACAO_STATUS','Em separacao')
        navigation.navigate('HomeApp')
        }}></Button>
        <Button title="Não" buttonStyle={{ backgroundColor: 'red', marginTop: 100 ,margin:10,width:wp('20%'),height:hp('7%')}} onPress={() => {
         //carregarAplicacao();
         //navigation.navigate('HomeApp')
        }}></Button>
        </View>
       
      </View>
    </SafeAreaView>
  )

}


export default connect((state) => ({ carrinho: state.carrinhoReducer, isDentroAreaEntrega: state.mapsReducer, userLogado: state.authReducer }))(
  LoginScreen,
);