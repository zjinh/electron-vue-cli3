<template>
	<main>
		<div class="logo">
			<img src="../assets/logo.png" @click="open('https://cn.vuejs.org/v2/guide/')" draggable="false" alt="" />
			<span>+</span>
			<img src="../assets/electron.png" @click="open('https://electronjs.org/')" draggable="false" style="border-radius: 100%" alt="" />
		</div>
		<div class="content">
			<div class="left-side">
				<h4>项目说明</h4>
				<ul>
					<li>包含了<span class="key">检查升级</span>模块</li>
					<li>包含了<span class="key">窗口管理</span>模块</li>
					<li>默认为<span class="key">单例模式</span></li>
					<li>使用了<span class="key">scss</span></li>
					<li>封装了cookie<span class="key">this.$cookie</span>方法</li>
					<li>封装了系统通知<span class="key">this.$notify</span>方法</li>
					<li>封装了ipc通信方法<span class="key">this.$ipc</span></li>
					<li>electron方法<span class="key">this.$electron</span></li>
					<li>集成了<span class="key">electron-updater</span></li>
					<li>自引入<span class="key">components/public</span>下的组件将自动注册</li>
				</ul>
			</div>
			<div class="left-side">
				<h4>基本信息</h4>
				<SystemInformation></SystemInformation>
			</div>
			<div class="left-side">
				<h4>简单示例</h4>
				<button @click="sendMessage">点我弹出通知</button>
				<button @click="checkUpdate" :disabled="percent > 0 && percent !== 100">
					<span v-if="!loading">{{ CheckText }}</span>
					<span v-else>{{ ProcessText }}</span>
				</button>
				<span>{{ message }}</span>
			</div>
			<div class="left-side">
				<h4>相关文档</h4>
				<button class="alt" @click="open('https://electronjs.org/')">Electron</button>
				<button class="alt" @click="open('https://cn.vuejs.org/v2/guide/')">Vue.js</button>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	name: 'landing-page',
	data() {
		return {
			CheckText: '使用IPC检查更新',
			ProcessText: '正在检查',
			percent: 0,
			message: '',
			loading: false,
		};
	},
	created() {
		this.bind();
	},
	methods: {
		open(link) {
			this.$electron.shell.openExternal(link);
		},
		sendMessage() {
			this.$notify('这是一个示例信息', '这是消息标题');
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
		},
	},
});
</script>

<style lang="scss" scoped>
main {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	.logo {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		span {
			font-weight: bold;
			font-size: 30px;
			margin: 0 30px;
		}
		img {
			width: 100px;
		}
	}
	.content {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		overflow: auto;
		.left-side {
			margin-top: 30px;
			margin-left: 30px;
			h4 {
				margin-bottom: 10px;
			}
			ul {
				padding-left: 30px;
				li {
					list-style: decimal-leading-zero;
					font-size: 16px;
					margin: 5px 0;
					span {
						color: #42b983;
						font-weight: bold;
						margin: 0 5px;
					}
				}
			}
		}
		button {
			font-size: 12px;
			padding: 5px 10px;
			border-radius: 30px;
			display: inline-block;
			color: #fff;
			background-color: #4fc08d;
			transition: all 0.15s ease;
			box-sizing: border-box;
			border: 1px solid #4fc08d;
			margin-right: 10px;
			margin-bottom: 10px;
			&.alt {
				color: #42b983;
				background-color: transparent;
			}
		}
	}
}
</style>
