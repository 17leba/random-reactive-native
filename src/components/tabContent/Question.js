import React, { Component } from 'react'
import HTML from 'react-native-render-html'
import Spinner from 'react-native-spinkit'
 
import Config from './../../config'
import Fetch from './../../utils/fetch'

import {
  	StyleSheet,
  	Text,
  	View,
  	FlatList,
  	ScrollView, 
  	Dimensions,
  	Linking,
  	Image,
  	RefreshControl,
  	ActivityIndicator,
  	Alert
} from 'react-native'

const DEFAULT_PROPS = {
    imagesMaxWidth: Dimensions.get('window').width - 20,
    onLinkPress: (evt, href) => { Linking.openURL(href) },
    tagsStyles: { p: {fontSize: 18, lineHeight: 22}, img: {marginBottom: 10,marginTop: 10} },
}

class Question extends Component<{}>{
	state = {
		loading: true,
		isRefreshing: false,
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
		let res = await Fetch.get(this.props.url)
		if(res){
			this.setState({
				loading:false,
				result: res
			})
			this.props.getLikePara({
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
			          	<RefreshControl
				            refreshing={this.state.isRefreshing}
				            onRefresh={this.refreshData.bind(this)}
				            title="正在获取下一个问答..."
			          	/>
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
				  			{...DEFAULT_PROPS}
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
		  			{...DEFAULT_PROPS}
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
		fontWeight: '800',
		fontSize: 18,
		color: '#000',
		marginBottom: 5
	},
	headline: {
		fontSize: 14,
		color: '#666',
		lineHeight: 18
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
