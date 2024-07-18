import * as vscode from 'vscode'
import { access } from 'fs/promises'

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
