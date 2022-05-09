import {styles} from '../styles';
import ForecastCard from '../ForecastCard';
import { View, Text, Image, Pressable, FlatList, Alert, LogBox } from 'react-native';
import React from 'react';
import Speedometer, { Background, Arc, Needle, Progress, Marks, Indicator, DangerPath } from 'react-native-cool-speedometer';
//import { NavigationContainer } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import RNLocation from "react-native-location";
import {useState} from 'react';


  
const getLocation = async () => {
  [viewLocation, isViewLocation] = useState([])
  
  let permission = await RNLocation.checkPermission({
    ios: 'whenInUse', // or 'always'
    android: {
      detail: 'coarse' // or 'fine'
    }
  });

  console.log(permission)

  let location;
  if(!permission) {
    permission = await RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse",
        rationale: {
          title: "We need to access your location",
          message: "We use your location to show where you are on the map",
          buttonPositive: "OK",
          buttonNegative: "Cancel"
        }
      }
    })
    console.log(permission)
    location = await RNLocation.getLatestLocation({timeout: 100})
    console.log(location)
    isViewLocation(location)
    
  } else {
    location = await RNLocation.getLatestLocation({timeout: 100})
    console.log(location)
    isViewLocation(location)
  }
}

const getWeather = () => {
  console.log('Latitud: ', viewLocation.latitude),
  console.log('Longitud: ', viewLocation.longitude)
  // Obtenemos el tiempo mediante la Api de ApiWeather
  let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + viewLocation.latitude + '&lon=' + viewLocation.longitude + '&units=metric&appid=4f38696c56e9bed6c25fc2e13371612e';
  fetch(url)
  .then(response => response.json())
  .then(data => {
    this.setState((prevState, props) => ({
      forecast: data
    }));
    
  })
}
  const App = () => {   

    getLocation()
    getWeather()


    return( 
    <View style={styles.fondo}>
        {/*Textos superiores*/}
				<View style={styles.textos}>
			    <Text style={styles.textosSuperiores}>56º</Text>
          <Text style={styles.textoRPM}>RPM</Text>
			  </View>

        {/*Imagenes superiores*/}

		  	<View style={styles.imagenesSuperiores}>
          <Image source={require('../../assets/images/temperatura.png')} style={styles.imagenAceite}/>
          <Pressable style={styles.botonR} onPress={()=> {Alert.alert('Boton pulsado')}}>
            <Text style={styles.textoR}>R</Text>
          </Pressable>
				  <Image source={require('../../assets/images/revoluciones.png')} style={styles.imagenRev}/>
        </View>
        
        {/*Velocidad*/}

        
      	<View style={styles.velocimetro}> 
          
        	<Speedometer value={viewLocation.speed} fontFamily='Orbitron-Bold' max={300} width= {300} accentColor='#00e6dd'>
         	 <Background angle={360}></Background>
         	 <Arc color='white'></Arc>
         	 <Needle offset={25}></Needle>
         	 <DangerPath color='red' arcWidth={10}></DangerPath>
         	 <Progress/>
         	 <Marks step={15} lineSize={20} fontSize={15}></Marks>
        	 <Indicator/>
       	  </Speedometer>
        </View>


        <View style={styles.footer}>
        {/*Lista para mostrar el tiempo*/}
       	 <FlatList
           data={this.state?.forecast?.list && [this.state.forecast.list[0]]}
           keyExtractor={item => item.dt_txt} 
           renderItem={({item}) =>
            <ForecastCard
             detail={item} 
             location={this.state.forecast.city.name}
            />}
         />


         {/*Google Maps*/}
          
          <MapView
            provider={PROVIDER_GOOGLE}
            style= {styles.mapa}
            initialRegion={{
              latitude: 37.3826,
              longitude: -5.99629,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003
            }}
          ></MapView>
        </View>
      </View>
    )}

export default  App;