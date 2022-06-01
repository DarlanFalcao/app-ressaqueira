import mostrarProps from "../../utils/Utils";
import { State } from "react-native-gesture-handler";

  const INITIAL_STATE = {
    phoneNumber: '',
    photoURL: '',
    displayName: '',
    email: '',
    isAnonymous: false,
    emailVerified: false,
    providerId: '',
    uid: '',
  }

export default function authReducer(state = INITIAL_STATE, action){
    
    console.log(mostrarProps(action.userLogado,'####################AUTH_UPDATE############'))
    
    switch(action.type){
      case 'AUTH_UPDATE':
       
       
        return  {
          phoneNumber: action.userLogado.phoneNumber,
          photoURL: action.userLogado.photoURL,
          displayName: action.userLogado.displayName,
          email: action.userLogado.email,
          isAnonymous: action.userLogado.isAnonymous,
          emailVerified: action.userLogado.emailVerified,
          providerId: action.userLogado.providerId,
          uid: action.userLogado.uid,
          telefoneUsuario:action.userLogado.telefoneUsuario
        };
       
        
       
        
      
      default: return {...state};
        
    }
}

