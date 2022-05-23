import {styles} from '../styles';
import ForecastCard from '../ForecastCard';
import { View, Text, Image, FlatList, DeviceEventEmitter} from 'react-native';
import React from 'react';
import Speedometer, { Background, Arc, Needle, Progress, Marks, Indicator, DangerPath } from 'react-native-cool-speedometer';
//import { NavigationContainer } from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE}  from 'react-native-maps';
import RNLocation from "react-native-location";
import {useState, useEffect} from 'react';
import { BleManager } from 'react-native-ble-plx';
import { LogBox } from 'react-native';
import obd2, { startLiveData } from '@furkanom/react-native-obd2';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs(['Possible Unhandled Promise Rejection'])
LogBox.ignoreLogs(['ColorPropType']);
LogBox.ignoreLogs(['ViewPropTypes'])

LogBox.ignoreAllLogs();

  const App = ({navigation}) => {   

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
   

    useEffect(() => {
      getLocation()
      getWeather()
      mostrado()
      scan()
      connect()
      obdLiveDataListener = DeviceEventEmitter.addListener('obd2LiveData')
      ELM()
    }, [])


    var getLocation = async() => {

      var location = await RNLocation.getLatestLocation({timeout: 100});
      var currentLocation ={
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed
      }

      return currentLocation;
    }



    const getWeather = () => {

      // Obtenemos el tiempo mediante la Api de ApiWeather
      let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + ubication.latitude + '&lon=' + ubication.longitude + '&units=metric&appid=37dcdd0526050776128ced549039b1c5';
      fetch(url)
      .then(response => response.json())
      .then((responseJson)=>{
        setWeather(responseJson)
      })
    }

    const onRegionChange = () => {
      setInterval(()=> {
        return setUbication(getLocation)
      },10000)
    }

    var getSpeed;
    setInterval(()=>{
      getSpeed = origin.speed;
    })
    

    const mostrado = () => {
    setInterval(()=> {
    },1000)
  }

  const compruebaNull = () => {
    onRegionChange()
    if(ubication.latitude===null||ubication.longitude===null||ubication.speed===null){
      return origin
    } else return onRegionChange()
  }

  const dataWeather = () => {
    return weather?.list&&[weather?.list[0]]
  }






  //Conexion bluetooth



  const manager = new BleManager();
  const [device, setDevice] = useState(null);


  const scan = () =>{
    console.log('Scan')
    manager.startDeviceScan(null, {
      allowDuplicates: false
    },
      async (error, device) => {
        console.log('......Escaneando......');
        if (error) {
          manager.stopDeviceScan();
        }

        console.log(device)
        if (device){
          setDevice(device);
          manager.stopDeviceScan()
        }else{
          console.log('Dispositivo no disponible')
        }
      }
    )
  }

  const connect = () => {
    manager.stopDeviceScan();

    if (device!=null){
      device.connect()
      .then((deviceData) =>{
        manager.onDeviceDisconnected(
          deviceData.id,
          (connectionError, connectionData) =>{
            if (connectionError){
              console.log(connectionError)
            }
  
            console.log('Dispositivo desconectado')
            console.log(connectionData)
          }
        )
      }).then(
        manager.connectToDevice(device.id)
      )
    }
  }






  //OBD2

  const ELM = () => {


    const [dataCar, setDataCar] = useState({
        tempOBD: '-',
        velocidadOBD: '0km/h',
        rpmOBD: '0RPM',
        obd2Data: []
    })
   

    console.log('Aqui llego')


    const nameList = obd2.getBluetoothDeviceNameList();
    const deviceObd2 = namelist.filter(item => item.name ==='OBDII');
    obd2.ready();
    if (deviceObd2.length > 0){
      obd2.startLiveData(deviceObd2[0].address)
    }
    
    const startLiveData = () =>{
      obd2.setMockUpMode(true);
      obd2.startLiveData('10 F0 8B 3F 91 DEL ELM CUANDO SE CONECTE')
    }


    const obd2LiveData = (data) => {
      let copyData = JSON.parse(JSON.stringify(setDataCar.obd2Data))
      copyData[data.cmdID] = data;
      setDataCar(copyData)


      if (data.cmdID  === 'ENGINE_RPM'){
        setDataCar.rpmOBD = data.cmdResult
      }

      if (data.cmdID  === 'SPEED'){
        setDataCar.velocidadOBD = data.cmdResult
      }

      if (data.cmdID  === 'AIR_INTAKE_TEMP'){
        setDataCar.tempOBD = data.cmdResult
      }

    }

    useEffect(() =>{
      nameList()
      deviceObd2()
      startLiveData()
      obd2LiveData()
    })
  
    return dataCar

  }


    
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