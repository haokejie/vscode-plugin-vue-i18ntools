import * as fs from 'fs'
import * as path from 'path'
import { isString, isObject, isArray, omit } from 'lodash'

export class JsonFileManager {
	private filePath: string

	constructor(filePath: string) {
		this.filePath = filePath
	}

	public readJson(): object | null {
		try {
			if (!fs.existsSync(this.filePath)) {
				return null
			}
			let jsonData = fs.readFileSync(this.filePath, 'utf8').toString()
			if (jsonData.charCodeAt(0) === 0xfeff) {
				jsonData = jsonData.slice(1)
			}
			return this.toJson(jsonData)
		} catch (error) {
			return {}
		}
	}

	private toJson(str: string): object {
		if (isString(str)) {
			try {
				const obj = JSON.parse(str)
				if (isObject(obj) && obj !== null) {
					return obj
				} else {
					return {}
				}
			} catch (e) {
				console.log(`Error parsing JSON: ${str}, Error: ${e}`)
				return {}
			}
		}
		console.log('Provided data is not a string!')
		return {}
	}

	public setJson(newData: any): void {
		try {
			let jsonData = this.readJson() || {}
			const updatedData = Object.assign({}, jsonData, newData)
			this.updateJson(updatedData)
			console.log('JSON file updated successfully.')
		} catch (error) {
			console.error(`Error updating JSON file: ${error}`)
		}
	}

	public delKeyJson(paramskeys: string | string[]): void {
		try {
			if (isArray(paramskeys) && paramskeys.length <= 0) {
				return
			}
			let jsonData = this.readJson() || {}
			let newData = omit(jsonData, paramskeys)
			this.updateJson(newData)
		} catch (error) {
			console.error(`Error delKey JSON file: ${error}`)
		}
	}

	// 写入 json
	public updateJson(updatedData: any): void {
		try {
			// 确保上层文件夹存在
			this.ensureDirectoryExistence(this.filePath)

			const jsonString = JSON.stringify(updatedData, null, 2)
			console.log('Updated JSON data')
			fs.writeFileSync(this.filePath, jsonString, 'utf8')
		} catch (error) {
			console.error(`Error updating JSON file: ${error}`)
		}
	}

	// 确保上层文件夹存在
	private ensureDirectoryExistence(filePath: string): void {
		const dirname = path.dirname(filePath)
		if (!fs.existsSync(dirname)) {
			fs.mkdirSync(dirname, { recursive: true })
		}
	}
}
