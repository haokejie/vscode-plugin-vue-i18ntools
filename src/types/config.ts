export type Config = {
	// 注意输出的文件地址为：项目地址+outFile+文件.json
	// 这是文件输出的目录地址
	outDir: string
	// i18n的语言文件目录
	// 项目的i18n语言路径,路径编写需要前斜杠，如：/src/i18n/zh
	i18nLang: string
	// 统一输出的文件名称，固定为json文件
	outFileName: string
}
