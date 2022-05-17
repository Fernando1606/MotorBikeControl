import {styles} from '../styles';
import ForecastCard from '../ForecastCard';
import { View, Text, Image, Pressable, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import Speedometer, { Background, Arc, Needle, Progress, Marks, Indicator, DangerPath } from 'react-native-cool-speedometer';
//import { NavigationContainer } from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE}  from 'react-native-maps';
import RNLocation from "react-native-location";
import {useState, useEffect} from 'react';




  const App = ({navigation}) => {   

    const [weather, setWeather] = useState(null);
    const [origin, setOrigin] = useState({
      latitude: 37.3826,
      longitude: -5.99629,
      speed: 0
    })

    useEffect(() => {

      getLocation()
      getWeather()
      

    }, [])


    const getLocation = async() => {

      let location = await RNLocation.getLatestLocation({timeout: 100});
      const currentLocation ={
        latitude: location.latitude,
        longitude: location.longitude
      }
        setOrigin(currentLocation)

    }

     const getWeather = () => {

      // Obtenemos el tiempo mediante la Api de ApiWeather
      let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + origin.latitude + '&lon=' + origin.longitude + '&units=metric&appid=37dcdd0526050776128ced549039b1c5';
      fetch(url)
      .then(response => response.json())
      .then((responseJson)=>{
        setWeather(responseJson)
      })
    }

    let getSpeed;
    setInterval(()=>{
      getSpeed = origin.speed;
    })
    
    return( 

      console.log('Velocidad --->', getSpeed),

    <View style={styles.fondo}>
        {/*Textos superiores*/}
				<View style={styles.textos}>
			    <Text style={styles.textosSuperiores}>56º</Text>
          <Text style={styles.textoRPM}>RPM</Text>
			  </View>

        {/*Imagenes superiores*/}

		  	<View style={styles.imagenesSuperiores}>
          <Image source={require('../../assets/images/temperatura.png')} style={styles.imagenAceite}/>
          <Text style={styles.textoR}>R</Text>
				  <Image source={require('../../assets/images/revoluciones.png')} style={styles.imagenRev}/>
        </View>
        
        {/*Velocidad*/}

      	<View style={styles.velocimetro}> 
          
        	<Speedometer value={getSpeed} fontFamily='Orbitron-Bold' max={300} width= {300} accentColor='#00e6dd'>
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
           data={weather?.list}
           keyExtractor={item => item.dt_txt} 
           renderItem={({item}) =>
            <ForecastCard
             detail={item} 
             location={weather.city.name}
            />}
         />


         {/*Google Maps*/}
          
         <MapView
            provider={PROVIDER_GOOGLE}
            style= {styles.mapa}
            initialRegion={{
              latitude: origin.latitude,
              longitude: origin.longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.04
            }}
          >
            <Marker
              draggable
              coordinate={origin}
              onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
            />
          </MapView>
        </View>
      </View>
    )}

export default  App;