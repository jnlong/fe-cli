"use strict";
(function(){
    (function init(){
        $.offsetFun(setOffset);
        $('a[href=""]').attr('href', 'javascript:void(0)');
        addEvent();
    })();
    function setOffset(){
        var offset = $('#offset');
        offset.find('.width').text($.offset.width);
        offset.find('.height').text($.offset.height);
    }
    function addEvent(){
    }
})();