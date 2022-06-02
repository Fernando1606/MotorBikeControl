  import {styles} from '../styles';
  import ForecastCard from '../ForecastCard';
  import { View, Text, Image, FlatList, DeviceEventEmitter, PermissionsAndroid} from 'react-native';
  import React  from 'react';
  import Speedometer, { Background, Arc, Needle, Progress, Marks, Indicator, DangerPath } from 'react-native-cool-speedometer';
  import MapView, {Marker, PROVIDER_GOOGLE}  from 'react-native-maps';
  import RNLocation from "react-native-location";
  import {useState, useEffect} from 'react';
  import { LogBox } from 'react-native';
  import OBDReader from '../OBDReader';




  LogBox.ignoreLogs(['new NativeEventEmitter']);
  LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
  LogBox.ignoreLogs(['ColorPropType']);
  LogBox.ignoreLogs(['ViewPropTypes']);

  LogBox.ignoreAllLogs();

    const App = ({navigation}) => {   


      //Permisos

      const requestUbicationPermission = async () => {
        try{
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Permisos de Ubicación',
              message: 'Necesitamos acceder a tu ubicación',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancelar'
            }
          );
          if (granted===PermissionsAndroid.RESULTS.GRANTED){
            console.log('Tenemos permisos de ubicacion')
          }
        } catch (err){
          console.warn(err)
        }
      }


      //Datos de tiempo y ubicacion inicial

      const [weather, setWeather] = useState(null);
      const [origin] = useState({
        latitude: 37.3826,
        longitude: -5.99629,
        speed: 0
      })

      
      const [ubication,setUbication] = useState({
        latitude: origin.latitude,
        longitude: origin.longitude
      })
    

      //Orden de ejecucion

      useEffect(() => {
        requestUbicationPermission()
        getLocation()
        getWeather()
        mostrado()

      }, [])


      //Obtencion de la localizacion


      var getLocation = async() => {

        var location = await RNLocation.getLatestLocation({timeout: 100});
        var currentLocation ={
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed
        }

        return currentLocation;
      }
      
      //Metodo de maps para devolvernos la ubicacion al movernos

      const onRegionChange = () => {
        setInterval(()=> {
          return setUbication(getLocation)
        },10000)
      }

      //Metodo creado para comprobar que nos llegan datos por GPS, sino, al devolver null se cae la app

      const compruebaNull = () => {
        useEffect(()=>{
          onRegionChange()
          if(ubication.latitude===null||ubication.longitude===null||ubication.speed===null){
           return origin
          } else return onRegionChange()
        })
      }


      //Obtencion del tiempo atmosferico mediante la ubicacion

      const getWeather = () => {

        // Obtenemos el tiempo mediante la Api de ApiWeather
        let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + ubication.latitude + '&lon=' + ubication.longitude + '&units=metric&appid=37dcdd0526050776128ced549039b1c5';
        fetch(url)
        .then(response => response.json())
        .then((responseJson)=>{
          setWeather(responseJson)
        })
      }

      //Datos de la api del tiempo

      const dataWeather = () => {
        return weather?.list&&[weather?.list[0]]
      }

      
      //Instancia con la clase del OBD

      const instancia = new OBDReader();
  

      //Mostrado de datos de OBD

      const mostrado = () => {

        const datosOBD = {
          velocidadOBD: 0,
          rpmOBD: 0,
          engine_tempOBD: 0,
          presOBD: 0
        }

        setInterval(()=> {

          console.log('Velocidad: ' , instancia.actualizacionDatos().velocidadOBD);
          console.log('RPM: ' , instancia.actualizacionDatos().rpmOBD);

          datosOBD.velocidadOBD = instancia.actualizacionDatos().velocidadOBD;
          datosOBD.rpmOBD = instancia.actualizacionDatos().velocidadOBD;
          datosOBD.engine_tempOBD = instancia.actualizacionDatos().tempOBD;
          datosOBD.presOBD = instancia.actualizacionDatos().presOBD;

        },1000)

        return datosOBD;
      }

      return( 

      <View style={styles.fondo}>
          {/*Textos superiores*/}
          <View style={styles.textos}>
            <Text style={styles.textosSuperiores}>{mostrado().engine_tempOBD}</Text>
            <Text style={styles.textoRPM}>{mostrado().rpmOBD}</Text>
          </View>

          {/*Imagenes superiores*/}

          <View style={styles.imagenesSuperiores}>
            <Image source={require('../../assets/images/temperatura.png')} style={styles.imagenAceite}/>
            <Text style={styles.textoR}>{mostrado().presOBD}</Text>
            <Image source={require('../../assets/images/revoluciones.png')} style={styles.imagenRev}/>
          </View>
          
          {/*Velocidad*/}

          <View style={styles.velocimetro}> 
            
            <Speedometer value={mostrado().velocidadOBD} fontFamily='Orbitron-Bold' max={300} width= {300} accentColor='#00e6dd'>
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
            data={dataWeather()}
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
                latitudeDelta: 0.005,
                longitudeDelta: 0.0025
              }}

              onRegionChange={compruebaNull()}
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