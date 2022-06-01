import React, {Component} from 'react';
import { SafeAreaView, Image} from 'react-native';
import CustomHeader from '../CustomHeader';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
} from 'native-base';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export class QuemSomos extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader navigation={this.props.navigation} />
        
            <Card style={{flex: 0}}>
              <CardItem>
                <Left>
                  <Thumbnail source={require('../assets/ressaqueira1.jpeg')} />
                  <Body>
                    <Text>Ressaqueira</Text>
                    <Text>Quem somos</Text>
                    <Text note>Fundada em janeiro de 2019</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Image
                    source={require('../assets/fundo3.jpeg')}
                    style={{height:hp('40%'), width: wp('90%'), padding:10,borderRadius:20}}
                  />
                  <Text style={{padding:10}}>  Cervejaria artesanal caseira de Piabetá, que oferece produtos de qualidade 
                    para quem aprecia uma boa cerveja, e colabora com a cultura cervejeira!</Text>
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent textStyle={{color: '#87838B'}}>
                    <Text>Experimente já!</Text>
                  </Button>
                </Left>
              </CardItem>
            </Card>
        </SafeAreaView>
    );
  }
}
