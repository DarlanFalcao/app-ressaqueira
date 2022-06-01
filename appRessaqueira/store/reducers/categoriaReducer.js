
import getCategorias from '../../tab/ListaCategorias';

const INITIAL_STATE = {
    categorias:getCategorias()
}

export default function carrinhoReducer(state = INITIAL_STATE, action){
    
    
    if(action.type === "UPDATE_CATEGORIA"){
        
        return {
            ...state,
        }
    }
    
    return state;
}

