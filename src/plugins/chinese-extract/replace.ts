import { EntranceTextParams, InsertionImportFnParams } from '../../types/plugins'
import { hasI18nValue, createTemplateKey } from '../../store/index'

// 判断有没有 t 方法
export function isI18nFn(text: string) {
	if (text.startsWith('t(')) {
		return true
	}
	return false
}

// 转化入口 这里相当于入口函数
export function entranceText({ node, templateString }: EntranceTextParams) {
	// 查询 templateString

	const i18nValueMapValue = hasI18nValue(templateString)
	if (i18nValueMapValue) {
		// 存在 直接就返回了 相关对象
		let paramskey = i18nValueMapValue.parentKey
		let key = i18nValueMapValue.key
		let newKey = `${paramskey}.${key}`
		return newKey
	} else {
		// 不存在 开始往新的 json 插入
		let newKey = createTemplateKey(templateString)
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
