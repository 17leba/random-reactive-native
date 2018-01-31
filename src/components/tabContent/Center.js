import React, { Component } from 'react';
import Config from './../../config'
import Login from './Login.js'
import { Card, Button } from 'react-native-elements'
import LikeList from './../LikeList'

import Cookie from 'react-native-cookies'

import {
	StyleSheet,
  	Text,
  	View,
  	Alert
} from 'react-native'

// init cookie
const getCookie = async function(name){
	let obj = await Cookie.get(Config.baseUrl)
	return obj[name]
}

class Center extends Component<{}>{
	state = {
		isLogin: false,
	}
	handleLoginState = () => {
		this.setState({
			isLogin: true
		})
	}
	async componentDidMount (){
		let USERSID = await getCookie('USER_SID') ? true : false
		this.setState({
			isLogin: USERSID
		})
	}
	render(){
		return (
			<View style={styles.wrap}>
				{ this.state.isLogin ? 
					<UserCenter handleNav={this.props.handleNav}/> : 
					<Login goCenter={this.handleLoginState}/> 
				}
			</View>
		)
	}
}
class UserCenter extends Component<{}>{
	render (){
		return (
			<Card title="喜欢列表">
			  	<Text style={{marginBottom: 10,textAlign:'center'}}>
			    	这里包含你喜欢和收藏的音乐/问题/新闻
			  	</Text>
				<Button 
					title='Go'
					icon={{name: 'envira', type: 'font-awesome'}}
					buttonStyle={styles.likeBtn}
					raised 
					onPress={this.props.handleNav.bind(this,{
						component: LikeList,
						navTitle: 'Like List'
					})}
				/>
			</Card>
		)
	}
}

const styles = StyleSheet.create({
  	wrap:{
  		justifyContent: 'center'
  	},
  	likeBtn: {
  		backgroundColor: 'orange'
  	}
})
export default Center