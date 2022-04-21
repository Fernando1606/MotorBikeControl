import { Text, Image, View, StyleSheet, FlatList, Pressable } from "react-native";
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
  DangerPath,
} from 'react-native-cool-speedometer';
import ForecastCard from './components/ForecastCard';
import Geolocation from 'react-native-geolocation-service';
import * as React from 'react'
import { PermissionsAndroid } from 'react-native';



function HomeScreen(){
  
}

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


function RacingWindow(){
  return(
    <View>
      
    </View>
  )
}


//Estilos
  const styles = StyleSheet.create({
    fondo: {
      backgroundColor: "#13172D",
      flex: 1,
    }, 
    textos:{
      flexDirection: 'row',
      fontFamily: 'Orbitron-Bold',
      marginTop:15
    },
    textosSuperiores: {
      color: 'white',
      marginTop: 15,
      fontSize: 25,
      flexDirection: 'row',
      marginLeft: 35,
      fontFamily: 'Orbitron-Bold'
    },
    textoRPM:{
      color: 'white',
      marginTop: 15,
      fontSize: 25,
      flexDirection: 'row',
      marginLeft: 185,
      fontFamily: 'Orbitron-Bold'
    },
    imagenesSuperiores: {
      flexDirection:'row'
    },
    imagenAceite: {
      width: 55,
      height: 55,
      marginLeft: 30,
      marginTop:15 
  
    },
    imagenRev: {
      width: 55, 
      height: 75,
      marginTop: 7,
      marginLeft:50
    },
  
    velocimetro: {
      alignItems: 'center',
      marginTop: 25
    },

    botonR: {
      alignItems: 'center',
      justifyContent: 'center' ,
      backgroundColor: '#00e6dd',
      borderRadius:3000,
      width:80,
      marginLeft: 60,
      marginTop: 30,
      borderColor: '#00e6dd',
      borderWidth:1
    },

    textoR: {
      fontFamily: 'Orbitron-Bold',
      color: 'white',
      fontSize: 75,
      position: 'relative'
    }
  })


export default class App extends React.Component {

  
  constructor(props){
		super(props);
		
		this.state = {
			latitude: 0,
			longitude: 0,
			forecast: [],
			error:''
		};
	}

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
            let velocidad = position.coords.speed;
            this.setState(
              (prevState) => ({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }), () => {this.getWeather();});
          },
          (error) => {
            // See error code charts below.
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

render(){

  return (


      <View style={styles.fondo}>
        {/*Textos superiores*/}
				<View style={styles.textos}>
			    <Text style={styles.textosSuperiores}>56º</Text>
          <Text style={styles.textoRPM}>RPM</Text>
			  </View>

        {/*Imagenes superiores*/}

		  	<View style={styles.imagenesSuperiores}>
          <Image source={require('./assets/images/temperatura.png')} style={styles.imagenAceite}/>
          <Pressable style={styles.botonR}>
            <Text style={styles.textoR}>R</Text>
          </Pressable>
				  <Image source={require('./assets/images/revoluciones.png')} style={styles.imagenRev}/>
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
       	 <FlatList
           data={this.state?.forecast?.list && [this.state.forecast.list[0]]}
           style={{marginTop:15}} 
           keyExtractor={item => item.dt_txt} 
           renderItem={({item}) =>
            <ForecastCard
             detail={item} 
             location={this.state.forecast.city.name}
            />}
         />
      </View>
    );
}};

