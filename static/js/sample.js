// 前端抽样
$.sample = function(opt) {
	var optDef = {type: 'baiduid', count: 2};
	var res = false;
	var base = '';
	opt = opt || {};
	for (var i in optDef){
		opt[i] = opt[i] || optDef[i];
	}
	if (!opt.count || isNaN(opt.count)) {
		return;
	}
	if (opt.type == 'baiduid') {
		var reg = /BAIDUID=([^;]*)(;|$)/gi;
		var bdArr = reg.exec(document.cookie);
		if (bdArr && bdArr.length > 1) {
			base = parseInt(bdArr[1].substr(28,4), 16);
		}
	}
	else if (opt.type == 'time') {
		base = (new Date()).getTime();
	}
	if (base && !isNaN(base)) {
		if (base % opt.count == 0) {
			res = true;
		}
	}
	return res;
}