import React, {Component} from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import CustomHeader from '../CustomHeader';
import mostrarProps from '../utils/Utils';
import { Text, Input, Button } from 'react-native-elements';

export class CadatrarCategoria extends Component {
  
  constructor(props) {
    super(props);
    const {updateMode} = this.props.route.params;
    if (updateMode) {
      const {item} = this.props.route.params;
      console.log(mostrarProps(item, 'item'));
      this.state = {
        nome: item.nome,
        descricao: item.descricao,
        ordem: item.ordem.toString(),
        key: item.key,
        updateMode: true,
      };
    } else {
      this.state = {
        nome: '',
        descricao: '',
        ordem: 0,
        updateMode: false,
      };
    }
  }
  

  salvarCategoria() {
    if(this.state.updateMode){
      firestore()
      .collection('categorias')
      .doc(this.state.key)
      .update({
        descricao: this.state.descricao,
        nome: this.state.nome,
        ordem:parseInt(this.state.ordem)
      })
      .then(() => {
        console.log('Categoria update!');
        this.setState({
          nome: '',
          descricao: '',
          ordem: 0,
          updateMode: false,
        });
      });
    }else{
      firestore()
      .collection('categorias')
      .add({
        descricao: this.state.descricao,
        nome: this.state.nome,
        ordem:parseInt(this.state.ordem)
      })
      .then(() => {
        console.log('Categoria added!');
        this.setState({
          nome: '',
          descricao: '',
          ordem: 0,
          updateMode: false,
        });
      });
    }
    
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, justifyContent:'space-around'}}>
        <CustomHeader navigation={this.props.navigation} />
        <Text h3>Cadastrar Categoria</Text>
        <Input label="Nome"
                  value={this.state.nome}
                  onChangeText={(nome) => this.setState({nome})}
                />
                <Input label="Descrição"
                  value={this.state.descricao}
                  onChangeText={(descricao) => this.setState({descricao})}
                />
                <Input label="Ordem"
                  keyboardType={'number-pad'}
                  value={this.state.ordem}
                  onChangeText={(ordem) =>
                    this.setState({ordem})
                  }
                />
                <Button 
                  title="Salvar"
                  onPress={()=>this.salvarCategoria()}>
                                    
                </Button>
      </SafeAreaView>
    );
  }
}
