/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import { StyleSheet, View, Image } from 'react-native';
 import { Text, Card, Divider } from 'react-native-elements';
 

 
 export default class ForecastCard extends Component {

			 
	componentDidMount(){
		setInterval(() => (
			this.setState(
				{curTime : new Date().toLocaleString().split(' ', 5).pop()}
			),1000)
		);
	}

	state = {curTime: new Date().toLocaleString().split(' ', 5).pop()};

 
	 render() {


		 return (
			 <View style={{width: 170, height: 220}}>
			 <Card containerStyle={styles.card}>
				 <Text style={styles.notes}>{this.props.location}</Text>
				 
				 <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
					 <Image style={{width:100, height:100}} source={{uri:"https://openweathermap.org/img/w/" + this.props.detail.weather[0].icon + ".png"}} />
				 </View>
 
				 <Divider style={{ backgroundColor: '#00e6dd', marginVertical:10}} />
				 
				 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
				 	 <Text style={styles.notes}>{this.state.curTime.split('',5)}</Text>
					 <Text style={styles.notes}>{Math.round( this.props.detail.main.temp * 10) / 10 }&#8451;</Text>
				 </View>
			 </Card>
			 </View>
		 );
	 }
 }
 
 const styles = StyleSheet.create({
	 card:{
		 backgroundColor:'#13172D',
		 borderWidth:0,
		 borderRadius:20,
	 },
	 time:{
		 fontSize:38,
		 color:'#fff'
	 },
	 notes: {
		 fontSize: 15,
		 color:'#fff',
		 textTransform:'capitalize',
		 fontFamily: 'Orbitron-Bold',

	 }
 });