import React, { Component } from 'react'
import HTML from 'react-native-render-html'
import Sound from 'react-native-sound'

import Config from './../../config'
import Fetch from './../../utils/fetch'

import {
	StyleSheet,
  	Text,
  	View,
  	Image,
  	Alert,
  	Linking,
  	Dimensions,
  	Animated,
  	TouchableHighlight,
  	Easing
} from 'react-native'

const DEFAULT_PROPS = {
    imagesMaxWidth: Dimensions.get('window').width - 20,
    onLinkPress: (evt, href) => { Linking.openURL(href) },
    tagsStyles: { p: {fontSize: 15, lineHeight: 22} },
    containerStyle: {},
    onParsed: (dom) => {},
    debug: false
}

class Music extends Component<{}>{
	constructor (props){
		super(props)
		Sound.setCategory('Playback', true)
	}
	state = {
		result: {},
		loading: true,
		rotatePole: new Animated.Value(-65),
		rotateCover: new Animated.Value(0),
		rotateCoverPause: 0,
		song: {},
		music: null,
		play: false,
		currentTime: '00:00',
		leftTime: '00:00',
		canPlay: false,
		nextFlag: false,
		hasLoved: false
	}
	componentDidMount (){
		this.fetchData()
	}
	async fetchData (){
		this.setState({
			loading: true
		})
		let res = await Fetch.get(this.props.url)
		if(res){
			await this.setState({
				loading:false,
				result: res,
				song: res.song && res.song[0] || {}
			})
			this.props.getLikePara && this.props.getLikePara({
	    		loveId: this.state.song.aid,
		    	type: 'music',
		    	title: this.state.song.title,
	    	})
	    	if(this.state.music){
				this.state.music.release()
				this.setState({
					play: false,
					nextFlag: true
				}, () => {
					this.animatedToggle()
				})
			}
			this.setState({
				music: this.initMusic(),
				leftTime: this.formatTime(this.state.song.length)
			}, () => {
				this.watchCanPlay(() => {
					this.playMusic()
				})
			})
			return true
		}else{
			Alert.alert('Network Error')
			this.setState({
				loading: false
			})
			return false
		}
	}
	async likePress () {
    	let res = await this.props.handleLike({
    		tag: this.state.hasLoved ? 0 : 1
    	})
    	if(res){
	    	this.setState({
				hasLoved: !this.state.hasLoved
			})
    	}
    }
    getNextMusic (){
		this.fetchData()
	}
	initMusic = () => {
		return new Sound(this.state.song.url, null,(error) => {
			if(error){
				Alert.alert(error)
				return	
			}
		})
	}
	timeTick (){
		this.tickInterval = setTimeout(() => {
			this.state.music.getCurrentTime((seconds) => {
				let leftSeconds = Math.ceil(this.state.song.length - seconds)
				if(leftSeconds <= 0){
					clearTimeout(this.tickInterval)
					this.tickInterval = null
					this.getNextMusic()
				}else{
					this.setState({
						leftTime: this.formatTime(leftSeconds)
					}, () => {
						this.timeTick()
					})
				}
			})
		}, 200)
	}
	togglePlay = () => {
		this.state.canPlay && this.setState({
			play: !this.state.play
		},() => {
			this.musicToggle()
			this.animatedToggle()
		})
	}
	playMusic (){
		if(!this.state.play){
			this.setState({
				play: true
			},() => {
				this.animatedToggle()
			})
		}
		this.state.music.play()
		this.timeTick()
	}
	pauseMusic (){
		if(this.state.play){
			this.state.setState({
				play: false
			})
		}
		this.state.music.pause()
	}
	
	musicToggle (){
		this.state.play ? this.playMusic() : this.pauseMusic()
	}
	animatedToggle (){
		this.state.play ? Animated.parallel([
			Animated.timing(this.state.rotatePole, {
				toValue: -40,
				easing: Easing.linear,
				duration: 500
			}),
			this.playCoverRotate()
		]).start() : Animated.parallel([
			Animated.timing(this.state.rotatePole, {
				toValue: -65,
				easing: Easing.linear,
				duration: 500
			}),
			this.pauseCoverRotate()
		]).start()
	}
	pauseCoverRotate = () => {
		this.state.rotateCover.stopAnimation((value) => {
			this.setState({
				rotateCoverPause: value
			})
		})
	}
	playCoverRotate = () => {
		if(!this.state.play) return
		this.state.rotateCover.setValue(this.state.rotateCoverPause)
		Animated.timing(this.state.rotateCover, {
			toValue: (360 + this.state.rotateCoverPause),
			easing: Easing.linear,
			duration: 15000
		}).start(this.playCoverRotate)
	}
	getInterpolatePole = () => (
		this.state.rotatePole.interpolate({
	      	inputRange: [0, 360],
	      	outputRange: ['0deg', '360deg']
    	})
	)
	getInterpolateCover = () => (
    	this.state.rotateCover.interpolate({
	      	inputRange: [0, 360],
	      	outputRange: ['0deg', '360deg']
    	})
	)
	watchCanPlay (callback){
		let tick = setTimeout(() => {
			if(this.state.music._loaded){
				clearTimeout(tick)
				tick = null
				this.setState({
					canPlay: true
				}, () => {
					if(this.state.nextFlag){
						callback()
					}
				})
			}else{
				this.watchCanPlay(callback)
			}
		}, 200)

	}
	formatTime (seconds){
      	if (!seconds){
	        return '00:00'
      	}
      	let min = Math.floor(seconds / 60)
      	let sec = Math.ceil(seconds % 60)
      	return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
    }
	render(){
		return (
			<View style={styles.wrap}>
				<Animated.Image
					source={Config.playMusicPole}
					style={[styles.pole, {transform: [{rotate: this.getInterpolatePole()}] } ]}>
				</Animated.Image>
				<Animated.Image
					source={{uri: this.state.song.picture}}
					style={[styles.coverImg, {transform: [{rotate: this.getInterpolateCover()}] } ]}>
				</Animated.Image> 
				<Text style={styles.name}>{this.state.song.title}</Text>
				<Text style={styles.artist}>{this.state.song.artist}</Text>
				<View style={styles.progress}>
					<Text style={styles.leftTime}>{this.state.leftTime}</Text>
				</View>
				<View style={styles.featureWrap}>
					<TouchableHighlight 
						onPress={this.likePress.bind(this)}
						underlayColor='#fff'>
						<Image 
							source={this.state.hasLoved ? Config.likedIcon : Config.likeIcon}
							style={[styles.icons,styles.like]}/>
					</TouchableHighlight>
					<TouchableHighlight 
						onPress={this.togglePlay}
						underlayColor='#fff'>
						<Image 
							source={this.state.play ? Config.playIcon : Config.pauseIcon}
							style={[styles.icons,styles.play]}/>
					</TouchableHighlight>
					<TouchableHighlight 
						onPress={this.getNextMusic.bind(this)}
						underlayColor='#fff'
						activeOpacity={0.5}>
						<Image 
							source={Config.nextIcon}
							style={[styles.icons,styles.next]}/>
					</TouchableHighlight>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrap: {
		alignItems: 'center',
		padding: 10
	},
	icons: {
		width: 34,
		height: 34,
		marginLeft: 20,
		marginRight: 20
	},
	coverImg: {
		width: 270,
		height: 270,
		borderRadius: 135,
		borderWidth: 5,
		borderColor: '#eee',
		marginTop: 30,
		marginBottom: 20,
	},
	name: {
		fontSize: 20,
		color: Config.mainColor,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 5
	},
	artist: {
		fontSize: 14,
		color: '#333',
		marginBottom: 10
	},
	pole: {
		position: 'absolute',
		zIndex: 10,
		top: -200,
		width: 72,
		height: 413,
	},
	progress: {
		marginBottom: 10,
		marginTop: 10,
	},
	leftTime: {
		color: Config.mainColor,
		fontSize: 16,
		fontWeight: '800'
	},
	featureWrap: {
		flexDirection: 'row',
		marginTop: 10,
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	like: {
	},
	next: {
		width: 28,
		height: 28
	}
})
export default Music