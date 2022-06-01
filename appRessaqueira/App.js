import * as React from 'react';
import { Root } from "native-base";
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';


import {Provider} from 'react-redux';
import store from './store';

import { RegisterScreen } from './auth/RegisterScreen';
import MeusPedidos from './drawer/MeusPedidos';
import AreaEntrega from './drawer/AreaEntrega';
import { Contato } from './drawer/Contato';
import { QuemSomos } from './drawer/QuemSomos';
import CustomDrawerContent from './CustomDrawerContent';
import HomeScreen from './tab/HomeScreen';
import Carrinho from './tab/Carrinho';
import FinalizarPedido from './tab/FinalizarPedido';
import Produto from './tab/Produto';
import Busca from './tab/Buscar';
import Perfil from './tab/Perfil';
import { Controle } from './tab/Controle';
import { CadastroProduto } from './tab';
import GerenciarPedidos from './tab/GerenciarPedidos';
import { CadatrarCategoria } from './tab/CadastrarCategoria';
import ListaProdutosAdmin from './tab/ListaProdutosAdmin';
import ListaCategoriaAdmin from './tab/ListaCategoriasAdmin';
import FinalizarPedidoForaArea from './tab/FinalizarPedidoForaArea';
import { Teste } from './tab/HomeScreenDetail';
import CadastrarTelefone from './tab/CadastrarTelefone';
import { Promocao } from './tab/Promocao';
import { widthToDp,heightToDp,formataMoeda } from './utils/Utils'
import NovoTeste from './tab/NovoTeste';
import LoginScreen from './auth/LoginScreen';




const Drawer = createDrawerNavigator();
const StackHome = createStackNavigator();
const StackApp = createStackNavigator();
const StackControle = createStackNavigator();
const StackBusca = createStackNavigator();
const StackPerfil = createStackNavigator();
const Tab = createBottomTabNavigator();
const navOptionHandler = () => ({
  headerShown: false,

});




function TabNavigator(){
  return (
<Tab.Navigator
      
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let typeIcon;

          if (route.name === 'Home') {
            iconName = focused
              ?"beer" 
              :"beer";
              typeIcon = focused ? "font-awesome":"font-awesome";
          } else if (route.name === 'Controle') {
            iconName = focused ? "settings":"settings";
          }else if(route.name === 'Busca') {
            iconName = focused ? "search":"search";
          }else if(route.name === 'Perfil') {
            iconName = focused ? "user":"user";
            typeIcon = focused ? "font-awesome":"font-awesome";
          }

          // You can return any component that you like here!
          return <Icon  style={{color: 'red', marginLeft: 5}} name={iconName} type={typeIcon}/>;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'red',
        inactiveTintColor: 'black',
        
      }}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Busca" component={BuscaStack} />
        <Tab.Screen name="Perfil" component={PerfilStack} />
       <Tab.Screen name="Controle" component={ControleStack} />
      </Tab.Navigator>
  )
}

function HomeStack() {
  return (
    <StackHome.Navigator initialRouteName="Home" >
      <StackHome.Screen
        name="Home"
        component={HomeScreen}
        options={navOptionHandler}></StackHome.Screen>
        <StackHome.Screen
        name="Carrinho"
        component={Carrinho}
        options={navOptionHandler}></StackHome.Screen>
        <StackHome.Screen
        name="FinalizarPedido"
        component={FinalizarPedido}
        options={navOptionHandler}></StackHome.Screen>
        <StackHome.Screen
        name="FinalizarPedidoForaArea"
        component={FinalizarPedidoForaArea}
        options={navOptionHandler}></StackHome.Screen>
        <StackHome.Screen
        name="Produto"
        component={Produto}
        options={navOptionHandler}></StackHome.Screen>
        <StackHome.Screen
        name="Teste"
        component={Teste}
        options={navOptionHandler}></StackHome.Screen>
    </StackHome.Navigator>
  );
}


function BuscaStack() {
  return (
    <StackBusca.Navigator initialRouteName="Busca">
      <StackBusca.Screen
        name="Busca"
        component={Busca}
        options={navOptionHandler}></StackBusca.Screen>
    </StackBusca.Navigator>
  );
}
function PerfilStack() {
  return (
    <StackPerfil.Navigator initialRouteName="Perfil">
      <StackPerfil.Screen
        name="Perfil"
        component={Perfil}
        options={navOptionHandler}></StackPerfil.Screen>
        <StackPerfil.Screen
        name="CadastrarTelefone"
        component={CadastrarTelefone}
        options={navOptionHandler}></StackPerfil.Screen>
    </StackPerfil.Navigator>
  );
}
function ControleStack() {
  return (
    <StackControle.Navigator initialRouteName="Controle">
      <StackControle.Screen
        name="Controle"
        component={Controle}
        options={navOptionHandler}></StackControle.Screen>
      <StackControle.Screen
        name="CadastroProdutos"
        component={CadastroProduto}
        options={navOptionHandler}></StackControle.Screen>
        <StackControle.Screen
        name="GerenciarPedidos"
        component={GerenciarPedidos}
        options={navOptionHandler}></StackControle.Screen>
           <StackControle.Screen
        name="CadastroCategoria"
        component={CadatrarCategoria}
        options={navOptionHandler}></StackControle.Screen>
               <StackControle.Screen
        name="ListaProdutosAdmin"
        component={ListaProdutosAdmin}
        options={navOptionHandler}></StackControle.Screen>
               <StackControle.Screen
        name="ListaCategoriasAdmin"
        component={ListaCategoriaAdmin}
        options={navOptionHandler}></StackControle.Screen>
        <StackControle.Screen
        name="Promocao"
        component={Promocao}
        options={navOptionHandler}></StackControle.Screen>
         <StackControle.Screen
        name="NovoTeste"
        component={NovoTeste}
        options={navOptionHandler}></StackControle.Screen>
    </StackControle.Navigator>
  );
}

function DrawerNavigator({navigation}){
  return (
    <Drawer.Navigator initialRouteName="MenuTab" drawerContent={() => <CustomDrawerContent navigation={navigation}/>}>
        <Drawer.Screen name="MenuTab" component={TabNavigator}  />
        <Drawer.Screen name="MeusPedidos" component={MeusPedidos} />
        <Drawer.Screen name="AreaEntrega" component={AreaEntrega} />
        <Drawer.Screen name="Contato" component={Contato} />
        <Drawer.Screen name="QuemSomos" component={QuemSomos} />
      </Drawer.Navigator>
  )
}

export default function App() {

  return (
    <Provider store={store}>
    <NavigationContainer>
      <Root>
       <StackApp.Navigator initialRouteName="Login">
      <StackApp.Screen
        name="HomeApp"
        component={DrawerNavigator}
        options={navOptionHandler}></StackApp.Screen>
      <StackApp.Screen
        name="Login"
        component={LoginScreen}
        options={navOptionHandler}></StackApp.Screen>
        <StackApp.Screen
        name="Register"
        component={RegisterScreen}
        options={navOptionHandler}></StackApp.Screen>
       
    </StackApp.Navigator>
    </Root>
    </NavigationContainer>
    </Provider>
  );
}
