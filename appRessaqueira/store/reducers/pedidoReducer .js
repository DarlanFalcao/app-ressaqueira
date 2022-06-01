import mostrarProps from "../../utils/Utils";

const INITIAL_STATE = {
    pedido:{}
}

export default function pedidoReducer(state = INITIAL_STATE, action){
    
     if(action.type === "UPDATE_PEDIDO"){
        return {
            ...state,
            pedido:action.pedido
        }
    }
    
    return state;
}

