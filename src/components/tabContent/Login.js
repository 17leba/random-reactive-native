import React, { Component } from 'react'
import {
	StyleSheet,
  	Text,
  	View,
  	Alert
} from 'react-native'
import { FormLabel, FormInput,FormValidationMessage, Button } from 'react-native-elements'

import Config from './../../config'

class Login extends Component<{}>{
	state = {
		username: '',
		password: '',
		errorMsg: ''
	}
	changeUsername = (text) => {
		this.setState({
			username: text
		})
	}
	changePassword = (pwd) => {
		this.setState({
			password: pwd
		})
	}
	async handleLogin (){
		if(!this.state.username || !this.state.password){
			this.setState({
				errorMsg: '请输入用户名和密码'
			})
			return
		}
		this.setState({
			errorMsg: ''
		})
		try{
			let res = await fetch(Config.loginUrl,{
				method: 'POST',
				headers: {
			    	'Accept': 'application/json',
			    	'Content-Type': 'application/json',
			  	},
			  	body: JSON.stringify({
			    	username: this.state.username,
			    	password: this.state.password,
			  	})
			})
			let resJson = await res.json()
			if(resJson.success){
				// 登录成功
				this.props.goCenter()
			}else{
				this.setState({
					errorMsg: resJson.message
				})
			}
		}catch(error){
			Alert.alert(error)
		}
	}
	render(){
		return (
			<View style={styles.wrap}>
				<FormLabel>Name</FormLabel>
				<FormInput 
					onChangeText={this.changeUsername}
					value={this.state.username}
					/>
				<FormLabel>Password</FormLabel>
				<FormInput 
					onChangeText={this.changePassword}
					value={this.state.password}
					secureTextEntry={true}
					/>
				<FormValidationMessage
					containerStyle={{marginTop:10,marginBottom:10}}>
					{this.state.errorMsg}
				</FormValidationMessage>
				<Button 
					title='Login' 
					buttonStyle={styles.submit}
					onPress={this.handleLogin.bind(this)}
				/>
			</View>
		)
	}
}
const styles = StyleSheet.create({
  	wrap:{
  		minHeight: 500,
  		justifyContent: 'center'
  	},
  	input: {
  		marginTop: 10,
  		marginBottom: 10
  	},
  	submit: {
  		backgroundColor: Config.mainColor,
  	}
})
export default Login