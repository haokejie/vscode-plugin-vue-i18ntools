// 这里是个校对库
import { getI18nFilePath, getI18nDirPath, getConfig } from '../config'
import { traverseDirectory, isAccess } from '../tool/file'
import { JsonFileManager } from '../tool/json-file'
import { md5Hash } from '../tool/utils'
import { forEach, isObject, isArray, forOwn } from 'lodash'
import { FlattenRts, I18nValueMap, I18nJsonMap } from '../types/plugins'
import { TwitterSnowflake } from '@sapphire/snowflake'

import * as path from 'path'

const i18nValueMap = new Map<string, I18nValueMap>()
const i18nJsonMap = new Map<string, I18nJsonMap>()
let i18nIsInit = false
let i18nInitLoading = false // 初始化的状态

// 判断是否存在
export function hasI18nValue(value: string): I18nValueMap | undefined {
	// 先将 value md5
	const valueMd5 = md5Hash(value)
	const i18nMap = i18nValueMap.get(valueMd5)
	if (i18nMap) {
		return i18nMap
	} else {
		return undefined
	}
}

export async function initI18Map() {
	try {
		if (i18nIsInit) {
			return
		}
		i18nInitLoading = true
		// 下面是初始化的代码
		// 获取 i18n 文件的路径
		const pathDirValue = getI18nDirPath()

		const pathDirValues = traverseDirectory(pathDirValue)

		const pathFileValue = getI18nFilePath()

		// 先判断  pathFileValue 是否存在
		if (!pathDirValues.includes(pathFileValue)) {
			pathDirValues.push(pathFileValue)
		}
		// 开始生成 json 对象
		pathDirValues.forEach((item) => {
			let jsonFile = new JsonFileManager(item, true)
			// 获取 parentKey
			const parentKey = formatI18nParentKey(item)
			i18nJsonMap.set(parentKey, {
				parentKey,
				jsonFile,
			})
			setI18nValueMap(parentKey, jsonFile, item)
		})
		i18nIsInit = true
	} catch (error) {
		console.log('初始化错误', error)
	} finally {
		i18nInitLoading = false
	}
}

export function setI18nValueMap(parentKey: string, jsonFile: JsonFileManager, filePath: string) {
	//开始读取 json中的内容并生成 key
	const jsonObj = jsonFile.readJson()
	if (jsonObj) {
		// 需要一个循环迭代器生成 child key
		const newJsonObj = flattenObject(jsonObj)
		if (newJsonObj) {
			forEach(newJsonObj, (flattenItem) => {
				i18nValueMap.set(flattenItem.md5, Object.assign(flattenItem, { parentKey }))
			})
		}
	}
}

// 开始向 json 创建
export function createTemplateKey(templateString: string) {
	console.log('templateString', templateString)
	const config = getConfig()
	const [parentKey] = config.outFileName.split('.')
	console.log('createTemplateKey.parentKey', parentKey)
	const valueMd5 = md5Hash(templateString)
	if (i18nJsonMap.has(parentKey)) {
		const jsonFile = i18nJsonMap.get(parentKey)
		let key = TwitterSnowflake.generate().toString()
		// 构建
		jsonFile?.jsonFile.setJsonKey(key, templateString)

		i18nValueMap.set(valueMd5, {
			parentKey,
			md5: valueMd5,
			value: templateString,
			key,
		})
		return `${parentKey}.${key}`
	} else {
		return null
	}
}

// 从 i18nValueMap 获取拼接好的 key
export function getI18nKey(md5Key: string) {
	let res = i18nValueMap.get(md5Key)
	if (res) {
		const newKey = `${res.parentKey}.${res.key}`
		return newKey
	} else {
		return ''
	}
}

// 清除缓存
export function cleanCacheI18n() {
	i18nValueMap.clear()
	i18nJsonMap.clear()
	i18nIsInit = false
	i18nInitLoading = false
}

export function getI18nInitLoading() {
	return i18nInitLoading
}

function formatI18nParentKey(filePath: string): string {
	const pathDirValue = getI18nDirPath()
	const relativePath = path.relative(pathDirValue, filePath)
	const segments = relativePath.split(path.sep).filter((segment) => segment)
	const formattedKey = segments.map((segment) => path.parse(segment).name).join('.')
	return formattedKey
}

function flattenObject(obj: object, parentKey = '', res: FlattenRts = []) {
	forOwn(obj, (value, key) => {
		const newKey = parentKey ? `${parentKey}.${key}` : key

		if (isObject(value) && !isArray(value) && value !== null) {
			flattenObject(value, newKey, res)
		} else if (isArray(value)) {
			// 数组对象转化成字符串 JSON.stringify(array)
			let newValue = JSON.stringify(value)
			res.push({ key: newKey, value: newValue, md5: md5Hash(newValue) })
		} else {
			res.push({ key: newKey, value, md5: md5Hash(value) })
		}
	})
	return res
}
