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

export const isAllChinese = (str: string) => {
	const regex = /^[\u4e00-\u9fa5]+$/
	return regex.test(str)
}

export const isChinese = (str: string) => {
	const regex = /[\u4e00-\u9fa5]/
	return regex.test(str)
}

export const removeOuterQuotes = (str: string) => {
	// 检查字符串是否以单引号开头并以单引号结尾
	if (str.startsWith("'") && str.endsWith("'")) {
		return str.slice(1, -1)
	}
	// 检查字符串是否以双引号开头并以双引号结尾
	if (str.startsWith('"') && str.endsWith('"')) {
		return str.slice(1, -1)
	}
	// 如果没有外层的引号，返回原始字符串
	return str
}
