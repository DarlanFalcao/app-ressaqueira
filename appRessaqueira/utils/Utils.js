import {Dimensions,PixelRatio} from 'react-native';

export default function mostrarProps(obj, nomeDoObj) {
    var resultado = '';
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        resultado += nomeDoObj + '.' + i + ' = ' + obj[i] + '\n';
      }
    }
    return resultado;
  }

  export  const polygonAreaEntrega = [
    { lat: -22.577653, lng: -43.169929 },
    { lat: -22.584442, lng: -43.161655 },
    { lat: -22.611493, lng: -43.143440 },
    { lat: -22.626743, lng: -43.154144 },
    { lat: -22.637550, lng: -43.159955 },
    { lat: -22.644836, lng: -43.177128 },
    { lat: -22.634198, lng: -43.194290 },
    { lat: -22.615500, lng: -43.198831 },
    { lat: -22.608012, lng: -43.205862 },
    { lat: -22.585107, lng: -43.198678 },
    { lat: -22.566526, lng: -43.191648 },
    { lat: -22.566758, lng: -43.176052 },
    { lat: -22.577653, lng: -43.169929 } // last point has to be same as first point
  ];  


  export const pointDentroArea = {
   lat: -22.607299,
   lng: -43.173828
 }
 export const pointForaArea = {
  lat: 22.607299,
  lng: 43.173828
}

const {width, height} = Dimensions.get('window');


  const widthToDp = number =>{
    let givenWidth = typeof number === 'number'?number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((width * givenWidth)/100);
  }

  const heightToDp = number =>{
    let givenHeight = typeof number === 'number'?number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((height * givenHeight)/100);
  }

 export function  formataMoeda(valor){
  
    return 'R$ ' + valor.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 
 }

  export {widthToDp, heightToDp};