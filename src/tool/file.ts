import * as vscode from 'vscode'
import { access } from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'

// 获取vscode项目路径
export function getVsCodeProjectPath(): string {
	const workName = vscode.workspace.name
	const workspaceFolders = vscode.workspace.workspaceFolders ?? []
	return workspaceFolders.find((li) => li.name === workName)?.uri.fsPath as string
}

export async function isAccess(url: string, mode?: number) {
	try {
		if (mode) {
			await access(url, mode)
		} else {
			await access(url)
		}
		return true
	} catch (e) {
		return false
	}
}

/**
 * 遍历目录下的所有文件
 * @param {string} dirPath 目标目录路径
 * @returns {string[]} 返回所有文件路径
 */
export function traverseDirectory(dirPath: string) {
	let filePaths: string[] = []

	// 判断路径是否存在
	if (fs.existsSync(dirPath)) {
		// 判断路径是否为目录
		if (fs.lstatSync(dirPath).isDirectory()) {
			// 读取目录中的文件和子目录
			const files = fs.readdirSync(dirPath)

			files.forEach((file) => {
				const filePath = path.join(dirPath, file)
				const stat = fs.lstatSync(filePath)

				if (stat.isDirectory()) {
					// 如果是子目录，递归遍历，并合并结果
					filePaths = filePaths.concat(traverseDirectory(filePath))
				} else {
					// 如果是文件，添加文件路径到数组
					filePaths.push(filePath)
				}
			})
		} else {
			console.log(`${dirPath} 不是一个目录`)
		}
	} else {
		console.log(`${dirPath} 路径不存在`)
	}

	return filePaths
}
