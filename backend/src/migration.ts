import 'dotenv/config';
import { generateMigration, revertLastMigration, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

const args = process.argv.slice(2);
const command = args[0];
const name = args[1];

async function run() {
    console.log(`正在执行迁移命令: ${command}`);
    
    if (command === 'generate') {
        if (!name) {
            console.error('错误: 请提供迁移文件的名称 (例如: fix_custom_fields)');
            process.exit(1);
        }
        // 生成迁移文件
        await generateMigration(config, { name });
    } else if (command === 'run') {
        // 执行迁移
        await runMigrations(config);
    } else if (command === 'revert') {
        // 回滚最近一次迁移 (注意函数名变更)
        await revertLastMigration(config);
    } else {
        console.error(`未知命令: ${command}`);
        process.exit(1);
    }
}

run()
    .then(() => {
        console.log('✅ 操作成功');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ 操作失败:', err);
        process.exit(1);
    });