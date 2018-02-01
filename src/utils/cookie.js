import Config from './../config'
import Cookie from 'react-native-cookies'

export default {
	async get (name){
		let obj = await Cookie.get(Config.baseUrl)
		return obj[name]
	}
}