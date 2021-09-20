export default {
	get: function (name: string) {
		let arr;
		const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
		if ((arr = document.cookie.match(reg))) return decodeURIComponent(arr[2]);
		else return null;
	},
	set: function (name: string, value: any, time: number) {
		const exp = new Date();
		exp.setTime(exp.getTime() + time * 1000);
		document.cookie = name + '=' + encodeURI(value) + ';expires=' + exp.toUTCString() + ';path=/';
	},
	remove: function (name: string) {
		const exp = new Date();
		exp.setTime(exp.getTime() - 1);
		if (this.get(name) != null) document.cookie = name + '=' + this.get(name) + ';expires=' + exp.toUTCString();
	},
};
