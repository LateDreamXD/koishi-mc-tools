import {getLocation} from "ip-based-location";
import {resolve} from "dns";
const req = async u => await (await fetch(u)).json()

function buildReply(obj) {
    if(obj.online) {
        var reply = []
        reply.push(obj.motd.clean.join("\n"))
        reply.push("在线人数: " + obj.players.online + "/" + obj.players.max)
        reply.push("支持版本：" + obj.version)
        reply.push("协议信息：" + obj.protocol.version + "(" + obj.protocol.name + ")")
        if(obj.icon) reply.push("![服务器图标](" + obj.icon + ")")
        return reply.join("\n")
    } else {
        return '该服务器不在线/遇到未知问题xwx\n稍后再试一试吧'
    }
}

async function replyIP(host) {
    ip = await lookupIP(host)
    location = await getLocation(ip)
    var reply = []
    reply.push("IP地址：" + ip)
    reply.push("地理位置（Powered by ipify）：" + [
        location.country.replace("Taiwan", "China"), 
        location.region,
        location.city
    ].join(" > "))
    if(location.country == "China") {
        reply.push("国内服务器建议裸连啦 ~")
    }
    // 够用了，懒得写经纬度了（
    return reply.join("\n")
}

function lookupIP(ip) {
    return new Promise(res => {
        resolve(ip, (fk, ip) => res(ip[0]))
    })
}

export default (cmd) => {
    cmd.subcommand(".status <地址> [模式=bedrock|java|icon|region] 获取服务器状态信息（默认Java）").action(async (argv, host, mode) => {
        // 对哦，我似乎可以开子命令，算了，反正都这麽写了
        switch(host) {
            case "help":
                return [
                    "mc status <地址> [模式=bedrock|java|icon|region] 一个用于检查mc服务器的小工具",
                    "For Example 举个栗子：",
                    "\tmc status hypixel.net # 获取服务器信息",
                    "\tmc status hypixel.net bedrock # 获取基岩版服务器信息",
                    "\tmc status hypixel.net icon # 获取服务器图标（Java Merely）",
                    "\tmc status hypixel.net region # 获取服务器所在地区，用于选择加速节点"/*,
                    "Others 其他：",
                    "自己去翻源码，我懒得写了（"*/
                ].join('\n')
                break;
            case "author":
                return "This function is powered by LoveKogasa"
                break;
            default:
                if(!(/\w+\.\w+/).test(host)) return "格式不对，打回重输awa"
        }
        var rp = void 0
        switch(mode) {
            case "author":
                rp = "该子功能由lovekogasa实现"
                break;
            case "region":
                rp = await replyIP(host)
                break;
            case "icon":
                rp = "你可以通过 https://api.mcsrvstat.us/icon/" + encodeURIComponent(host) + " 获取服务器图标"
                break;
            case "bedrock":
                rp = buildReply(await req("https://api.mcsrvstat.us/bedrock/3/" + encodeURIComponent(host)))
                break;
            default:
                rp = buildReply(await req("https://api.mcsrvstat.us/3/" + encodeURIComponent(host)))
        }
        return rp
    })
}