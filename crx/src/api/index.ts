import { CONSTs } from '../types/enum'

class API {
	private api: string
	constructor() {
		this.api = process.env.NODE_ENV === 'development' ? CONSTs.DEV_API as string : CONSTs.API as string
	}
	get(path: string) {
		return fetch(`${this.api}/${path}`)
	}
	post(path: string, data: any) {
		return fetch(`${this.api}/${path}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
}

export default new API()
