import request from 'request'

class Instagram {
	constructor({APP_ID, APP_SECRET, REDIRECT_URL}) {
		this.APP_ID = APP_ID
		this.APP_SECRET = APP_SECRET
		this.REDIRECT_URL = REDIRECT_URL
		this.GRAPH_URL = 'https://graph.instagram.com'
		this.AUTH_URL = 'https://api.instagram.com/oauth'
		this.SHORT_ACCESS_TOKEN = null
	}

	_config() {
		return {
			APP_ID: this.APP_ID,
			APP_SECRET: this.APP_SECRET,
			REDIRECT_URL: this.REDIRECT_URL,
		}
	}

	_responseHandler = (resolve, reject) => (error, response) => {
		if (error) {
			reject(error)
			return
		}
		const json = JSON.parse(response.body)
		if (json.error_type) {
			reject(json)
			return
		}
		resolve(json)
	}

	_authRequest(type, code) {
		return new Promise((resolve, reject) => {
			const options = {
				method: 'POST',
				headers: {
			    'Content-Type': 'application/x-www-form-urlencoded'
			  },
			  url: `${this.AUTH_URL}/${type}`,
			  form: {
			    client_id: this.APP_ID,
			    client_secret: this.APP_SECRET,
			    grant_type: 'authorization_code',
			    code: code,
			    redirect_uri: this.REDIRECT_URL,
			  }
			}
			request(options, this._responseHandler(resolve, reject))
		})
	}

	_request = {
		get: (url, params) => {
			return new Promise((resolve, reject) => {
				const query = Object.keys(params)
					.map(key => `&${key}=${Array.isArray(params[key]) ? params[key].join(',') : params[key]}`)
					.join('')
				
				request({
					method: 'GET',
					url: `${this.GRAPH_URL}/${url}?access_token=${this.SHORT_ACCESS_TOKEN}${query}`
				}, this._responseHandler(resolve, reject))
			})
		}
	}

	getAccessToken(code) {
		return new Promise((resolve, reject) => {
			if (!this.SHORT_ACCESS_TOKEN) {
				this._authRequest('access_token', code).then(result => {
					this.SHORT_ACCESS_TOKEN = result.access_token
					resolve(result)
				})
				.catch(error => {
					reject(error)
				})
			} else {
				resolve({access_token: this.SHORT_ACCESS_TOKEN})
			}
		})
	}

	me() {
		return this._request.get('me/media', {fields: ['id','caption','media_url','media_type']})
	}
}

export default Instagram
