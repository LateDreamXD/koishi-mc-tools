import htmlParser from 'node-html-parser';

// type VersionCmdOptions = {
// 	datasource?: 'mcwiki' | 'mojang'
// }

// type VersionCmdInput = {
// 	options: VersionCmdOptions
// }

const cleanMcWikiTitle = (str: string) => str.replace(/^(java|bedrock) edition /i, '');
const getMcWikiVer = (target: htmlParser.HTMLElement) => cleanMcWikiTitle(target.rawAttributes.title);

const getFromMcWiki = async () => {
	try {
		const resp = await (await fetch('https://minecraft.wiki/api.php?action=parse&format=json&formatversion=2&prop=text&contentmodel=wikitext&disablelimitreport=1&requestid=gadget-lazyloadSidebarVersions&page=MediaWiki%3ASidebar-versions')).json();
		const htmlRoot = htmlParser.parse(resp.parse?.text);
		const versionsList = htmlRoot.querySelectorAll('.vector-menu-content-list a');
		// [0] = Java Edition ==
		// [1] latest
		// [2] snapshot
		// [3] upcoming
		// [4] = Bedrock Edition ==
		// [5] latest
		// [6] preview
		// [7] upcoming

		return {
			java: {
				latest: getMcWikiVer(versionsList[1]),
				snapshot: getMcWikiVer(versionsList[2]),
				upcoming: getMcWikiVer(versionsList[3])
			},
			bedrock: {
				latest: getMcWikiVer(versionsList[5]),
				preview: getMcWikiVer(versionsList[6]),
				upcoming: getMcWikiVer(versionsList[7])
			},
			error: null
		};
	} catch(error) {
		return {
			java: null,
			bedrock: null,
			error
		}
	}
}

export default (mainCmd: import('koishi').Command) => {
	mainCmd.subcommand('.version 查询Minecraft最新版本').alias('.ver').action(async () => {
		const result = await getFromMcWiki();
		if(result.error) return '查询 Minecraft 版本失败';

		return `Java 版
  📅 即将更新：${result.java?.upcoming}
  📦 正式版：${result.java?.latest}
  🧪 快照版：${result.java?.snapshot}

基岩版
  📅 即将更新：${result.bedrock?.upcoming}
  📦 正式版：${result.bedrock?.latest}
  👀 预览版：${result.bedrock?.preview}

数据来源：Minecraft Wiki`;

	})
}