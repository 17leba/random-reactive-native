import React, { Component } from 'react'
import {
	StyleSheet,
  	Text,
  	View,
  	ScrollView,
  	ActivityIndicator,
  	FlatList,
  	Alert
} from 'react-native'
import {List, ListItem, Button } from 'react-native-elements'

import Config from './../config'
import Fetch from './../utils/fetch'

import Question from './tabContent/Question'
import News from './tabContent/News'
import Music from './tabContent/Music'

class Like extends Component<{}>{
	state = {
		result: [],
		loading: true
	}
	limit = 20
	currentPage = 1
	noData = false
	componentDidMount (){
		this.fetchData()
	}
	async fetchData (){
		this.setState({
  			loading: true
  		})
		try{
		  	let res = await Fetch.get(Config.likeListUrl,{
		  		page: this.currentPage++,
		  		limit: this.limit
		  	},{
		  		method: 'GET',
			  	headers: {
				    'Accept': 'application/json',
				    'Content-Type': 'application/json',
			  	}
		  	})

		  	if(res.success){
		  		if(res.data.length < this.limit){
		  			this.noData = true
		  		}
		  		this.setState((state) => ({
		  			result: state.result.concat(res.data),
		  			loading: false,
		  		}))
		  	}else{
		  		Alert.alert(res.message)
		  	}

		  	return res.success
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
	renderItem = ({item, i}) => (
  		<ListItem
	        key={i}
	        title={item.title}
	        subtitle={item.type}
	      	onPress={this.onLink.bind(this,item)} 
      	/>
	)
	onEndReached = () => {
		if(this.noData){
			return
		}
		this.fetchData()
	}
	render (){
		return (
			<ScrollView>
				<List containerStyle={styles.wrap}>
					<FlatList
						data={this.state.result}
						keyExtractor={(item) => item.id}
						renderItem={this.renderItem}
						onEndReached={this.onEndReached}
						onEndReachedThreshold='0.1'
					/>
				</List>
			{
				this.state.loading && <ActivityIndicator size="large" color={Config.mainColor} />
			}
			</ScrollView>
		)
	}
}
const styles = StyleSheet.create({
  	wrap: {
  		justifyContent: 'center',
  	},
  	detailWrap: {
  		marginTop: 70
  	}
})

export default Like