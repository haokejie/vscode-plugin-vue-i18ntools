import {
	EntranceTextParams,
	InsertionImportFnParams,
	GetParentCallExpressionParams,
} from '../../types/plugins'
import { hasI18nValue, createTemplateKey } from '../../store/index'
import { isChinese } from '../../tool/utils'

// 判断有没有 t 方法
export function isI18nFn(text: string) {
	if (text.startsWith('t(')) {
		return true
	}
	return false
}

// 转化入口 这里相当于入口函数
export function entranceText({ text }: EntranceTextParams): string | null {
	// 查询 templateString
	// 先判断字符串是否有中文

	if (!isChinese(text)) {
		return null
	}

	const i18nValueMapValue = hasI18nValue(text)
	if (i18nValueMapValue) {
		// 存在 直接就返回了 相关对象
		let paramskey = i18nValueMapValue.parentKey
		let key = i18nValueMapValue.key
		let newKey = `${paramskey}.${key}`
		return newKey
	} else {
		// 不存在 开始往新的 json 插入
		let newKey = createTemplateKey(text)
		return newKey
	}
}

export function insertionImportFn({ node, context, lastImportIndex }: InsertionImportFnParams) {
	context.report({
		node,
		message: '文件未导入 t 函数',
		fix(fixer) {
			const importStatement =
				"\nimport { useI18n } from '@/hooks/web/useI18n';\nconst { t } = useI18n();"
			const lastImportNode = context.sourceCode.ast.body[lastImportIndex]
			if (lastImportIndex === 0) {
				return fixer.insertTextBeforeRange([0, 0], importStatement)
			} else {
				return fixer.insertTextAfter(lastImportNode, importStatement)
			}
		},
	})
}

export function getParentCallExpression({ node, text }: GetParentCallExpressionParams) {
	let parent = node.parent
	if (!parent) {
		console.log('没有父节点')
		return null
	}
	if (parent.type === 'VariableDeclarator') {
		// 是变量
		console.log('是变量', node)
		return true
	} else if (parent.type === 'Literal') {
		return false
	} else if (parent.type === 'Property') {
		return true
	} else if (parent.type === 'ReturnStatement') {
		console.log('return')
		return true
	} else if (parent.type === 'ConditionalExpression') {
		return true
	} else if (parent.type === 'CallExpression') {
		return true
	} else if (parent.type === 'ImportDeclaration') {
		return false
	} else if (parent.type === 'ArrayExpression') {
		return true
	} else if (parent.type === 'AssignmentExpression') {
		return true
	} else {
		console.log('不存在的类型', text, parent)
		return null
	}
}
