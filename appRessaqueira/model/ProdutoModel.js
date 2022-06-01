import firestore from '@react-native-firebase/firestore';

export function salvarProduto(produto, isUpdate) {
  if (!isUpdate) {
    firestore()
      .collection('Produtos')
      .add({
        descricao: produto.descricao,
        nome: produto.nome,
        subTitulo: produto.subTitulo,
        preco: produto.preco,
        qtdeDisponivel: produto.qtdeDisponivel,
        urlImagem: produto.urlImagem,
        idCategoria: produto.categoria,
        isPromocao: produto.isPromocao,
        promocao: {
          percent: parseInt(produto.promocao.percent),
          qtdeparaDesconto: parseInt(produto.promocao.qtdeparaDesconto),
          valorDescontoAplicado: parseInt(
            produto.promocao.valorDescontoAplicado,
          ),
          precoComDesconto: calculaDesconto(),
        },
      })
      .then(() => {
        console.log('Product added!');
      });
  } else {
    firestore()
      .collection('Produtos')
      .doc(produto.key)
      .update({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        qtdeDisponivel: produto.qtdeDisponivel,
        urlImagem: produto.urlImagem,
        subTitulo: produto.subTitulo,
        idCategoria: produto.categoria,
        key: produto.key,
        isPromocao: true,
        promocao: {
          percent: parseInt(produto.promocao.percent),
          qtdeparaDesconto: parseInt(produto.promocao.qtdeparaDesconto),
          valorDescontoAplicado: parseInt(
            produto.promocao.valorDescontoAplicado,
          ),
          precoComDesconto: calculaDesconto(),
        },
      })
      .then(() => {
        console.log('Product update!');
      });
  }
}

export function calculaDesconto() {
  let percentDesconto =
    parseInt(produto.promocao.percent) < 10
      ? parseFloat('0.0' + produto.promocao.percent)
      : parseFloat('0.' + produto.promocao.percent);

  console.log('VALOR COM DESCONTO ' + percentDesconto);
  return produto.preco - produto.preco * percentDesconto;
}

export function deletarProduto(produto) {
  firestore()
    .collection('Produtos')
    .doc(ptoduto.key)
    .delete()
    .then(() => {
      console.log('Produto deleted!');
    });
}

export  function  getProdutos(categoria)  {
  produtos = [];
  categoria
    ? firestore()
        .collection('Produtos')
        .where('idCategoria', '==', categoria)
        .onSnapshot((querySnapshot) => {
          const produtos = [];
          if (querySnapshot) {
            querySnapshot.forEach((documentSnapshot) => {
              produtos.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                qtdeItems: 1,
              });
            });
          }
        })
    : firestore()
        .collection('Produtos')
        .onSnapshot((querySnapshot) => {
          const produtos = [];
          if (querySnapshot) {
            querySnapshot.forEach((documentSnapshot) => {
              console.log('NOME: ', nome);
              if (typeof nome != 'undefined') {
                if (
                  nome.length >= 3 &&
                  documentSnapshot
                    .data()
                    .nome.toLowerCase()
                    .includes(nome.toLowerCase())
                ) {
                  produtos.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                    qtdeItems: 1,
                  });
                }
              }
            });
            return produtos;
          }
        });
}
