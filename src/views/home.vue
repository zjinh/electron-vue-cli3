<template>
	<div id="wrapper">
		<main>
			<div class="left-side">
				<span class="title">
					vue+electron
				</span>
				<system-information />
				<div class="doc">
					<br>
					<br>
					<p>ipcRenderer已经挂载在vue上，使用this.$ipc</p>
					<p>electron，使用this.$electron</p>
					<p>this.$notify可实现系统消息弹窗</p>
					<p>挂载代码在tools/index.js内</p>
					<p>自动更新核心代码在background.js 9-42行</p>
				</div>
			</div>
			<div class="right-side">
				<div class="doc">
					<div class="title">简介</div>
					<p>
						项目集成了vue cli3、electron。
						<br />electron-updater <br />electron-builder <br />项目已使用单例运行模式，具体代码在background.js
						109行-119行处
					</p>

				</div>
				<div class="doc">
					<div class="title alt">相关文档</div>
					<button class="alt" @click="open('https://electronjs.org/')">
						Electron
					</button>
					<button class="alt" @click="open('https://cn.vuejs.org/v2/guide/')">
						Vue.js
					</button>
					<p>{{ message }}</p>
					<button @click="checkUpdate" :disabled="percent > 0 && percent !== 100">
						<span v-if="!loading">{{ CheckText }}</span>
						<span v-else>{{ ProcessText }}</span>
					</button>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
import SystemInformation from '@/components/home/SystemInformation';
export default {
	name: 'landing-page',
	components: { SystemInformation },
	data() {
		return {
			CheckText: '检查更新',
			ProcessText: '正在检查',
			percent: 0,
			message: '',
			loading: false
		};
	},
	created() {
		this.bind();
	},
	methods: {
		open(link) {
			this.$electron.shell.openExternal(link);
		},
		bind() {
			this.$ipc.on('check-for-update', (event, message) => {
				this.message = message;
				if (message === '检查更新出错, 请联系开发人员' || message === '现在使用的就是最新版本，不用更新') {
					this.loading = false;
				}
				if (message === '最新版本已下载，点击安装进行更新') {
					this.CheckText = '安装';
					this.loading = false;
					this.percent = 100;
					this.checkUpdate = () => {
						this.$ipc.send('system', 'update');
					};
				}
			});
			this.$ipc.on('update-down-success', (event, message) => {
				alert('New ' + message.version);
			});
			this.$ipc.on('download-progress', (event, message) => {
				this.$nextTick(() => {
					this.percent = parseInt(message.percent);
					if (this.percent === 100) {
						this.CheckText = '安装';
						this.loading = false;
						this.checkUpdate = () => {
							this.$ipc.send('system', 'update');
						};
					}
				});
			});
			window.onbeforeunload = () => {
				if (this.percent > 0 && this.percent !== 100) {
					return false;
				}
			};
		},
		checkUpdate() {
			this.$ipc.send('system', 'check-for-update', 'https://github.com/zjinh/electron-vue-cli3');
		}
	},
	mounted() {
		setTimeout(() => {
			this.$notify('欢迎使用');
		}, 100);
	}
};
</script>

<style>
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	font-family: '微软雅黑';
}

#wrapper {
	background: #fff;
	height: 100vh;
	padding: 30px 40px;
	width: 100vw;
}

main {
	display: flex;
	justify-content: space-between;
}

main > div {
	flex-basis: 50%;
}

.left-side {
	display: flex;
	flex-direction: column;
}

.title {
	color: #2c3e50;
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 6px;
}

.title.alt {
	font-size: 18px;
	margin-bottom: 10px;
}

.doc p {
	color: black;
	margin-bottom: 10px;
}

.doc button {
	font-size: 0.8em;
	cursor: pointer;
	outline: none;
	padding: 0.75em 2em;
	border-radius: 2em;
	display: inline-block;
	color: #fff;
	background-color: #4fc08d;
	transition: all 0.15s ease;
	box-sizing: border-box;
	border: 1px solid #4fc08d;
}

.doc button.alt {
	color: #42b983;
	background-color: transparent;
	margin-right: 10px;
}
</style>
