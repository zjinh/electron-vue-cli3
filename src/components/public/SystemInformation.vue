<template>
	<ul class="items">
		<li class="item">
			<span class="name">路由地址:</span>
			<span class="value">{{ path }}</span>
		</li>
		<li class="item">
			<span class="name">路由名称:</span>
			<span class="value">{{ name }}</span>
		</li>
		<li class="item">
			<span class="name">Vue.js:</span>
			<span class="value">{{ vue }}</span>
		</li>
		<li class="item">
			<span class="name">Electron:</span>
			<span class="value">{{ electron }}</span>
		</li>
		<li class="item">
			<span class="name">Node:</span>
			<span class="value">{{ node }}</span>
		</li>
		<li class="item">
			<span class="name">系统类型:</span>
			<span class="value">{{ platform }}</span>
		</li>
	</ul>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	data() {
		return {
			electron: process.versions.electron,
			name: this.$route.name,
			node: process.versions.node,
			path: this.$route.path,
			platform: require('os').platform(),
			vue: require('vue/package.json').version,
		};
	},
});
</script>

<style scoped lang="scss">
li {
	list-style: decimal-leading-zero;
	font-size: 16px;
	margin: 5px 0;
	.name {
		color: #6a6a6a;
		margin-right: 6px;
	}
	span.value {
		color: #000;
		font-weight: bold;
	}
}
/*.items {
	margin-top: 8px;
}

.item {
	display: flex;
	margin-bottom: 6px;
}

.item .name {
	color: #6a6a6a;
	margin-right: 6px;
}

.item .value {
	color: #35495e;
	font-weight: bold;
}*/
</style>
