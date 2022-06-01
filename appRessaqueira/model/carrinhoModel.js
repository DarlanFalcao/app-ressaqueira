export function incrementItem(item, isUpdateCarrinho,carrinho) {
  if (item.qtdeItems <= item.qtdeDisponivel) {
    item.qtdeItems = item.qtdeItems + 1;
    if (isUpdateCarrinho) {
      addCarrinho(item, carrinho);
    }
  }
  return item;
}

export function decreaseItem(item, isUpdateCarrinho,carrinho) {
  console.log('DECREASE',item.qtdeItems)
  if (item.qtdeItems > 1) {
    item.qtdeItems = item.qtdeItems - 1;
    if (isUpdateCarrinho) {
        updateCarrinho(item, carrinho); 
    }
  }
  return item;
}

export function searchItem(item, carrinho) {
  const found = carrinho.itens.find((itemFind) => {
    return itemFind.key === item.key;
  });
  return found;
}

export function addCarrinho(item, carrinho) {
    console.log('FUNCAO ADDCARRINHO!!')
    const found = searchItem(item, carrinho)
  if (found) {
    updateCarrinho(item, carrinho);
  } else {
    addNewItem(item, carrinho);
  }
}

export function addNewItem(item, carrinho) {
  carrinho.itens.push(item);
  return carrinho;
}

export function updateCarrinho(item, carrinho) {
  var pos = carrinho.itens.indexOf(searchItem(item, carrinho));
  carrinho.itens[pos]['qtdeItems'] = item.qtdeItems;
  return carrinho;
}

export function removeItem(item, carrinho) {
  carrinho.itens.pop(item);
  return carrinho;
}
