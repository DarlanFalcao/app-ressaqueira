import React, {useState, useEffect} from 'react';
import {View, Image, ActivityIndicator, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import mostrarProps, { widthToDp, heightToDp } from '../utils/Utils';
import authReducer from '../store/reducers/authReducer';
import {connect} from 'react-redux';
import { LoginButton, AccessToken ,LoginManager} from 'react-native-fbsdk';

import { Icon, Overlay, Button, Text, Avatar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native';


function Perfil({userLogado,navigation, dispatch}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [usuarioLog,setUsuarioLog] = useState('');
  const [visible, setVisible] = useState(false);
  const [telefoneUsuario, setTelefoneUsuario] = useState('');
  const [idUser,setIdUser] = useState("");
  const toggleOverlay = () => {
   
    setVisible(!visible);
  };





  useEffect(() => {
    console.log("INICIO PERFIL #######################",userLogado)
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    GoogleSignin.configure({
      webClientId:
        '461237670776-5ph8rdtgislcpggetbcieuar41dlca3v.apps.googleusercontent.com'
    });
    
    if(user){
      console.log(mostrarProps(user,'USER_INICIO'))
    }else{
      console.log('USER VAZIO#############')
    }
    return subscriber; // unsubscribe on unmount
  },[]);


  async function getUsuario(user) {
        console.log(mostrarProps(user._user,"Inicio getUsuario"));
        let telAux;
        const users = await firestore()
          .collection('Usuarios')
          .get();
        
        users.forEach((doc) => {
          console.log('FOR EACH BUSCAR USUARIO', user._user.uid)
         // if(user !== null && user !== undefined ){
            if (user._user.uid === doc.data().uid) {
              console.log('IF BUSCAR USUARIO', doc.data().telefoneUsuario)
              setTelefoneUsuario(doc.data().telefoneUsuario);
              telAux = doc.data().telefoneUsuario;
             }
         // }
          
        });

       
          userLogado = {
           phoneNumber: user._user.phoneNumber,
           photoURL: user._user.photoURL,
           displayName: user._user.displayName,
           email: user._user.email,
           isAnonymous: user._user.isAnonymous,
           emailVerified: user._user.emailVerified,
           providerId: user._user.providerId,
           uid: user._user.uid,
           telefoneUsuario:telAux
         };
         storeData(telAux);
         console.log(mostrarProps(userLogado,"TESTE_USER_LOGADO"));
        
         dispatch({
           type: 'AUTH_UPDATE',
           userLogado,
         });
       
         
      }
    
  async function onGoogleButtonPress() {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    GoogleSignin.configure({
      webClientId:
        '461237670776-5ph8rdtgislcpggetbcieuar41dlca3v.apps.googleusercontent.com'
    });
    // Get the users ID token
    setVisible(true);
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );

    // Sign-in the user with the credential
    setUser(userInfo);
    //getUsuario();
    //console.log(mostrarProps(userInfo, 'USER_INFO'));
    console.log(mostrarProps(user, 'USER'));
    setVisible(false)

    
    return auth().signInWithCredential(googleCredential);
  }
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    setVisible(true);
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    console.log(mostrarProps(result,'FACEBOOK_RESULT'))
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    setVisible(false)
    
    return auth().signInWithCredential(facebookCredential);
  }
  const storeData = async (value) => {
    try {
     await AsyncStorage.setItem('@telefone', value)
    } catch (e) {
     console.log(e);
    }
  }
  async function signOut() {
    console.log('SIGNOUT');
    auth()
      .signOut()
      .then(() => 
      {
         userLogado = {
          phoneNumber:'',
          photoURL: '',
          displayName: '',
          email: '',
          isAnonymous: '',
          emailVerified: '',
          providerId:'',
          uid: '',
        };
        dispatch({
          type: 'AUTH_UPDATE',
          userLogado,
        });
        storeData("");
        console.log('User signed out!');
      }
      );
  }
  
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }
function limparUsuarioLogado(){
   userLogado = {
    phoneNumber: '',
    photoURL: '',
    displayName: '',
    email: '',
    isAnonymous: '',
    emailVerified: '',
    providerId: '',
    uid: '',
  }
  return {
    type: 'AUTH_UPDATE',
    userLogado
  }

}
  // Handle user state changes
  function onAuthStateChanged(user) {
    
    console.log('##########onAuthStateChanged',user)
    setUser(user);
    getUsuario(user);
    

    if (initializing) setInitializing(false);
  }

 

  if (initializing) return null;

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Overlay isVisible={visible} overlayStyle={{width:290,height:260,justifyContent:'center'}}>
        <View style={{alignItems:'center'}}>
        <Image style={{width:85,height:70}}
        source={require('../assets/ressaqueira1.jpeg')}></Image>
        <ActivityIndicator color="red" size='large'></ActivityIndicator>
        <Text h4>Realizando login...</Text>
        <Button title = 'Cancelar' onPress={toggleOverlay} buttonStyle={{backgroundColor:'red',marginTop:10}}></Button>
        </View>
      </Overlay>
      <View style={{flex:1, backgroundColor:'black',alignItems:'center',padding:15,flexDirection:'column',justifyContent:'center'}}>
        <Image style={{width:50,height:65,marginTop:30}}
        source={require('../assets/ressaqueira3.jpeg')}></Image>
        <Image style={{width:175,height:70}}
        source={require('../assets/ressSemFundo.png')}></Image>
        </View>
      <View style={{backgroundColor:'black',flex:4,padding:10}}>
        <Text h4 style={{color:'white',alignSelf:'center',marginTop:35}} >Acessar Ressaqueira</Text>
      <View style={{ alignContent:'center'}}>
      <TouchableOpacity onPress={() => onGoogleButtonPress()} style={{borderColor:'white',borderStyle:'solid',borderBottomWidth:1,
        borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,width:widthToDp('90%'),height:heightToDp('9%'),marginTop:150,marginBottom:10,borderRadius:10,justifyContent:'space-around',alignItems:'center',flexDirection:'row'}}> 
         
          <Image style={{width:35,height:35,marginLeft:-49,marginRight:-78,marginBottom:2}}
        source={require('../assets/googleLogo2.png')}></Image>
        <Text style={{color:'white'}}>Continuar com google</Text>
          </TouchableOpacity>
      
          <TouchableOpacity onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))} style={{borderColor:'white',borderStyle:'solid',borderBottomWidth:1,
        borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,width:widthToDp('90%'),height:heightToDp('9%'),marginTop:30,marginBottom:30,borderRadius:10,justifyContent:'space-around',alignItems:'center',flexDirection:'row'}}> 
          <Image style={{width:35,height:35,marginLeft:-36,marginRight:-36,marginBottom:2}}
        source={require('../assets/facebook.png')}></Image><Text style={{color:'white',marginLeft:-5}}>Continuar com facebook</Text>
          </TouchableOpacity>
       
      </View>
      
      
      </View>
     
       
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
     <View style={{flex:1,backgroundColor:'black', alignItems:'center', flexDirection:'row', padding:10}}>
       <Avatar source={{uri: user.photoURL}} rounded  size='xlarge'>
      
       </Avatar>
       <Text h4 style={{color:'white', marginLeft:10}}>{user.displayName}</Text>
      
     </View>
     <View style={{flex:1, backgroundColor:'black',justifyContent:'space-around', alignItems:'center'}}>
     <Text style={{fontSize: 20,color:'white'}}> Telefone : {userLogado.telefoneUsuario}</Text>
    
     <Button title='Adicionar Telefone' onPress={()=>navigation.navigate('CadastrarTelefone')} buttonStyle={{backgroundColor:'red',width:widthToDp('80%'),justifyContent:'space-between'}} type='solid'  icon={
                  <Icon name="phone" type="entypo" style={{padding:widthToDp('1%')}} />
                } iconRight></Button>
     <Button title='Sair da conta'  onPress={() => signOut().then(dispatch(limparUsuarioLogado()))} buttonStyle={{backgroundColor:'red',width:widthToDp('80%'),justifyContent:'space-between'}} icon={
                  <Icon name="log-out" type="entypo" style={{padding:widthToDp('1%'),}} />
                } iconRight >
          
          </Button>
       </View>
    </View>
  );
}
export default connect((state) => ({userLogado: state.authReducer}))(Perfil);
