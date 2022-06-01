import React, {Component, useCallback } from 'react';
import {
  
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Button
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {connect} from 'react-redux';

import { Icon, Avatar,Text } from 'react-native-elements';


const instagram = "https://www.instagram.com/ressaqueira/";

const facebook = "https://www.facebook.com/ressaqueira/";

const whatsApp = "21984348074"

const email = "ressaqueiracervejaartesanal@gmail.com";

function openLink(url){
  Linking.openURL(url);
}


function CustomDrawerContent ({navigation,user,dispatch}) {
  return (
    <SafeAreaView style={{flex: 1}}>
       
          {
            user.uid?
            <View
        style={{height: 150, alignItems: 'center', justifyContent: 'center',padding:50}}>
         <Avatar source={{uri: user.photoURL}} rounded size="large"></Avatar>
           
          <Text h4 h4Style={{fontSize:20}}>{user.displayName}</Text>
           </View>:
            <View
            style={{height: 150, alignItems: 'center', justifyContent: 'center',padding:50}}>
             
           <Image
          source={require('./assets/social-media.png')}
          style={{height: 120, width: 120, borderRadius: 60}}></Image>
          </View>
          }
        
     
      <ScrollView style={{marginLeft: 5}}>
     
        <TouchableOpacity
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('MenuTab')}>
          <View style={styles.iconDrawer}>
            <AntDesign name="home" color="red" size={16} />
            <Text style={styles.texto}>Home</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 20}}
          onPress={() => navigation.navigate(user.displayName?'MeusPedidos':'Perfil')}>
          <View style={styles.iconDrawer}>
            <AntDesign name="shoppingcart" color="red" size={16} />
            <Text style={styles.texto}>Meus Pedidos</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('AreaEntrega')}>
          <View style={styles.iconDrawer}>
            <AntDesign name="car" color="red" size={16} />
            <Text style={styles.texto}>Área de entrega</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('Contato')}>
          <View style={styles.iconDrawer}>
            <AntDesign name="phone" color="red" size={16} />
            <Text style={styles.texto}>Contatos</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 20}}
          onPress={() => navigation.navigate('QuemSomos')}>
          <View style={styles.iconDrawer}>
            <AntDesign name="infocirlce" color="red" size={16} />
            <Text style={styles.texto}>Quem Somos</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.socialIcon}>
        
        <Icon size={30} name="facebook-square" type="font-awesome"
            onPress={()=> openLink(facebook)} />

          <Icon size={30} name="instagram" type="font-awesome" 
          onPress={()=> openLink(instagram)} />
          <Icon size={30} name="whatsapp" type="font-awesome" />
          <Icon name="email" type='zocial' 
          onPress={()=> openLink(email)}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )};



const styles = StyleSheet.create({
  drawerStyle: {
    textDecorationColor: 'red',
    color: 'red',
  },
  iconDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
  },
  socialIcon: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 50,
    paddingTop: 130,
  },
  rotas: {},
  perfil: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    color: 'black',
    fontSize: 17,
    fontStyle: 'italic',
    marginLeft: 10,
  },
  });
  

  export default connect(state => ({user: state.authReducer}))(
    CustomDrawerContent,
  );