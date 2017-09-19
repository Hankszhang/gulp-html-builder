// 文档链接： http://dcloud.oa.com/waltz/alloyteam.html#5450
// ps:该文件存放在项目根目录下即可，JB负责读取配置文件
module.exports = {
    name: '企点官网',
    // ARS发布相关配置
    ars: {
        // 以支持自定义拆单发布
        // 外层数组元素表示 ars单
        // 内层数组元素表示 发布文件所在文件夹 【必须为 构建输出约定的子目录】
        splitReceipt: [
            ['webserver', 'cdn', 'node']
        ],
        // 提交ars发布是否需要填写版本号，如果需要会有输入框输入 发布版本
        customInfo: false
        // 外网地址映射（支持多个正则替换），如需开启请自行去除注释
        // addressMapping: {
        //     '^/data/sites/imgcache/htdocs/(.*)': 'https://$1'
        // }
    },
    // 在测试部署后在远端执行后置脚本
    // 运行目录为JB上模块所指定的node路径
    // 暂不支持预编译机器执行后置脚本
    // afterScript: {
        // 脚本在机器上的路径
        // $script: '/data/web_deployment/shell/ars/static/mv.sh',
        // 后置脚本参数，可以不填
        // $args: ['bosscrm']
    // },
    // 请求重定向(限用于无线测试环境) 类似fiddler的willow插件的extentions，如需开启请自行去除注释
    // extentions: [
    //     {'match': 'http://qun.qq.com/qunpay/','action': 'wired.alloyproxy.com:8003'},
    //     {'match': 'http://qun.qq.com/qunpay/','action': 'wired.alloyproxy.com:8003'}
    // ],
    // 编译发布相关配置
    distConfig: {
        // 设置环境变量
        environmentVariables: {
            // 测试部署使用，NODE_ENV=development
            development: 'development',
            // 发布部署使用，NODE_ENV=production
            production: 'production'
        },
        // 支持自定义构建命令，如需开启请自行去除注释
        // 开启之后如果需要设置环境变量的话，请自行添加 `NODE_ENV=**`
        // 如果需要调用grunt/gulp之类构建命令，查看
        // http://dcloud.oa.com/waltz/alloyteam.html#7846
        buildCommand: {
            development: {
                command: '~/.nvm/versions/node/v6.2.0/bin/node',
                args: ['--harmony', '/data/frontend/install/AlloyDist/node_modules/gulp/bin/gulp.js', 'dev']
            },
            production: {
                command: '~/.nvm/versions/node/v6.2.0/bin/node',
                args: ['--harmony', '/data/frontend/install/AlloyDist/node_modules/gulp/bin/gulp.js', 'test']
            }
        }
        // 如果需要区分环境使用不同的部署命令，请使用以下写法
        // buildCommand: {
        //    'development': {
        //        // `NODE_ENV=development  node /data/frontend/install/AlloyDist/runtime-edu/node_modules/lego/bin/lego-config set registry http://lego.oa.com & cd src & node /data/frontend/install/AlloyDist/runtime-edu/node_modules/lego/bin/lego-install & cd .. & fis3 release dist -c`
        //        command: 'npm',
        //        args: ['run', 'development']
        //    },
        //    'production': {
        //        command: 'npm',
        //        args: ['run', 'production']
        //    }
        // }
    }
};
