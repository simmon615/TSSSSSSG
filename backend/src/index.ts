import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config)
    .then(() => {
        console.log(`\n=================================================`);
        console.log(`🚀  Server started successfully!`);
        console.log(`🛒  Shop API: http://localhost:${config.apiOptions.port}/${config.apiOptions.shopApiPath}`);
        console.log(`🔧  Admin API: http://localhost:${config.apiOptions.port}/${config.apiOptions.adminApiPath}`);
        console.log(`=================================================\n`);
    })
    .catch(err => {
        console.log('-------------------------------------------------');
        console.log('🚨  Server failed to start');
        console.log(err);
        console.log('-------------------------------------------------');
        // 遇到错误退出进程
        process.exit(1);
    });