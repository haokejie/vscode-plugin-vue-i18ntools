// 这里是个校对库
import { getI18nFilePath, getI18nDirPath } from '../config'
import { traverseDirectory, isAccess } from '../tool/file'
import { JsonFileManager } from '../tool/json-file'

const i18nValueMap = new Map()
const i18nJsonMap = new Map()
let i18nIsInit = false
let i18nInitLoading = false // 初始化的状态

export async function hasI18nValue(value: string) {}

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
			let jsonFile = new JsonFileManager(item)
			i18nJsonMap.set(item, jsonFile)
		})
	} catch (error) {
		console.log('初始化错误')
	} finally {
		i18nInitLoading = false
	}
}

export function cleanCacheI18n() {
	i18nValueMap.clear()
	i18nIsInit = false
}

export function getI18nInitLoading() {
	return i18nInitLoading
}

function formatI18nParentKey(path: string): string {
	const pathDirValue = getI18nDirPath()
	return ''
}
