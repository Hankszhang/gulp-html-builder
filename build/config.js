var config = {
    host: 'localhost',
    port: 8965,
    env: 'local',
    viewPath: 'src/views',
    lessPath: 'src/less',
    jsPath: 'src/js',
    imgPath: 'src/img',
    targetPath: {
        local: './dist/development',
        development: './dist/development',
        test: './dist/test',
        production: './dist/production'
    },
    browserList: ['ie > 8', 'last 2 versions']
};

module.exports = config;
