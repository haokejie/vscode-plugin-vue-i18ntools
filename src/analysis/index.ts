import { ESLint } from 'eslint'
const vueParser = require.resolve('vue-eslint-parser')
const tsParser = require('@typescript-eslint/parser')
const espree = require('espree')
import { meta, ChineseExtract } from '../plugins/chinese-extract'

// eslint配置提取
export async function analysis(url: string) {
	const eslint = new ESLint({
		fix: true, // 是否自动修复
		plugins: { [meta.name]: ChineseExtract },
		overrideConfig: {
			extends: ['plugin:extracting/extract'],
			// 添加vue和ts解析功能
			parser: vueParser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: {
					jsx: true,
				},
				parser: {
					js: espree,
					jsx: espree,
					ts: tsParser,
					tsx: tsParser,
				},
			},
			rules: {
				'prettier/prettier': 'off',
			},
		},
	})

	// 检查文件
	const results = await eslint.lintFiles([url])

	// 输出回原文件
	await ESLint.outputFixes(results)
}
