import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { styles } from '../styles'

export default function Loading({navigation}) {

    setTimeout(() => {
        navigation.navigate('Home')
    }, 5000);

  return (
    <View style={styles.cargaDatos}>
        <Text style={styles.textoLogo}>MBC</Text>
        <ActivityIndicator size={'large'} color = 'white'/>
        <Text style={styles.textoCarga}>MotorBikeControl</Text>
    </View>
  )
}