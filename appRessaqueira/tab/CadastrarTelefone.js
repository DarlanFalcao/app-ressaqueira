import React, { Component, useState, useEffect } from 'react';

import CustomHeader from '../CustomHeader';
import { SafeAreaView, View, Alert } from 'react-native';
import { Text, Input, Button, Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import mostrarProps, { widthToDp, heightToDp } from '../utils/Utils';
import firestore from '@react-native-firebase/firestore';
import { maskCep, maskPhone, maskCurrency } from "../utils/Mask";
import AsyncStorage from '@react-native-async-storage/async-storage';

function CadastrarTelefone({ userLogado, navigation,dispatch }) {

  const [telefoneUsuario, setTelefoneUsuario] = useState('');
  const [idUser, setIdUser] = useState("");
  const [visible, setVisible] = useState(false);
  const [userCadBd, setUserCadBd] = useState(false);
  

  useEffect(() => {
    console.log("INICIO USEREFFECT",userLogado);
    getUsuario();

  }, [])

    //REALTIME GET FUNCTION
    async function getUsuario() {

      const users = await firestore()
        .collection('Usuarios')
        .get();
     
      users.forEach((doc) => {
        if (userLogado.uid === doc.data().uid) {
          setUserCadBd(true)
          setTelefoneUsuario(doc.data().telefoneUsuario);
          setIdUser(doc.id)
          
        }
      });
  

    }
    const storeData = async (value) => {
      try {
       await AsyncStorage.setItem('@telefone', value)
      } catch (e) {
       console.log(e);
      }
    }

  function salvarTelefone() {

    console.log('>>>>> STEP 1')

    if (telefoneUsuario === null || telefoneUsuario === undefined || telefoneUsuario === '') {
    Alert.alert("Telefone não pode ser vazio!")
    }
    else{
      console.log('>>>>> STEP 2',telefoneUsuario.length)
      const user = firestore().doc(`Usuarios/${idUser}`);
      
      if (!userCadBd) {
       
          
        console.log('>>>>> STEP 3 - ADD')
         firestore().collection('Usuarios').add({
          phoneNumber: userLogado.phoneNumber,
          photoURL: userLogado.photoURL,
          displayName: userLogado.displayName,
          email: userLogado.email,
          isAnonymous: userLogado.isAnonymous,
          emailVerified: userLogado.emailVerified,
          providerId: userLogado.providerId,
          uid: userLogado.uid,
          telefoneUsuario:telefoneUsuario
        }).then(()=>{
          storeData(telefoneUsuario);
          setVisible(true);
        })
  
      } else {
        console.log('>>>>> STEP 4 - UPDATE')
        
        user.update(
          {
            phoneNumber: userLogado.phoneNumber,
            photoURL: userLogado.photoURL,
            displayName: userLogado.displayName,
            email: userLogado.email,
            isAnonymous: userLogado.isAnonymous,
            emailVerified: userLogado.emailVerified,
            providerId: userLogado.providerId,
            uid: userLogado.uid,
            telefoneUsuario:telefoneUsuario
          }).then(()=>{
            storeData(telefoneUsuario);
            setVisible(true);
          })
      }
      const users =  firestore()
    .collection('Usuarios')
    .get();
    console.log('>>>>> STEP 5')
    
    }
    
    console.log('>>>>> STEP 6')
    return {
      type: 'AUTH_UPDATE',
      
      userLogado:{
        phoneNumber: userLogado.phoneNumber,
        photoURL: userLogado.photoURL,
        displayName: userLogado.displayName,
        email: userLogado.email,
        isAnonymous: userLogado.isAnonymous,
        emailVerified: userLogado.emailVerified,
        providerId: userLogado.providerId,
        uid: userLogado.uid,
        telefoneUsuario:telefoneUsuario
      }
      
    };
  
    
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Overlay isVisible={visible} animated animationType='fade' overlayStyle={{
        width: widthToDp('70%'), height: heightToDp('30%'),
        justifyContent: 'space-around', alignItems: 'center'
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: widthToDp('5%') }}>Telefone Cadastrado!</Text>
        <Button buttonStyle={{ backgroundColor: 'red', width: widthToDp('20%') }} title='Ok' onPress={() => {
          setVisible(false);
          navigation.navigate('Perfil');
        }}></Button>
      </Overlay>
      <CustomHeader navigation={navigation} />
      <View style={{ padding: 10, justifyContent: 'center' }}>

        <Text h4>Inserir novo telefone</Text>
        <Input
          inputStyle={{ marginTop: 100 }} leftIconContainerStyle={{ marginTop: 100 }}
          value={telefoneUsuario}
          maxLength={14}
          placeholder="(XX)XXXXX-XXXX"
          leftIcon={{ type: 'font-awesome', name: 'phone' }}
          keyboardType="phone-pad"
          onChangeText={(telefoneUsuario) => {
            console.log(telefoneUsuario);
            setTelefoneUsuario(maskPhone(telefoneUsuario))
          }
          }
        />
        <Button title='Salvar Telefone' onPress={() =>dispatch(salvarTelefone())}
        disabled={telefoneUsuario.length < 14}
          buttonStyle={{ backgroundColor: 'red', marginTop: 100 }}></Button>
      </View>
    </SafeAreaView>
  );
}

export default connect((state) => ({ userLogado: state.authReducer }))(CadastrarTelefone);
