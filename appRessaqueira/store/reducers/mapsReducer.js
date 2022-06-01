const INITIAL_STATE = {
  isDentroAreaEntrega: false
};

export default function authReducer(state = INITIAL_STATE, action) {
  console.log("CHAMADA MAPS_REDUCER", action)
  if (action.type === 'MAPS_UPDATE') {
    console.log(mostrarProps(action.isDentroAreaEntrega,"MAPS_REDUCER"));
    
    return {
      isDentroAreaEntrega:action.isDentroAreaEntrega
    };
  }
  return state;
}

function mostrarProps(obj, nomeDoObj) {
  var resultado = '';
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      resultado += nomeDoObj + '.' + i + ' = ' + obj[i] + '\n';
    }
  }
  return resultado;
}
