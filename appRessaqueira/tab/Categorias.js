import React, { Component } from 'react';
import { View, Text,Picker } from 'react-native';
import firestore from '@react-native-firebase/firestore';

class Categorias extends Component {
  constructor(props) {
    super(props);
    this.state = {
        categoria:'',
        cate :[{
            desc:'desc1',
            nome:'nome1'
        },{
          desc:'desc2',
          nome:'nome2'
      }]
    };
  }
  onValueChange2(value) {
    this.setState({
      categoria: value,
    });
    console.log('####CATEGORIA:' + this.state.categoria);
  }
  render() {
       
  
    return (
        <Picker
                  mode="dropdown"
                  placeholder="Selecione a categoria"
                  selectedValue={this.state.categoria}
                  onValueChange={this.onValueChange2.bind(this)}
                  
                   ><Picker.Item label="Selecione a categoria" value="" />
                       {
                        this.state.cate.forEach((cat)=>{
                        <Picker.Item label={cat.desc} value={cat.nome}  />
                      })
                   }
       
       </Picker>
       
    );
  }
}

export default Categorias;



 
