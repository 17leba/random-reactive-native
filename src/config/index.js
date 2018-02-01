import {
  	Dimensions
} from 'react-native'

const baseUrl = 'http://ypber.com:3000'

export default {
	mainColor: '#fa7d3c',
	baseUrl: baseUrl,
	questionUrl: `${baseUrl}/api/random/question`,
	newsUrl: `${baseUrl}/api/random/news`,
	musicUrl: `${baseUrl}/api/random/music`,
	tabs: [{
		name: 'Question',
		icon: require('./../img/question.png'),
		selectedIcon: require('./../img/question-selected.png'),
		url: 'http://ypber.com:3000/api/random/question'
	},{
		name: 'News',
		icon: require('./../img/news.png'),
		selectedIcon: require('./../img/news-selected.png'),
		url: 'http://ypber.com:3000/api/random/news'
	},{
		name: 'Music',
		icon: require('./../img/music.png'),
		selectedIcon: require('./../img/music-selected.png'),
		url: 'http://ypber.com:3000/api/random/music'
	},{
		name: 'Center',
		icon: require('./../img/center.png'),
		selectedIcon: require('./../img/center-selected.png'),
		url: false
	}],
	playMusicPole: require('./../img/play-pole.png'),
	likeIcon: require('./../img/like.png'),
	likedIcon: require('./../img/liked.png'),
	playIcon: require('./../img/play.png'),
	pauseIcon: require('./../img/pause.png'),
	nextIcon: require('./../img/next.png'),
	loginUrl: 'http://ypber.com:3000/api/user/login',
	likeListUrl: 'http://ypber.com:3000/api/love/list',
	upLikeUrl: 'http://ypber.com:3000/api/love/update',
	htmlProps: {
		imagesMaxWidth: Dimensions.get('window').width - 20,
    	onLinkPress: (evt, href) => { Linking.openURL(href) },
    	tagsStyles: { img: {marginBottom: 10,marginTop: 10} },
		baseFontStyle: { fontSize: 16,lineHeight: 24 }
	}
}