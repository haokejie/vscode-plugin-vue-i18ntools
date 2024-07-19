import { getVsCodeProjectPath, isAccess } from './tool/file'
import { Config } from './types/config'
import { join } from 'path'
import { PathEnum } from './tool/enums'
import { JsonFileManager } from './tool/json-file'

let configBase: Config = {
	outDir: 'src/locales/lang',
	i18nLang: 'zh-CN',
	outFileName: 'viewskey.json',
}

export function getConfig(): Config {
	return configBase
}

// 获取 config.josn 并初始化
export async function getSetConfigFile() {
	const projectPath = getVsCodeProjectPath()
	const configPath = join(projectPath, PathEnum.ConfigPath)
	console.log('配置路径', configPath)
	const isFile = await isAccess(configPath)
	if (!isFile) {
		return false
	}
	const configJsonFile = new JsonFileManager(configPath)
	let configJson = configJsonFile.readJson()
	if (configJson) {
		Object.assign(configBase, configJson)
	}
}

// 文件路径
export function getI18nFilePath(): string {
	const config = getConfig()
	const projectPath = getVsCodeProjectPath()
	const i18nPatn = join(projectPath, config.outDir, config.i18nLang, config.outFileName)
	return i18nPatn
}

// i18n dir 文件夹路径
export function getI18nDirPath(): string {
	const config = getConfig()
	const projectPath = getVsCodeProjectPath()
	const i18nDirPath = join(projectPath, config.outDir, config.i18nLang)
	return i18nDirPath
}
