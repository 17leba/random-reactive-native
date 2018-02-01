import React, { Component } from 'react'
import HTML from 'react-native-render-html'
import Config from './../../config'
import Fetch from './../../utils/fetch'

import {
	StyleSheet,
  	Text,
  	View,
  	ScrollView,
  	RefreshControl,
  	Linking,
  	Dimensions,
  	ActivityIndicator,
  	Alert
} from 'react-native'

class News extends Component<{}>{
	state = {
		isRefreshing: false,
		loading: true,
		result: {}
	}
	pressLink = (url) => {
		Linking.openURL(url)
	}
	componentDidMount (){
		this.fetchData()
	}
	async fetchData (){
		!this.state.isRefreshing && this.setState({
			loading: true
		})
		let res = await Fetch.get(this.props.url,{
			news_id: this.props.id || ''
		})
		if(res){
			this.setState({
				loading:false,
				result: res
			})
			this.props.getLikePara && this.props.getLikePara({
				loveId: res.news_id,
		    	type: 'news',
		    	title: res[res.news_id].title,
		    	tag: res.has_loved ? 1 : 0
			})
			return true
		}else{
			Alert.alert('Network Error')
			this.setState({
				loading: false,
				isRefreshing: false
			})
			return false
		}
	}
	async refreshData (){
		await this.setState({
			isRefreshing: true,
		})
		let res = await this.fetchData()
		if(res){
			this.setState({
				isRefreshing: false
			})
		}
	}

	render(){
		let data = this.state.result[this.state.result.news_id] || {}
		return (
			<View style={styles.wrap}>
			{
				this.state.loading ? 
				<ActivityIndicator size="large" color={Config.mainColor} style={{marginTop: 200}}/> :
				<ScrollView 
					style={styles.container}
					refreshControl={
						!this.props.isLike ?
			          	<RefreshControl
				            refreshing={this.state.isRefreshing}
				            onRefresh={this.refreshData.bind(this)}
				            title="正在获取下一篇新闻..."
			          	/> :
			          	<RefreshControl
				            refreshing={false}
			          	/>
			        }>
					<Text style={styles.title}>{data.title}</Text>
					<Text style={styles.headline}>
						{data.source}&nbsp;
						{data.ptime}&nbsp;
						<Text>{data.category}</Text>&nbsp;
						<Text 
							onPress={() => (
								Linking.openURL(data.shareLink)
							)} 
							style={styles.link}>查看原文</Text>
					</Text>
					<HTML 
			  			html={data.body || '<br>'} 
			  			{...Config.htmlProps}
			  		/>
				</ScrollView>
			}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrap: {
		minHeight: 500
	},
	container: {
		padding: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: '800',
		lineHeight: 24,
		marginBottom: 15
	},
	headline: {
		fontSize: 13,
		color: '#666',
		lineHeight: 18,
		marginBottom: 10
	},
	link: {
		fontSize: 13,
		color: Config.mainColor,
		marginLeft: 10
	}
})
export default News