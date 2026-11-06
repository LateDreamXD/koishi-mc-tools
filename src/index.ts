import { Context, Schema } from 'koishi';
import versionCmd from './cmd/version';
import statusCmd from './cmd/status.js';

export const name = 'mc-tools';

export interface Config { }

export const Config: Schema<Config> = Schema.object({});

export function apply(ctx: Context, config: Config) {
	const mainCmd = ctx.command('mc 晚梦的Minecraft工具');
	versionCmd(mainCmd);
	statusCmd(mainCmd);
}
