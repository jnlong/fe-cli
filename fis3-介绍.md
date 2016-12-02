#FIS3，大而全的工程化工具
简单的几行配置，即可使用前端工程化的基本功能；

##支持的功能
1. [内置插件](http://fis.baidu.com/fis3/docs/api/config-system-plugin.html)，fis3内置了常用插件，免去了繁琐的插件安装

		fis-optimizer-clean-css	//用于压缩 css
		fis-optimizer-png-compressor	//用来压缩 png 文件，减少文件体积
		fis-optimizer-uglify-js	//用来压缩 js 文件，混淆代码，减少文件体积
		fis-spriter-csssprites	//图片合并 CssSprite
		fis3-deploy-local-deliver//用来支持 fis3 本地部署能力，将 fis3 编译产出到指定目录。
		fis3-deploy-http-push//用来支持 fis3 远程部署能力，将 fis3 编译通过 http post 方式发送到远程服务端。
		fis3-hook-components //支持通过fis3 install xxx 的方式，安装第三方库到本地的component
		fis3-packager-map	//用来支持 fis 简单的打包，无需额外设置，已自动开启。
2. 内容嵌入，使用`?__inline和__inline()`即可将资源文件的内容嵌入，也可以将图片转换成base64后嵌入
2. 图片合并 CssSprite

		// 启用 fis-spriter-csssprites 插件
		fis.match('::package', {
		  spriter: fis.plugin('csssprites')
		});
		// 对 CSS 进行图片合并
		fis.match('*.css', {
		  // 给匹配到的文件分配属性 `useSprite`
		  useSprite: true
		});
		// 调用:使用命令 ?__sprite
		li.list-1::before {
		  background-image: url('./img/list-1.png?__sprite');
		}
3. 文件压缩
		
		fis.match('*.js', {
		  // fis-optimizer-uglify-js 插件进行压缩，已内置
		  optimizer: fis.plugin('uglify-js')
		});
		fis.match('*.css', {
		  // fis-optimizer-clean-css 插件进行压缩，已内置
		  optimizer: fis.plugin('clean-css')
		});
		fis.match('*.png', {
		  // fis-optimizer-png-compressor 插件进行压缩，已内置
		  optimizer: fis.plugin('png-compressor')
		});
4. 添加时间戳，实现文件的强缓存
	
		fis.match('*.{js,css,png}', {
		  useHash: true
		});
5. 灵活的文件合并

		fis.match('/static/folderA/**.js', {
		  packTo: '/static/pkg/folderA.js'
		});
		// 配置合并顺序；packOrder越小越在前面
		fis.match('/static/folderA/file1.js', {
		  packOrder: -100
		});
6. [安装第三方组件](https://github.com/fex-team/fis3-hook-components)

	用来支持 `短路径` 引用安装到本地的 component。
	如： fis3 install bootstrap 后，在页面中可以这么写。
	
		<link xxx href="bootstrap/css/bootstrap-theme.css" />
		<script src="boostrap/button.js"></script>
		
		<!--或者直接用模块化的方式引用 js-->
		<script type="text/javascript">
		  require(['bootstrap', 'bootstrap/button']);
		</script>
	此功能已自动开启。
7. FIS3 内置一个简易 [Web Server](http://fis.baidu.com/fis3/docs/beginning/debug.html)，可以方便调试构建结果

		fis3 open	//打开服务所在文件夹
		fis3 start	//启动服务，默认为 http://127.0.0.1:8080
7. [插件扩展](http://fis.baidu.com/fis3/docs/lv2.html)

		lint：代码校验检查，比较特殊，所以需要 release 命令命令行添加 -l 参数
		parser：预处理阶段，比如 less、sass、es6、react 前端模板等都在此处预编译处理
		preprocessor：标准化前处理插件
		standard：标准化插件，处理内置语法
		postprocessor：标准化后处理插件
8. [模块化](http://fis.baidu.com/fis3/docs/lv3.html)

		var _map = __RESOURCE_MAP__; //js中打印资源映射表

		考虑到不可能一个框架运用多个模块化框架（因为全都占用同样的全局函数，互斥），所以编译支持这块分成三个插件进行支持。
		fis3-hook-commonjs
		fis3-hook-amd
		fis3-hook-cmd
9. 支持[node-glob配置](http://fis.baidu.com/fis3/docs/api/config-glob.html)

		FIS3 中支持的 glob 规则，FIS3 使用 node-glob 提供 glob 支持。
1. 调试
		通过inspect可以查看整个打包过程的日志，如 fis3 inspect debug(第三个参数是用户定义的media)，下面是打印的日志

		 ~ /client/widget/search/search.less
		 -- release /static/home/widget/search/search.css `/client/(**)`   (2th)
		 -- id home:widget/search/search.less `/client/(**)`   (2th)
		 -- moduleId home:widget/search/search.less `/client/(**)`   (2th)
		 -- parser [plugin `less`] `/client/**.less`   (3th)
		 -- rExt .css `/client/**.less`   (3th)
		 -- isMod true `/client/{components,widget}/**.{js,es,ts,tsx,jsx,css,less}` (10th)                       
		 -- useHash false `*`   (27th)
		 -- optimizer null `*`   (27th)
		 -- packTo widget.css `/client/widget/**.{css,less}`   (26th)
		 -- deploy [plugin `http-push`] `*`   (27th)

## 三种语言能力
**内容嵌入**：将文件的内容嵌入；**定位资源**：获取资源的实际路径；**声明依赖**：

1. html
		
		内容嵌入
		<img title="百度logo" src="images/logo.gif?__inline"/>	//html中嵌入图片base64
		<link rel="stylesheet" type="text/css" href="demo.css?__inline">	//html中嵌入css
		<script type="text/javascript" src="demo.js?__inline"></script>	//html中嵌入脚本资源
		<link rel="import" href="demo.html?__inline">	//html中嵌入页面文件
		定位资源
		<img title="百度logo" src="images/logo.gif"/>
		<link rel="stylesheet" type="text/css" href="demo.css">
		<script type="text/javascript" src="demo.js"></script>

1. js

		内容嵌入
		__inline('demo.js');	//在js中嵌入js文件
		var img = __inline('images/logo.gif');	//在js中嵌入图片base64
		var css = __inline('a.css');	//在js中嵌入css
		定位资源
		var img = __uri('images/logo.gif');
		var css = __uri('demo.css');
		var js = __uri('demo.js');
1. css

		内容嵌入
		@import url('demo.css?__inline');	//內联嵌入css
		.style {background: url(images/logo.gif?__inline);}	//在css中嵌入图片的base64
		定位资源	
		 @import url('demo.css');
1. 声明依赖

		在html、css、js中支持通过注释注明依赖
		/**
		 * @require demo.css
		 * @require list.js
		 */
## 多种web解决方案
1. 针对smarty的方案 [fis-smarty](https://github.com/fex-team/fis3-smarty)
2. 针对nodejs的方案 [yog2](http://fex.baidu.com/yog2/docs/)

## 总结
fis提供了简单的配置、强大的扩展功能，支持结合后端更好的实现组件化、模块化；
而且fis提供了特别详细的文档和demo

1. [官方文档](http://fis.baidu.com/fis3/docs/beginning/intro.html)
2. [全部插件](http://fis.baidu.com/fis3/plugins.html)
3. [插件开发](http://fis.baidu.com/fis3/api/index.html)
4. [github](https://github.com/fex-team/fis3)
5. [demo汇总](https://github.com/fex-team/fis3-demo)
6. [常用属性和配置汇总](https://github.com/fex-team/fis3/blob/master/doc/docs/api/config-props.md#%E6%96%87%E4%BB%B6%E5%B1%9E%E6%80%A7)
7. [常用插件](https://github.com/fex-team/fis3/blob/master/doc/docs/common-plugin.md)
8. []()