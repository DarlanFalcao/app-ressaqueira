import React, {Component, useState, useEffect} from 'react';


produto = {
    nome: '',
    qtdeDisponivel: 0,
    valorProduto: 0,
  };

  itemPedido = {
    produto: produto,
    qtdeItems: 0,
    valorTotal: 0,
  };

  carrinho = {
    itens: [],
    valorTotal: 0,
    showButtonCarrinho:false
  };

  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [state, setState] = useState({
    qtdeItems: 0,
    valorTotal: 0,
    produto: produto,
    itemPedido: itemPedido,
    carrinho: carrinho,
  });





useEffect(() => {
    const subscriber = firestore()
      .collection('Produtos')
      .where('idCategoria', '==', categoria)
      .onSnapshot((querySnapshot) => {
        const produtos = [];
        
        if(querySnapshot){
        querySnapshot.forEach((documentSnapshot) => {
          produtos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            qtdeItems: 1,
          });
        });
        setProdutos(produtos);
        setLoading(true);
      }});
    return () => subscriber();
  }, []);

const INITIAL_STATE = produtos

export default function listaProdutoReducer(state = INITIAL_STATE, action){
    
    
    return state;
}