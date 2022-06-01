import mostrarProps from "../../utils/Utils";

const INITIAL_STATE = {
    itens:[],
    showButtonCarrinho:false,
    qtdeItensCarrinho:0
}

export default function carrinhoReducer(state = INITIAL_STATE, action){
    
    
    if(action.type === "UPDATE_CARRINHO"){
        console.log(mostrarProps(action.carrinho,'CARRINHO_REDUCER'))
        return {
            ...state,
            itens:action.carrinho.itens,
            showButtonCarrinho:action.carrinho.itens.length > 0,
            qtdeItensCarrinho:action.carrinho.itens.length
        }
    }
    
    return state;
}

