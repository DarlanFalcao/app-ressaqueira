import React, {Component, useState} from 'react';
import {
  Container,
  Header,
  Content,
  Text,
  Button,
  Toast,
  View,
  Item,
  Input,
} from 'native-base';

import CustomHeader from '../CustomHeader';
import {SearchBar} from 'react-native-elements';
import {SafeAreaView} from 'react-native';
import ListaProdutos from './ListaProdutos';
function Busca({navigation}) {
  const [search, setSearch] = useState();
  const [searchKey, setSearchKey] = useState('');

  function updateSearch() {
    if (typeof search != "undefined") {
    if (search.length >= 3 && typeof search !== "undefined") {
      
      setSearchKey(search);
    }
  }
  }

  function BuscarItem() {
    return <ListaProdutos nome={search} navigation={navigation}></ListaProdutos>;
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <CustomHeader navigation={navigation} />
      <SearchBar
        lightTheme
        round
        placeholder="Pesquise aqui..."
        onChangeText={(search) => {
          setSearch(search);
          updateSearch();
        }}
        value={search}
      />
      <Text>{search}</Text>
      <BuscarItem></BuscarItem>
    </SafeAreaView>
  );
}

export default Busca;
