import { View, Text, Image, Pressable, FlatList } from 'react-native'
import React from 'react'
import {styles} from '../styles'
import Speedometer, { Background, Arc, Needle, Progress, Marks, Indicator, DangerPath } from 'react-native-cool-speedometer';
import Geolocation from 'react-native-geolocation-service';
import ForecastCard from '../ForecastCard';
import { PermissionsAndroid } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';


//Funcion asincrona para permitir el acceso de ubicacion a la aplicacion
export async function requestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Localizacion',
        'message': 'Preguntamos por permiso '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Tenemos acceso a la ubicacion")
    } else {
      console.log("No tenemos acceso a la ubicacion")
    }
  } catch (err) {
    console.warn(err)
  }
}

export default class App extends React.Component{
  
  //Constructor de la clase
  constructor(props){
		super(props);
		
		this.state = {
			latitude: 0,
			longitude: 0,
			forecast: [],
			error:''
		};
	}

  //Conforme haga el render llamara a getLocation
	componentDidMount(){
    //Cogemos la ubicacion
		this.getLocation();
	}
  
  //Espera a que se acepten permisos de ubicacion
  async UNSAFE_componentWillMount() {
    await requestLocationPermission()
}

  //Recogida de la ubicacion
  getLocation(){
      Geolocation.getCurrentPosition(
          (position) => {
            this.setState(
              (prevState) => ({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }), () => {this.getWeather();});
          },
          (error) => {
            // Devuelve codigo de error
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

     
	}
  
  //Recogida del tiempo
  getWeather(){
    console.log('Latitud: ', this.state.latitude),
    console.log('Longitud: ', this.state.longitude)
  
    // Obtenemos el tiempo mediante la Api de ApiWeather
    let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + this.state.latitude + '&lon=' + this.state.longitude + '&units=metric&appid=4f38696c56e9bed6c25fc2e13371612e';
    fetch(url)
    .then(response => response.json())
    .then(data => {
      this.setState((prevState, props) => ({
        forecast: data
      }));
      
    })
  }

  render() {
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
          <Pressable style={styles.botonR} onPress={()=> navigation.navigate('Racing')}>
            <Text style={styles.textoR}>R</Text>
          </Pressable>
				  <Image source={require('../../assets/images/revoluciones.png')} style={styles.imagenRev}/>
        </View>
        
        {/*Velocidad*/}

        
      	<View style={styles.velocimetro}> 
          
        	<Speedometer value={Geolocation.getCurrentPosition.speed} fontFamily='Orbitron-Bold' max={300} width= {300} accentColor='#00e6dd'>
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
              latitude: 37.3757174,
              longitude: -5.9760505,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003
            }}
          ></MapView>
        </View>
      </View>
    )}
}
