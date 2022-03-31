<template>
	<div id="app">
		<p class="b-index">#id СОСТОЯНИЯ: {{GET_INDEX_STATE}}</p>
		<p><b>HASH STRINGS:</b> {{ this.GET_HASH_STRINGS }}</p>
		<p><b>HASH NUMBERS:</b> {{ this.GET_HASH_NUMBERS }}</p>
		<h1>Выбранные опции:</h1>
		{{ GET_CURRENT_SELECTED }}
		<div>
			<button @click="NEXT_STATE">Вперед</button>
			<button @click="PREV_STATE">Назад</button>
		</div>
		<div>
			<button @click="RESET_SELECTED">Сброс</button>
		</div>
		<section class="b-container">
			<Selects
				v-for="(select, i) in GET_DATA"
				:key="i"
				:options="select"
				@optionClick="SET_CURRENT_OPTION"
			/>
		</section>
		<Modal v-if="showModal" @close="showModal = false">
			{{ error }}
		</Modal>
	</div>
</template>

<script>
import Selects from "./components/Selects.vue";
import Modal from "./components/Modal.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
	name: "App",
	data() {
		return {
			page: "",
			showModal: false,
			error: "",
		};
	},
	components: {
		Selects,
		Modal,
	},
	methods: {
		...mapMutations([
			"SET_CURRENT_OPTION",
			"RESET_SELECTED",
			"SHA256",
			"PREV_STATE",
			"NEXT_STATE",
			"SET_LOG",
		]),
		...mapActions(["GET_DATA_FROM_API"]),
	},
	computed: {
		...mapGetters([
			"GET_DATA",
			"GET_CURRENT_SELECTED",
			"GET_HASH_STRINGS",
			"GET_HASH_NUMBERS",
			"GET_INDEX_STATE"
		]),
	},
	mounted() {
		this.GET_DATA_FROM_API().catch((error) => {
			this.error = error;
			this.showModal = true;
		});
	},
	created() {
		this.SET_LOG;
	},
};
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
	margin: 0;
	padding: 0;
}
.b-container {
	display: flex;
	gap: 25px;
}
.b-index{
	font-size: 26px;
	color: rgb(255, 127, 127);
	font-weight: bold;
}
</style>
