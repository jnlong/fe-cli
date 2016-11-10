// less
fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css'
});

// es6
fis.set('project.fileType.text', 'es,es6');
fis.match('*.es6', {
    parser: fis.plugin('babel-5.x', {
        blacklist: [
            'regenerator'
        ],
        stage: 3
    }),
    rExt: 'js',
    useHash: true,
    optimizer: fis.plugin('uglify-js')
});

// 代码校验
var eslintConf = {
    ignoreFiles: ['static/common/**.js', 'js-conf.js'],
    envs: ['browser', 'node'],
    globals: ['$', 'Zepto', 'jQuery', 'iScroll', 'IScroll', 'Swiper', 'DocumentTouch', 'WebKitCSSMatrix', 'define', 'CG', 'CONFIG'],
    rules: {
        'semi': [0],
        'no-undef': [1],
        'no-use-before-define': [0],
        'no-unused-vars': [0],
        'no-eval': [0],
        'use-isnan': [2],
        'valid-typeof': [2],
        'no-unreachable': [1],
        'no-dupe-args': [1],
        'no-dupe-keys': [1]
    }
};
fis.match('**.js', {
    lint: fis.plugin('eslint', eslintConf)
});

// 压缩
fis.match('*.{jpg,gif}', {
    optimizer: fis.plugin('png-compressor')
});
fis.match('*.{png}', {
    optimizer: fis.plugin('png-compressor', {
        type: 'pngquant'
    })
});

fis.match('*.{css,less}', {
  optimizer: fis.plugin('clean-css')
});
fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});
fis.match('*.{js,less,css,png,jpg,gif}', {
  useHash: true
});

// 图片合并
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});
fis.match('*.{less,css}', {
  useSprite: true
});

// 资源合并
fis.match('::package', {
  postpackager: fis.plugin('loader')
});
fis.match('{/static/css/base/**.less,/static/font/**.css}', {
  packTo: '/static/base.css'
});

fis.match('/static/js/base/**.{js,es6}', {
  packTo: '/static/base.js'
});

// 模块化
fis.hook('commonjs');
fis.match('widget/**.js', {
    isMod: true
});

// 不使用hash的文件
fis.match('/static/My97DatePicker/**/*.*', {
  useHash: false
});

// 不需要发布的文件
fis.match('{out/**,mock/**}', {
    release: false
});

// 发布到生产环境的配置，执行命令 fis3 release pro
fis.media('pro').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://生产服务器ip地址/receiver.php',
        to: '/home/user/wise/web/'
    })
});

// 发布到测试环境的配置，执行命令 fis3 release user -wL
fis.media('user').match('*', {
    useHash: false,
    useSprite: false,
    optimizer: null,
});
