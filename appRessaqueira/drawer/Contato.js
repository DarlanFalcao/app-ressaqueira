import React, {Component} from 'react';
import { View, SafeAreaView, Image, StyleSheet} from 'react-native';
import CustomHeader from '../CustomHeader';
import {Thumbnail} from 'native-base';
import { Text, Icon } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export class Contato extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader navigation={this.props.navigation} />
        
        <View
          style={{
            flex: 1,
            padding: 15,
            alignItems: 'center'
          }}>
            <Text h2 style={styles.textoCabecalho}>Fale conosco</Text>
          <Thumbnail
            large
            source={require('../assets/fundo1.jpeg')}
            style={{height:hp('35%'), width: wp('65%'), borderRadius: 110}}
          />
        </View>
        <View style={{ flex: 1}}>
        <Text h4 style={styles.textoContatos}>Contatos:</Text>
        <View style={{flexDirection:'row',marginLeft:10}}>
           <Icon name='phone' type='font-awesome'></Icon>
          <Text style={styles.textoContatos}>+55 21 98434-8074</Text>
          </View>
          <View style={{flexDirection:'row',marginLeft:10}}>
          <Icon name='email' type='zocial'></Icon>
          <Text style={styles.textoContatos}>
            ressaqueiracervejaartesanal@gmail.com
          </Text>
          </View>
          
        </View>
        <View style={styles.textoFooter}>
          <Text h4>Falar com Rafael Estole</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textoCabecalho: {
    fontSize: 50,
  },
  textoContatos: {
    fontWeight:'bold',
    marginLeft:6,
    padding:10
  },
  textoFooter: {
    padding:20
  },
});
