
import React, {Component, useState, useEffect} from 'react';
import {Text, View, SafeAreaView, Button} from 'react-native';
import MapView,{Polygon, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import GeoFencing from 'react-native-geo-fencing';

import mostrarProps from '../utils/Utils';
import CustomHeader from '../CustomHeader';

function AreaEntrega({navigation}) {

  const [pedidos, setpedidos] = useState({
    coordinates:[
      {name:'1',latitude:-22.577653,longitude:-43.169929},
      {name:'2',latitude:-22.584442,longitude:-43.161655},
      {name:'3',latitude:-22.611493,longitude:-43.143440},
      {name:'4',latitude:-22.626743,longitude:-43.154144},
      {name:'5',latitude:-22.637550,longitude: -43.159955},
      {name:'6',latitude:-22.644836,longitude:-43.177128},
      {name:'7',latitude:-22.634198,longitude:-43.194290},
      {name:'8',latitude:-22.615500,longitude:-43.198831},
      {name:'9',latitude:-22.608012,longitude:-43.205862},
      {name:'10',latitude:-22.585107,longitude:-43.198678},
      {name:'11',latitude:-22.566526,longitude:-43.191648},
      {name:'11',latitude:-22.566758,longitude:-43.176052}
    ]
  });

  const [inicioMap,setInicioMap] = useState(
    {latitude:-22.607299,
    longitude:-43.173828, 
    latitudeDelta:0.09,
    longitudeDelta:0.035})
  useEffect(()=>{
    Geolocation.getCurrentPosition(
      (position) => {
       
       const region = {
          latitude:position.coords.latitude,
          longitude:position.coords.longitude,
          latitudeDelta:0.09,
          longitudeDelta:0.035
        }
        
        setInicioMap(region)
        
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    const polygon = [
      { lat: -22.577653, lng: -43.169929 },
      { lat: -22.584442, lng: -43.161655 },
      { lat: -22.611493,  lng: -43.143440 },
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

    
    let point = {
      lat: -22.607299,
      lng: -43.173828
    };
  
    GeoFencing.containsLocation(point, polygon)
      .then(() => console.log('point is within polygon'))
      .catch(() => console.log('point is NOT within polygon'))


  },[])
 


return(
  
  <View >
    <CustomHeader navigation={navigation}></CustomHeader>
   <MapView style={{height:'100%'}}
   showsMyLocationButton={true}
   showsUserLocation={true}
   provider={PROVIDER_GOOGLE}
   initialRegion={{latitude:inicioMap.latitude,
    longitude:inicioMap.longitude,
    latitudeDelta:0.09,
    longitudeDelta:0.035}}
  > 
  <Polygon coordinates={pedidos.coordinates} strokeColor='blue' strokeWidth={5}></Polygon> 
  </MapView>
  </View>
  
);
}
export default AreaEntrega;


