(function (window, document) {
	var Head = {};
    Head.gethead = function() {
        console.log('head-comm256222');
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Head;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return Head;
        });
    } else {
        window.Head = Head;
    }
})(window, document);
