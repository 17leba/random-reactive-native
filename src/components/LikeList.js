import React, { Component } from 'react'
import {
	StyleSheet,
  	Text,
  	View,
  	ScrollView,
  	ActivityIndicator,
  	Alert
} from 'react-native'
import {List, ListItem, Button } from 'react-native-elements'

import Config from './../config'

import Question from './tabContent/Question'
import News from './tabContent/News'
import Music from './tabContent/Music'

class Like extends Component<{}>{
	state = {
		result: [],
		loading: true
	}
	componentDidMount (){
		this.fetchData()
	}
	async fetchData (){
		this.setState({
  			loading: true
  		})
		try{
		  	let res = await fetch(Config.likeListUrl + '?user_id=user_gwi243p87',{
		  		method: 'GET',
			  	headers: {
				    'Accept': 'application/json',
				    'Content-Type': 'application/json',
			  	}
		  	})
		  	let resJson = await res.json()

		  	this.setState({
		  		result: resJson,
		  		loading: false
		  	})

		  	return resJson
	  	}catch(error){
	  		Alert.alert(error)
	  		this.setState({
	  			loading: false
	  		})
	  	}
	}
	onLink = (item) => {
		let tpl,url
		switch(item.type){
			case 'question':
				tpl = Question
				url = Config.questionUrl
				break
			case 'news':
				tpl = News
				url = Config.newsUrl
				break
			case 'music':
				tpl = Music
				url = Config.musicUrl
				break
		}
		this.props.navigator.push({
	      	component: tpl,
	      	wrapperStyle: styles.detailWrap,
	      	title: item.title,
	      	passProps: { url: url, isLike: true, id: item.love_id },
	    })
	}
	render (){
		return (
			<ScrollView contentContainerStyle={styles.wrap}>
			{
				this.state.loading ?
				<ActivityIndicator size="large" color={Config.mainColor} /> :
				<List containerStyle={{marginTop: 0}}>
				  {
				    this.state.result.map((item, i) => (
				      <ListItem
				        key={i}
				        title={item.title}
				        subtitle={item.type}
				      	onPress={this.onLink.bind(this,item)} 
				      />
				    ))
				  }
				</List>
			}
			</ScrollView>
		)
	}
}
const styles = StyleSheet.create({
  	wrap: {
  		justifyContent: 'center',
  		minHeight: 500,
  	},
  	detailWrap: {
  		marginTop: 65
  	}
})

export default Like