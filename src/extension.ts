import * as vscode from 'vscode'
import { CommandsEnum, MessageType } from './tool/enums'
import { testRootPath } from './tool/testing'
import { getSetConfigFile, getConfig } from './config'
import { message } from './tool/message'
import { isString } from 'lodash'
import { analysis } from './analysis'
import { log } from './tool/log'

export function activate(context: vscode.ExtensionContext) {
	const extracting = vscode.commands.registerCommand(CommandsEnum.ExtractChinese, async (uri) => {
		try {
			log.appendLine(`开始吧`)
			testRootPath()
			const path = uri.fsPath
			if (!path) {
				message({ msg: '没有文件路径,无法进行提取', type: MessageType.error })
				return false
			}

			getSetConfigFile()
			let config = getConfig()
			console.log('config', config)
			// 进行文件处理
			await analysis(path)
		} catch (error) {
			if (isString(error)) {
				message({ msg: error, type: MessageType.error })
			} else {
				console.error(error)
				message({ msg: '处理异常', type: MessageType.error })
			}
			log.appendLine(`异常`)
		}
	})

	const test = vscode.commands.registerCommand('haokejie-extracting-chinese.helloWorld', () => {
		console.log('helloWorld')
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from haokejie-extracting-chinese!')
	})

	context.subscriptions.push(extracting, test)
}

// This method is called when your extension is deactivated
export function deactivate() {}
