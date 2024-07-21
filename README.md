#  Vscode 国际化中文提取插件

## 开发

遵循 vscode 开发规范，请尽可能的保证代码解耦

-   npm run test 纯 node 环境测试核心文件逻辑
-   F5 vscode 测试
-   npm run test-plugin vscode 单元测试

## 发布

请先安装 npm install -g @vscode/vsce

## 使用

发布之后运行 npm run build

会生成 vscode-plugin-parrot-{版本文件}.vsix，请自行安装到本地 vscode

## 功能

### 自定义配置表

在项目根目录下面新增配置文件：extracting-config.json，配置文件可有可无

```typescript
export type Config = {
	// 这是文件输出的目录地址
	outDir: string
	// i18n的语言文件目录
	// 项目的i18n语言路径,路径编写需要前斜杠，如：/src/i18n/zh
	i18nLang: string
	// 统一输出的文件名称，固定为json文件
	outFileName: string
}
```

### 默认配置

以下为项目默认值

```typescript
// json
	outDir: 'src/locales/lang',
	i18nLang: 'zh-CN',
	outFileName: 'viewskey.json',
```


### 提取中文


将会把 vue,js,ts 文件提取中文代码改为t()方式  
生成 outDir/i18nLang/outFileName 文件，翻译提取内容在该文件中
