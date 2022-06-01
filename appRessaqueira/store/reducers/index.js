import {combineReducers} from 'redux'
import  carrinhoReducer from './carrinhoReducer'
import authReducer from './authReducer'
import mapsReducer from './mapsReducer'
import pedidoReducer from './pedidoReducer '

export default combineReducers({
    carrinhoReducer,
    authReducer,
    mapsReducer,
    pedidoReducer


})