import { TemplateLiteral, Node } from 'estree'
import { Rule, SourceCode } from 'eslint'
import { replaceTextParams, EntranceTextParams } from '../../types/plugins'
import { hasI18nValue } from '../../store/index'

// 判断有没有 t 方法
export function isI18nFn(text: string) {
	if (text.startsWith('t(')) {
		return true
	}
	return false
}

// 转化入口
export function replaceText({
	node,
	message = '将模板字符串转换为国际化函数调用',
	newTemplateText,
}: replaceTextParams) {
	const type = node.type
	console.log('type', type)
	// 先对文件
}

// 转化入口 这里相当于入口函数
export function entranceText({
	node,
	message = '将模板字符串转换为国际化函数调用',
	newTemplateText,
}: EntranceTextParams) {
	// 查询 newTemplateText
	hasI18nValue(newTemplateText)
}
