import firestore from '@react-native-firebase/firestore';


export default function getCategorias() {
  const categorias = [];
  firestore()
    .collection('categorias')
    .orderBy('ordem','asc')
    .onSnapshot((querySnapshot) => {
      
      if (querySnapshot) {
        querySnapshot.forEach((documentSnapshot) => {
          
          categorias.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
      }
    });
  return categorias;
}
