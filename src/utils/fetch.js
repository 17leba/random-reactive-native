import qs from 'qs'

export default {
	async get (url, paraObj = {}, options = {}){
		let defaultOptions = {
			method: 'GET',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
		  	}
		}
		if(Object.keys(options).length){
			Object.assign(defaultOptions, options)
		}
		let reqUrl = `${url}?${qs.stringify(paraObj)}` 
		try{
			let res = await fetch(reqUrl, defaultOptions)
			let resJson = await res.json()
			return resJson
		}catch(error){
			console.log(error)
			return false
		}

	},
	async post(url, paraObj = {}, options = {}){
		let defaultOptions = {
			method: 'POST',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
		  	},
		  	body: JSON.stringify(paraObj)
		}
		if(Object.keys(options).length){
			Object.assign(defaultOptions, options)
		}
		try{
			let res = await fetch(url, defaultOptions)
			let resJson = await res.json()
			return resJson
		}catch(error){
			console.log(error)
		}
	}
}