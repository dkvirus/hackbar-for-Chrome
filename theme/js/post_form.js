var fields = JSON.parse(decodeURIComponent(post_data));
var form = document.createElement("form");
form.setAttribute("method", "post");
form.setAttribute("action", decodeURIComponent(url));
var submitBtn = null		// 标识是否存在 submit 字段
fields.forEach(function(f){
	var input = document.createElement("input");

	/**
	 * fixed bug at 2020年8月10日09:38:11
	 * post 传参无法传字段名为 "submit" 字段
	 * 修复方法：将 submit 字段作为按钮添加，并通过点击该按钮提交表单
	 */
	if (f['name'] === 'submit') {
		input.setAttribute("type", "submit");
		input.setAttribute("name", f['name']);
		input.setAttribute("value", f['value']);
		input.style.display = 'none'
		submitBtn = input
	} else {
		input.setAttribute("type", "hidden");
		input.setAttribute("name", f['name']);
		input.setAttribute("value", f['value']);
	}
	// alert(f.name);
	form.appendChild(input);
})
document.body.appendChild(form);

if (submitBtn) {
	submitBtn.click()
} else {
	form.submit();
}
