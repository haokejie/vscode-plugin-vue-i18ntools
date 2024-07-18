import { isString, isObject } from 'lodash'
import * as crypto from 'crypto'

export function isJson(str: any) {
	if (isString(isJson)) {
		try {
			const obj = JSON.parse(str)
			if (isObject(obj) && obj) {
				return true
			} else {
				return false
			}
		} catch (e) {
			console.log('error：' + str + '!!!' + e)
			return false
		}
	}
	console.log('It is not a string!')
	return false
}

export function md5Hash(data: string) {
	const hash = crypto.createHash('md5')
	hash.update(data)
	return hash.digest('hex')
}
