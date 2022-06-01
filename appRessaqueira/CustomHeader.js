import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import { Icon, Badge } from 'react-native-elements';

const CustomHeader = ({navigation,isHome,carrinho,userLogado}) => (
  <View
  style={{
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    backgroundColor:'black'
  }}>
  {isHome ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1,
        
      }}>
      <Icon size={27}
        
        name="menu"
        color='red'
        onPress={() => navigation.openDrawer()}
      />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1,
      }}>
      <Icon
        style={{ marginLeft: 5}}
        name="arrow-left"
        type="font-awesome"
        color='red'
        onPress={() => navigation.goBack()}
      />
    </View>
  )}

  <View
    style={{
      flex: 3,
      flexDirection:'row',
      justifyContent: 'center',
      borderWidth: 1,
      
    }}>
    <Image
        style={styles.logo}
        source={require('./assets/ressaqueira3.jpeg')}></Image>
        <Image
        style={styles.logo2}
        source={require('./assets/logoNovoRemovebg.png')}></Image>
  </View>
  <View style={{flex: 1, borderWidth: 1, alignContent:'center',alignSelf:'center' ,justifyContent:'space-around',marginRight:5, flexDirection:'row'}}>
  <View >
  
  <Icon name="shopping-cart" type="font-awesome" color='red'  onPress={()=>navigation.navigate(userLogado.email?'Carrinho':'Perfil')}/>
  {
    carrinho.qtdeItensCarrinho > 0?
    <Badge
    value={<Text style={{color:"white"}}>{carrinho.qtdeItensCarrinho}</Text>}
    status="error"
    containerStyle={{ position: 'absolute', top: -7, right: -7 }}
  />
    :<View></View>
    }
  
  </View>
  </View>
</View>
);

const styles = StyleSheet.create({
  logo: {
    width: 35,
    height: 46,
    alignSelf: 'center',
  },
  logo2: {
    width: 150,
    height: 52,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: 'white',
    fontFamily: 'distress',
  },
  logoBox: {
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  logoBox2: {
    flexDirection: 'row',
    backgroundColor: 'green',
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default connect(state =>({carrinho: state.carrinhoReducer,userLogado:state.authReducer}))( CustomHeader);

