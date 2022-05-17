import { StyleSheet } from "react-native";
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
      marginLeft:65
    },
  
    velocimetro: {
      alignItems: 'center',
      marginTop: 25
    },

    botonR: {
      backgroundColor: '#00e6dd',
      borderRadius:80,
      marginLeft: 65,
      borderColor: '#FF0000',
    },

    textoR: {
      fontFamily: 'Orbitron-Bold',
      color: 'white',
      fontSize: 75,
    },
    footer : {
      flexDirection: 'row'
    },
    mapa: {
      height: 180,
      width: 150,
      justifyContent: 'flex-end',
      alignItems : 'center',
      marginTop : 20,
      marginRight: 10,
      borderRadius: 50
    },

  })
  
  export {styles}