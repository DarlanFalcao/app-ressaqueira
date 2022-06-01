import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, Picker, View, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from "react-native-image-picker";

import firestore from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';
import mostrarProps, { widthToDp, heightToDp } from '../utils/Utils';
import CustomHeader from '../CustomHeader';
import { Header, Text, Input, Button, Image, Overlay, ListItem, Icon, CheckBox } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';

const options = {
  title: 'Selecione a foto',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
let list = [];
function getCategorias() {
  const categorias = [];
  console.log('FUNCAO GET_CATEGORIAS NOVO')
  firestore()
    .collection('categorias')
    .orderBy('ordem', 'asc')
    .onSnapshot((querySnapshot) => {

      if (querySnapshot) {
        querySnapshot.forEach((documentSnapshot) => {

          categorias.push({
            label: documentSnapshot.data().descricao,
            value: documentSnapshot.data().nome
          });

        });
      }
    });


  return categorias;
}



export class CadastroProduto extends Component {
  constructor(props) {
    super(props);
    const { updateMode } = this.props.route.params;
    const { listaCategorias } = this.props.route.params;
    console.log('METODO CONSTRUTOR NOVO', listaCategorias);
    list = getCategorias();

    if (updateMode) {
      const { item } = this.props.route.params;


      this.state = {
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco.toString(),
        qtdeDisponivel: item.qtdeDisponivel,
        imagemUpload: {uri:item.urlImagem},
        urlImagem: item.urlImagem,
        subTitulo: item.subTitulo,
        categoria: item.idCategoria,
        key: item.key,
        updateMode: true,
        visible: false,
        visibleLoading: false,
        listaCategorias: listaCategorias,
        response: null
      };

    } else {
      this.state = {
        nome: '',
        descricao: '',
        preco: 0,
        qtdeDisponivel: 0,
        imagemUpload: {},
        urlImagem: '',
        subTitulo: '',
        categoria: '',
        updateMode: false,
        visible: false,
        visibleLoading: false,
        listaCategorias: listaCategorias,
        response: null
      };
    }
  }
  produtos = [];

  componentDidMount() {

    console.log('COMPONENTE DIDMOUNT')
  }

  salvarProduto() {
    if (!this.state.updateMode) {
      firestore()
        .collection('Produtos')
        .add({
          descricao: this.state.descricao,
          nome: this.state.nome,
          subTitulo: this.state.subTitulo,
          preco: parseFloat(this.state.preco),
          qtdeDisponivel: this.state.qtdeDisponivel,
          urlImagem: this.state.urlImagem,
          idCategoria: this.state.categoria,
        })
        .then(() => {
          console.log('Product added!');
          this.setState({
            visible: true,
            visibleLoading: false
          })
          this.setState({
            nome: '',
            descricao: '',
            preco: 0,
            qtdeDisponivel: 0,
            imagemUpload: {},
            urlImagem: '',
            subTitulo: '',
            categoria: '',
            updateMode: false,
          })
        });
    } else {
      firestore()
        .collection('Produtos')
        .doc(this.state.key)
        .update({
          descricao: this.state.descricao,
          nome: this.state.nome,
          subTitulo: this.state.subTitulo,
          preco: parseFloat(this.state.preco),
          qtdeDisponivel: this.state.qtdeDisponivel,
          urlImagem: this.state.urlImagem,
          idCategoria: this.state.categoria,
        })
        .then(() => {
          console.log('Product update!');
          this.setState({
            visible: true,
            visibleLoading: false
          })
          this.setState({
            nome: '',
            descricao: '',
            preco: 0,
            qtdeDisponivel: 0,
            imagemUpload: {},
            urlImagem: '',
            subTitulo: '',
            categoria: '',
            updateMode: false,
          })
        });
    }
  }
  onValueChange2(value) {
    this.setState({
      categoria: value.nome,
    });
    console.log(mostrarProps(value, "VALUE"))
  }

  imagemEvento = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('UPLOAD!!');
      console.log('FileName = ', response.fileName);
      console.log('Path = ', response.path);
      this.state.imagemUpload = response;
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        this.setState({
          avatarSource: source,
        });
      }
    });
  };



  render() {
    return (
      <ScrollView style={{ flex: 1 }} >
        <CustomHeader navigation={this.props.navigation} />
        <Text h3 style={{alignSelf:'center'}}>Cadastro de Produtos</Text>
        <Overlay isVisible={this.state.visible} animated animationType='fade' overlayStyle={{
          width: widthToDp('70%'), height: heightToDp('30%'),
          justifyContent: 'space-around', alignItems: 'center'
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: widthToDp('5%') }}>Produro Cadastrado!</Text>
          <Button buttonStyle={{ backgroundColor: 'red', width: widthToDp('20%') }} title='Ok' onPress={() => {
            this.setState({
              visible: false,
              visibleLoading: false
            })
            this.props.navigation.navigate('Controle');
          }}></Button>
        </Overlay>
        <Overlay isVisible={this.state.visibleLoading} animated animationType='fade' overlayStyle={{
          width: widthToDp('70%'), height: heightToDp('30%'),
          justifyContent: 'space-around', alignItems: 'center'
        }}>
          <Text>...Salvando Produto</Text>
          <ActivityIndicator color='red' size='large'></ActivityIndicator>

        </Overlay>
       
        <View >
          <Text style={{ color: 'red', alignSelf: 'center',fontWeight:'bold', margin:5 }}>Selecione a categoria do produto</Text>
          <DropDownPicker placeholder='Selecione uma categoria'
            items={getCategorias()}
           

            containerStyle={{ height: 40 ,margin:10}}
            style={{ backgroundColor: '#fafafa' }}
            itemStyle={{
              justifyContent: 'flex-start'
            }}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
            onChangeItem={item => {
              this.setState({
                categoria: item.value
              })
              console.log(mostrarProps(this.state, "STATE"))
            }
            }
          />
        </View>


        <Input label="Nome"
          value={this.state.nome}
          onChangeText={(nome) => this.setState({ nome })}

        />
        <Input
          label="Sub-titulo"
          value={this.state.subTitulo}
          onChangeText={(subTitulo) => this.setState({ subTitulo })}
        />
        <Input
          label="Descrição"
          value={this.state.descricao}
          onChangeText={(descricao) => this.setState({ descricao })}
        />
        <Input label="Preço"
          keyboardType={'number-pad'}
          value={this.state.preco}
          onChangeText={(preco) => this.setState({ preco })}
        />
        <Input label="Quantidade em estoque"
          keyboardType={'number-pad'}
          value={this.state.qtdeDisponivel}
          onChangeText={(qtdeDisponivel) =>
            this.setState({ qtdeDisponivel })
          }
        />



        <Button
          title="Tirar Foto"
          buttonStyle={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
          onPress={() =>
            ImagePicker.launchCamera(
              {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200,
              },
              (response) => {
                this.setState({ imagemUpload: response });
              },
            )
          }
        />
        <Button
          buttonStyle={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
          title="Carregar Foto"
          onPress={() =>
            ImagePicker.launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200,
              },
              (response) => {
                this.setState({ imagemUpload: response });
              },
            )
          }
        />
        <View style={{
          marginVertical: 24,
          alignItems: 'center',
        }}>
         <Image
          style={{ width: 200, height: 200 }}
          source={{ uri: this.state.imagemUpload.uri }}
        />
          
          
        </View>
        <Button
          title="Salvar"
          buttonStyle={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}

          onPress={async () => {
            this.setState({
              visibleLoading: true
            })
            if (!this.state.updateMode) {
              console.log('MODO NOVO!');
              var storageRef = storage().ref(
                this.state.imagemUpload.fileName,
              );
              var path = this.state.imagemUpload.uri;
              storageRef.putFile(path).on(
                storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                  console.log('snapshot: ' + snapshot.state);
                  console.log(
                    'progress: ' +
                    (snapshot.bytesTransferred / snapshot.totalBytes) *
                    100,
                  );

                  if (snapshot.state === storage.TaskState.SUCCESS) {
                    console.log('Success');
                  }
                },
                (error) => {
                  unsubscribe();
                  console.log('image upload error: ' + error.toString());
                },
                () => {
                  storageRef.getDownloadURL().then((downloadUrl) => {
                    console.log('File available at: ' + downloadUrl);
                    this.state.urlImagem = downloadUrl;
                    this.salvarProduto();
                  });
                },
              );
            } else {
              console.log('MODO UPDATE!');
              // if (typeof(myVariable) != "undefined")
              if (typeof (this.state.imagemUpload.fileName) === "undefined") {
                console.log('MODO IMAGEMUPLOAD VAZIO!VALOR FILENAME: ');
                this.salvarProduto();
              } else {
                console.log('MODO IMAGEMUPLOAD COM VALOR!' + this.state.imagemUpload.fileName);
                var storageRef = storage().ref(
                  this.state.imagemUpload.fileName,
                );
                var path = this.state.imagemUpload.uri;
                storageRef.putFile(path).on(
                  storage.TaskEvent.STATE_CHANGED,
                  (snapshot) => {
                    console.log('snapshot: ' + snapshot.state);
                    console.log(
                      'progress: ' +
                      (snapshot.bytesTransferred / snapshot.totalBytes) *
                      100,
                    );

                    if (snapshot.state === storage.TaskState.SUCCESS) {
                      console.log('Success');
                    }
                  },
                  (error) => {
                    unsubscribe();
                    console.log('image upload error: ' + error.toString());
                  },
                  () => {
                    storageRef.getDownloadURL().then((downloadUrl) => {
                      console.log('File available at: ' + downloadUrl);
                      this.state.urlImagem = downloadUrl;
                      this.salvarProduto();
                    });
                  },
                );
              }
            }
          }
          }>

        </Button>
      </ScrollView>
    );
  }
}
