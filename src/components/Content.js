import React, { Component } from 'react';
import HTML from 'react-native-render-html'
import {
  	Text,
  	View,
  	Image,
  	StyleSheet,
  	NavigatorIOS,
  	TabBarIOS,
  	FlatList,
  	ActivityIndicator,
  	TouchableHighlight,
  	Alert
} from 'react-native'

import Config from './../config'
import Fetch from './../utils/fetch'
import Cookie from './../utils/cookie'

import Question from './tabContent/Question'
import News from './tabContent/News'
import Music from './tabContent/Music'
import Center from './tabContent/Center'

class MainContent extends Component<{}> {
	state = {
		selectedTab: 'Question',
		isTab: true,
		loading: true
	}
	navContent = () => (
		<NavigatorIOS
			ref='nav'
	        initialRoute={{
	          	component: this.state.navComponent || MyScene,
	          	title: this.state.navTitle || 'Random Message',
		        leftButtonTitle:'Center',
		        onLeftButtonPress:() => this.handleNavBack(),
		        itemWrapperStyle:styles.navWrap,
	        }}
	        style={styles.flex}
      	/>
	)
	handleNavBack() {
		// back center
		this.setState({
	        selectedTab: 'Center',
	        isTab: true
	    })
  	}
  	handleNav = (options) => {
  		this.setState({
  			isTab: false,
  			navComponent: options.component,
  			navTitle: options.navTitle
  		})
  	}
 	render() {
	    return (
    	<View style={styles.flex}>
            <Text style={this.state.isTab ? styles.header : {display : 'none'}}>
            	{this.state.selectedTab}
            </Text>
            <TabBarIOS
                barTintColor='#fff'
                tintColor={Config.mainColor}
                unselectedTintColor='#333'>
                {
                  Config.tabs.map((item, index) => {
                    return <TabBarIOS.Item
                        title={item.name}
                        key={index}
                        icon={item.icon}
                        selectedIcon={item.selectedIcon}
                        selected={this.state.selectedTab === item.name}
                        style={styles.tabBarItem}
                        renderAsOriginal
                        onPress={() => {
                            this.setState({
                                selectedTab: item.name,
                                isTab: true
                            })
                        }}>
                        {
                        	this.state.isTab ? 
                        	<SwitchContent 
                        		type={item.name} 
                        		item={item} 
                        		handleNav={this.handleNav.bind(this)}
                    		/> :
                    		this.navContent()
                        }
                        </TabBarIOS.Item>
                    })
                }
        	</TabBarIOS>
		</View>
	    )
  	}
}

class SwitchContent extends Component<{}>{
	state = {
		loading: true,
		likePara: {},
		result : {}
	}
	showLikeList = ['Question', 'News']
	getLikePara (params){
		this.setState({
			likePara: {
				loveId: params.loveId,
				type: params.type,
		    	title: params.title,
		    	tag: params.tag
			}
		})
	}
	async handleLike (){
		let userID = await Cookie.get('USER_SID')
		if(!userID){
			Alert.alert('请先登录')
			return
		}
		let res = await Fetch.post(Config.upLikeUrl, {
			love_id: this.state.likePara.loveId,
	    	type: this.state.likePara.type,
	    	title: this.state.likePara.title,
	    	tag: +!this.state.likePara.tag
		})
  		if(res.success){
			await this.setState({
				likePara: Object.assign(this.state.likePara,{
					tag: !this.state.likePara.tag
				})
			})
	  		return res
  		}else{
  			Alert.alert(res.message)
  			return false
  		}
  	}
	getComponent (){
		switch(this.props.type){
			case 'News':
				return 	<News 
					url={this.props.item.url}
					getLikePara={this.getLikePara.bind(this)}/>
			case 'Question':
				return <Question 
					url={this.props.item.url}
					getLikePara={this.getLikePara.bind(this)}/>
			case 'Music':
				return <Music 
					url={this.props.item.url}
					getLikePara={this.getLikePara.bind(this)}
					handleLike={this.handleLike.bind(this)}/>
			case 'Center':
				return <Center handleNav={this.props.handleNav}/>
		}
	}
	render(){
		return (
			<View>
			{ this.getComponent() }
			<TouchableHighlight 
				underlayColor='#fff'
				style={
					this.showLikeList.includes(this.props.type) ? 
					styles.iconWrap :
					styles.hide
				}
				onPress={this.handleLike.bind(this)}>
				<Image 
					source={this.state.likePara.tag ? Config.likedIcon : Config.likeIcon}
					style={[styles.icons,styles.like]}/>
			</TouchableHighlight>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	flex: {
		flex: 1
	},
	hide: {
		display: 'none'
	},
    header: {
        backgroundColor: Config.mainColor,
        height: 65,
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 80,
    },
    contentWrap: {
    	minHeight: 500,
    	justifyContent: 'center'
    },
    iconWrap: {
    	position: 'absolute',
    	right: 10,
    	top: 80,
    	zIndex: 999,
    },
    icons: {
    	width: 40,
    	height: 40,
    	opacity: .8
    },
    navWrap: {
    	marginTop: 200,
    	backgroundColor: 'red'
    }
})

export default MainContent
