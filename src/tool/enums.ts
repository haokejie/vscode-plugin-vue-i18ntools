// 错误提示级别
export enum MessageType {
	info = '提示',
	warn = '警告',
	success = '成功',
	error = '错误',
}

// 命令枚举集合
export enum CommandsEnum {
	ExtractChinese = 'haokejie-plugin-i18ntools.extracting', // 提取文件中的中文
	CleanCache = 'haokejie-plugin-i18ntools.cleanCache', // 清除缓存
}

export enum PathEnum {
	ConfigPath = 'extracting-config.json',
}
