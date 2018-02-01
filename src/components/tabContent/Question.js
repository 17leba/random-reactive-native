import React, { Component } from 'react'
import HTML from 'react-native-render-html'
 
import Config from './../../config'
import Fetch from './../../utils/fetch'

import {
  	StyleSheet,
  	Text,
  	View,
  	FlatList,
  	ScrollView, 
  	Linking,
  	Image,
  	RefreshControl,
  	ActivityIndicator,
  	Alert
} from 'react-native'

class Question extends Component<{}>{
	state = {
		loading: true,
		isRefreshing: this.props.isLike ? true : false,
		result: {}
	}
	componentDidMount (){
		this.fetchData()
	}
	renderItem = ({item}) => (
		<ListItem
			item={item}
			questionId={this.state.result.id}
			author={item.author}
			content={item.content}
			voteupCount={item.voteup_count}
			createdTime={item.created_time}
		/>
	)
	async fetchData (){
		!this.state.isRefreshing && this.setState({
			loading: true
		})
		let res = await Fetch.get(this.props.url, {
			question_id: this.props.id || ''
		})
		if(res){
			this.setState({
				loading:false,
				result: res
			})
			this.props.getLikePara && this.props.getLikePara({
				loveId: res.id,
		    	type: 'question',
		    	title: res.title,
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
		return (
			<View>
			{ 
				this.state.loading ?
				<ActivityIndicator size="large" color={Config.mainColor} style={{marginTop: 200}}/> :
				<FlatList
					ListHeaderComponent={() => <Text style={styles.title}>{ this.state.result.title }</Text>}
				  	keyExtractor={(item) => item.id}
				  	data={this.state.result.data}
				  	renderItem={this.renderItem}
				  	refreshControl={
				  		!this.props.isLike ?
			          	<RefreshControl
				            refreshing={this.state.isRefreshing}
				            onRefresh={this.refreshData.bind(this)}
				            title="正在获取下一个问答..."
			          	/> :
			          	<RefreshControl refreshing={false}/>
			        }
				/>
				
			}
			</View>
		)
	}
}

class ListItem extends Component<{}>{
    pressLink = () => {
    	let linkUrl = `https://www.zhihu.com/question/${this.props.questionId}/answer/${this.props.item.id}`
		Linking.openURL(linkUrl)
    }
	formatTime (time) {
      	let date = new Date(time * 1000)
      	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
	render (){
		return (
			<View style={styles.listContent}>
			  	<View style={styles.author}>
		  			<Image
				        style={styles.icons}
				        source={{ uri: this.props.author.avatar_url }}
				      />
				    <View style={styles.authorMain}>
					    <Text style={styles.name}>
					    	{this.props.author.name}&nbsp;
					    	<Text 
					    		style={styles.link}
					    		onPress={this.pressLink}>
					    		知乎查看
					    	</Text>
					    </Text>
					    <HTML 
					    	style={styles.headline}
				  			html={this.props.author.headline || '<br>'} 
				  			{...Config.htmlProps}
				  			baseFontStyle={{
				  				fontSize: 13,
				  				color: '#666'
				  			}}
				  		/>
				    </View>
			  	</View>
			  	<View>
			  		<Text style={styles.subInfo}>
			  			<Text style={styles.voteCount}>{this.props.voteupCount}</Text>人赞同 
			  			创建于{this.formatTime(this.props.createdTime)}
			  		</Text>
			  	</View>
		  		<HTML 
		  			html={this.props.content || '<br>'} 
		  			{...Config.htmlProps}
		  		/>
		  	</View>
		)
	}
}

const styles = StyleSheet.create({
  	flex: {
		flex: 1
	},
	icons: {
		width: 34,
		height: 34,
		marginRight: 10
	},
	title: {
		padding: 10,
		fontSize: 20,
		fontWeight: '800',
		lineHeight: 24
	},
	author: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	name: {
		fontSize: 18,
		color: '#000',
		marginBottom: 5
	},
	headline: {
	},
	listContent: {
		marginBottom: 10,
		padding: 10
	},
	subInfo: {
		color: '#999',
		fontSize: 13,
		marginBottom: 10,
	},
	voteCount: {
		color: Config.mainColor
	},
	link: {
		fontSize: 14,
		color: Config.mainColor,
		marginLeft: 10
	}
})
export default Question
