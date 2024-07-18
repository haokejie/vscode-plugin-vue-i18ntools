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

export function getI18nFilePath(): string {
	const config = getConfig()
	const projectPath = getVsCodeProjectPath()
	const i18nPatn = join(projectPath, config.outDir, config.i18nLang, config.outFileName)
	return i18nPatn
}

getI18nFilePath()
