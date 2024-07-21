import { TemplateLiteral, Node } from 'estree'
import type { JsonFileManager } from '../tool/json-file'
import type { Rule } from 'eslint'

// 替换内容类型
export enum ReplaceType {
	TemplateLiteral,
	Literal,
}

export type EntranceTextParams = {
	message?: string
	text: string
}

export interface FlattenRt {
	key: string
	value: string
	md5: string
}

export type FlattenRts = FlattenRt[]

export interface I18nValueMap extends FlattenRt {
	parentKey: string
}

export type I18nValueMaps = I18nValueMap[]

export interface I18nJsonMap {
	parentKey: string

	jsonFile: JsonFileManager
}

export interface InsertionImportFnParams {
	node: Node
	context: Rule.RuleContext
	lastImportIndex: number
}

export interface GetParentCallExpressionParams {
	node: Rule.Node
	text: string
}
