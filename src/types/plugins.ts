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

export interface FlattenRt {
	key: string
	value: string
	md5: string
}

export type FlattenRts = FlattenRt[]

export interface I18nValueMap extends FlattenRt {
	parentKey: string
	filePath: string
}

export type I18nValueMaps = I18nValueMap[]
