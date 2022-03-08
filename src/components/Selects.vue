<template>
	<div class="b-select">
		<h3 class="b-select__title">Выберите опцию</h3>
		<div class="b-select__items">
			<span
				class="b-select__item"
				@click="clickHandler(option);"
				v-for="(option, i) in options"
				:key="i"
				>{{ option }}</span
			>
		</div>
	</div>
</template>

<script>
export default {
	name: "Selects",
	data() {
		return {
			showPanel: true,
		};
	},
	props: {
		options: {
			type: Array,
		},
	},
	methods: {
		clickHandler(option) {
			this.$emit("optionClick", option);
		},
	},
	computed: {
		countOptions() {
			return this.options.length;
		},
	},
};
</script>

<style lang="scss">
.b-select {
	height: fit-content;
	flex: 1 1 25%;
	background-color: rgb(207, 207, 207);
	&__title {
		padding: 20px 0;
	}
	&__items {
		padding: 20px 0;
		background-color: rgb(255, 255, 255);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	&__item {
		cursor: pointer;
		padding: 5px 0;
		&:nth-child(odd) {
			background-color: rgb(230, 230, 230);
		}
		&:hover {
			color: rgb(255, 133, 133);
		}
	}
}
</style>
