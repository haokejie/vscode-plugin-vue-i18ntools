import { TemplateLiteral, Node } from 'estree'
// 替换内容类型
export enum ReplaceType {
	TemplateLiteral,
	Literal,
}

export type replaceTextParams = {
	node: Node
	message?: string
	newTemplateText: string
}

export type EntranceTextParams = {
	node: Node
	message?: string
	newTemplateText: string
}
