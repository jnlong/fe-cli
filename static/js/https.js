//https统一处理：嗅探、切换
(function(){
    function setHTTPS(success) {
        $.getJSON('/hao123_api/d', function (data) {
            if (data.net) {
                var createIframe = function() {
                    var iframeHtml = '<iframe id="xthttps" style="display:none;" />';
                    $(iframeHtml).appendTo(document.body);
                    return $('#xthttps');
                };
                var $xtIframe = createIframe();
                $xtIframe.on('load',function(){
                    success();
                });
                $xtIframe.attr('src','https://m.baidu.com/static/clientcon.html');
            }
        });
    }
    function successCB() {
        // j.php处理，写cookie，交给后端处理
        var time = new Date();
        var days = 7;
        time.setTime(time.getTime() + days * 86400000);
        document.cookie = 'm_https=available' + ';expires=' + time.toGMTString() + ';path=/;';
        // a链接处理
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            var url = links[i].href;
            var wise = url.match(/^http:\/\/m.baidu.com/g);
            if (wise && wise.length > 0) {
                links[i].href = url.replace('http','https');
            }
        }
        // form处理
        var forms = document.getElementsByTagName('form');
        for (var i = 0; i < forms.length; i++) {
            var action = forms[i].action;
            var mbaidu = action.match(/http:\/\/m.baidu.com/g);
            if (mbaidu && mbaidu.length > 0) {
                forms[i].action = forms[i].action.replace('http://m.baidu.com', 'https://m.baidu.com');
            }
        }
    }
    setHTTPS(successCB);
})();
