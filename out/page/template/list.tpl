<script type="text/tpl" id="listTpl">
	<#list.forEach(function(a){#>
	<a href="<#=a.url#>">
	    <img src="<#=window.wiseHao123.httpsTrans(a.icon)#>" width="54" height="54" />
	    <h3><#=a.title#></h3>
	    <p>下载</p>
	</a>
	<#});#>
</script>