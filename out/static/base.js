;/*!static/js/base/common.js*/
"use strict";
// 获取视口宽度、高度。
// 调用方法：引入文件后，调用$.offsetFun
// 输入参数：callback 视口尺寸变化的回调
// 返回参数：$.offset.width 视口宽度，$.offset.height高度
$.offsetFun = function(callback) {
    var screenChange = 'onorientationchange' in window ? 'orientationchange' : 'resize';

    function offset() {
        $.offset = {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
        if (callback) {
            callback();
        }
    };
    $(window).off(screenChange, offset);
    $(window).on(screenChange, offset);
    offset();
};
// 前端抽样
// 输入参数： opt{
//     type: 'baiduid' //抽样类型：time 时间戳抽样，baiduid 按照cookie中baiduid抽样
//     count: 2        //抽样几率： 如3 则返回true的几率是 1/3
// }
// 输出参数: true 抽中，false 未抽中
$.sample = function(opt) {
    var optDef = { type: 'baiduid', count: 2 };
    var res = false;
    var base = '';
    opt = opt || {};
    for (var i in optDef) {
        opt[i] = opt[i] || optDef[i];
    }
    if (!opt.count || isNaN(opt.count)) {
        return;
    }
    if (opt.type == 'baiduid') {
        var reg = /BAIDUID=([^;]*)(;|$)/gi;
        var bdArr = reg.exec(document.cookie);
        if (bdArr && bdArr.length > 1) {
            base = parseInt(bdArr[1].substr(28, 4), 16);
        }
    } else if (opt.type == 'time') {
        base = (new Date()).getTime();
    }
    if (base && !isNaN(base)) {
        if (base % opt.count == 0) {
            res = true;
        }
    }
    return res;
}
// cookie操作
$.cookie = {
    get: function(name) {
        var cookieArr = document.cookie.split('; ');
        for (var i = 0, len = cookieArr.length; i < len; i++) {
            var arr = cookieArr[i].split('=');
            if (arr[0] === name) {
                return decodeURIComponent(arr[1]);
            }
        }
        return '';
    },
    set: function(name, value, days) {
        var time = new Date();
        var days = days || 1;
        time.setTime(time.getTime() + days * 86400000);
        document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + time.toGMTString() + ';path=/;';
    },
    del: function(name) {
        document.cookie = name + '=;expires=' + (new Date(0)).toGMTString();
    }
};
// url参数解析
$.parseUrl = {
    get: function(url, name) {
        var result = '';
        var reg = new RegExp('(^|&|/?)' + name + '=([^&]*)(&|$)');
        var r = url.match(reg);
        if (r != null) {
            result = r[2];
        }
        return result;
    },
    del: function(url, name) {
        var result = '';
        var reg = new RegExp('(/?|&)' + name + '=([^&]*)(&|$)');
        !!reg && (url = url.replace(reg, ''));
        return url;
    }
};
// 判断localStorage支持性
$.haoIsJudge = (function() {
    if (!'localStorage' in window) return false;
    try {
        var ls = localStorage,
            num = new Date().getTime();
        ls.setItem(num, "1");
        if (ls.getItem(num) === "1") {
            ls.removeItem(num);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
})();
// 从一个数组中，随机获取N个元素
$.randomArr = function(arr, num) {
    var temp_array = [],
        return_array = [];
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    for (var i = 0; i < num; i++) {
        if (temp_array.length > 0) {
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            return_array[i] = temp_array[arrIndex];
            temp_array.splice(arrIndex, 1);
        } else {
            break;
        }
    }
    return return_array;
};
//控制classname的添加
//规则：当天没有被点击时，添加类clsName;点击后删除类clsName
$.addClassFromLs = function(opt) {
    var res = false;
    opt = opt || {};
    if (!$.haoIsJudge && !opt.tagid || !opt.clsName || $('#' + opt.tagid).size() === 0) {
        return res;
    }
    var isAddEvent = opt.isAddEvent || true;
    var tagClick = $('#' + (opt.tagClick || opt.tagid));
    var lsName = 'm_index_' + opt.tagid;
    var tag = $('#' + opt.tagid);
    var lsValue = localStorage.getItem(lsName);

    function newDate() {
        return (new Date()).toString().substr(0, 15);
    }
    lsValue == newDate() ? res = false : res = true;
    if (res) {
        tag.addClass(opt.clsName);
    }
    isAddEvent && tagClick.on('click', function(e) {
        tag.removeClass(opt.clsName);
        localStorage.setItem(lsName, newDate());
        $(this).off(e.type, arguments.callee);
    });
    return res;
};
// 图片懒加载, 元素滚动到当前可视范围时，再将src=data-lazy
// 支持元素：img、iframe
$.lazyLoad = function() {
    var me = this;
    me.threshold = 20;
    me.init();
}
$.lazyLoad.prototype = {
    init: function() {
        var me = this;
        me.setImages();
        me.height = window.innerHeight || document.documentElement.clientHeight;
        me.addEvent();
    },
    setImages: function() {
        var me = this;
        var images = $('img[data-lazy],iframe[data-lazy]');
        me.images = Array.prototype.slice.apply(images);
        me.processLoad();
    },
    getImages: function() {
        var me = this;
    },
    loadImage: function(img) {
        var src = img.getAttribute('data-lazy');
        img.src = src;
        img.removeAttribute('data-lazy');
    },
    isElementInViewport: function(el) {
        var me = this;
        var rect = el.getBoundingClientRect(),
            viewportHeight = me.height;
        if (rect.top >= 0) {
            if (rect.top <= viewportHeight) {
                return true;
            }
        } else {
            if (rect.bottom >= 0) {
                return true;
            }
        }
        return false;
    },
    processLoad: function() {
        var me = this;
        for (var i = 0; i < me.images.length;) {
            if (me.isElementInViewport(me.images[i])) {
                me.loadImage(me.images[i]);
                me.images.splice(i, 1);
            } else {
                i++;
            }
        }
    },
    addEvent: function() {
        var me = this;
        $(window).on("orientationchange resize", function() {
            setTimeout(function() {
                me.height = window.innerHeight || document.documentElement.clientHeight;
            }, 300);
        });
        $(['scroll', 'resize']).each(function(index, eventName) {
            $(window).on(eventName, handle);
        });

        function handle(e) {
            clearTimeout(me.timer);
            me.timer = setTimeout(function() {
                me.processLoad();
            }, me.threshold);
        }
    }
};
// 通过geolocation获取用户地理位置经纬度，然后通过百度地图api获取城市等信息
// 百度地图api测试和返回结果的结构：http://api.map.baidu.com/geocoder/v2/?ak=CF1501b87c62bf946e2e9004b889ea89&output=json&location=39.959836,116.31985
// 返回参数:
/*{
    status: 0 成功， - 1 失败
    error: geolocation返回的error
    result: {
        location: {
            lng: 116.31984997149,
            lat: 39.959836045067
        },
        // 墨卡托
        mercator {
            x
            y
        },
        formatted_address: "北京市海淀区南大街27号-10号楼",
        business: "万寿寺,魏公村,紫竹桥",
        addressComponent: {
            adcode: "110108",
            city: "北京市",
            country: "中国",
            direction: "附近",
            distance: "0",
            district: "海淀区",
            province: "北京市",
            street: "南大街",
            street_number: "27号-10号楼",
            country_code: 0
        },
        poiRegions: [],
        sematic_description: "北京外国语大学东南320米",
        cityCode: 131
    }
}
*/
$.getLocation = function(callback) {
    var url = 'http://api.map.baidu.com/geocoder/v2/?ak=CF1501b87c62bf946e2e9004b889ea89&callback=renderReverse&output=json';
    var geoData = {status: -1, error: {}, result: {}};
    geoPosition();

    function geoPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude,
                    lon = position.coords.longitude;
                geoData.result.mercator = lonlat2mercator({ x: lon, y: lat });
                createScript(lat, lon);
            }, function(error) {
                geoData.error = error;
                callback(geoData);
            }, {
                timeout: 5000
            });
        }
    }
    // 经纬度转换为墨卡托
    function lonlat2mercator(lonlat) {
        var mercator = { x: 0, y: 0 };
        var x = lonlat.x * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lonlat.y) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        mercator.x = x;
        mercator.y = y;
        return mercator;
    }

    function createScript(lat, lon) {
        var s = document.createElement('script'),
            h = document.getElementsByTagName('head')[0],
            id = 'locationJsonp',
            requestURL = url + '&location=' + lat + ',' + lon;
        $.tj('getGpsSucc');
        // $.cookie.set(locName, lat + ',' + lon, locDay);
        if (id) {
            (createScript[id]) && h.removeChild(createScript[id]);
            createScript[id] = s;
        }
        s.type = 'text/javascript';
        s.src = requestURL;
        h.appendChild(s);
    }
    window.renderReverse = function(data) {
        var res = data.result;
        geoData.status = 0;
        geoData.result = data.result;
        callback(geoData);
    };
};
// jquery 模板
// 使用方法 $.jqueryTpl(tagid, strTpl), 返回html内容
$.jqueryTpl = (function() {
    var cache = {},
        tmpl = function tmpl(str, data) {
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" + str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<#").join("\t")
                    .replace(/((^|#>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)#>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("#>").join("p.push('")
                    .split("\r").join("\\'") + "');}return p.join('');");
            return data ? fn(data) : fn;
        };
    return tmpl;
})();