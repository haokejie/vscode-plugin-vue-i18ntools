import { ESLint, Rule } from 'eslint'
import { AST } from 'vue-eslint-parser'
import { isI18nFn, entranceText } from './replace'
import { message } from '../../tool/message'
// import { TwitterSnowflake } from '@sapphire/snowflake'

export const meta = {
	name: 'eslint-plugin-extracting',
	version: '1.0.0',
}
export const ChineseExtract: ESLint.Plugin = {
	rules: {
		'chinese-extract': {
			meta: {
				/*
         "problem"表示规则正在标识将导致错误或可能导致混淆行为的代码。开发人员应将此视为高度优先解决的问题。
        "suggestion"意味着规则正在识别可以以更好的方式完成的事情，但如果不更改代码就不会发生错误。
        "layout"意味着规则主要关心空格、分号、逗号和括号，程序的所有部分决定代码的外观而不是代码的执行方式。这些规则适用于 AST 中未指定的部分代码。
                * */
				type: 'suggestion',
				// 定义提示信息文本 error-name为提示文本的名称 定义后我们可以在规则内部使用这个名称
				messages: {
					// 'error-name': '这是一个错误的命名',
				},
				docs: {
					description: '检测使用了中文并进行提取',
				},
				// 标识这条规则是否可以修复，假如没有这属性，即使你在下面那个create方法里实现了fix功能，eslint也不会帮你修复
				fixable: 'code',
				// 这里定义了这条规则需要的参数
				// 比如我们是这样使用带参数的rule的时候，rules: { myRule: ['error', param1, param2....]}
				// error后面的就是参数，而参数就是在这里定义的
				schema: [],
			},
			create(context) {
				let hasTImport = false
				let lastImportIndex = 0
				message({
					msg: '一切正常',
				})
				return context.parserServices.defineTemplateBodyVisitor(
					{},
					{
						Program(node) {
							const sourceCode = context.sourceCode
							//TODO: 自动导入方法 还未完善
							node.body.forEach((childNode, index) => {
								if (childNode.type === 'ImportDeclaration') {
									lastImportIndex = index
									childNode.specifiers.forEach((specifier) => {
										if (
											(specifier.type === 'ImportDefaultSpecifier' &&
												specifier.local.name === 't') ||
											(specifier.type === 'ImportSpecifier' &&
												specifier.imported.name === 't')
										) {
											hasTImport = true
										}
									})
								}
							})
						},
						Literal(node: Rule.Node): void {
							// console.log('node', node)
						},
						TemplateLiteral(node) {
							const sourceCode = context.sourceCode
							const text = sourceCode.getText(node)
							console.log(node)
							console.log(text)
							if (isI18nFn(text)) {
								return
							}
							console.log('不是 i18')
							const quasis = node.quasis.map((q) => q.value.cooked)
							const expressions = node.expressions.map((exp) =>
								sourceCode.getText(exp)
							)
							let templateString = ''
							quasis.forEach((quasi, index) => {
								if (index !== 0) {
									templateString += `{${index - 1}}`
								}
								templateString += quasi
							})

							// 创建新的模板字符串文本 也就是需要替换的文本 需要查询
							let newTemplateText = `t('${templateString}')`
							if (expressions.length !== 0) {
								newTemplateText = `t('${templateString}', [${expressions.join(
									', '
								)}])`
							}

							entranceText({
								node,
								newTemplateText,
							})
							// context.report({
							// 	node,
							// 	message: '将模板字符串转换为国际化函数调用',
							// 	fix(fixer) {
							// 		return fixer.replaceText(node, newTemplateText)
							// 	},
							// })

							// TODO: 自动导入方法 暂时不开启 实际上应该封装个函数
							// if (!hasTImport) {
							// 	context.report({
							// 		node,
							// 		message: "文件未导入 t 函数",
							// 		fix(fixer) {
							// 			const importStatement = "\nimport { t } from 'your-i18n-library';\n";
							// 			const lastImportNode = context.sourceCode.ast.body[lastImportIndex];
							// 			if (lastImportIndex === 0) {
							// 				return fixer.insertTextBeforeRange([0, 0], importStatement);
							// 			} else {
							// 				return fixer.insertTextAfter(lastImportNode, importStatement);
							// 			}
							// 		}
							// 	});
							// 	return;
							// }
						},
					} as Rule.NodeListener,
					{
						templateBodyTriggerSelector: 'Program:exit',
					}
				)
			},
		},
	},
	configs: {
		extract: {
			plugins: ['extracting'], // 插件的前缀名称
			rules: {
				'extracting/chinese-extract': 'error',
			},
		},
	},
}
