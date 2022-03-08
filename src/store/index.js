import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		data: [],
		currentSelected: [],
		allStrings: "",
		allMultiply: 0,
		shaStrings: "",
		shaNumbers: "",
		logs: [],
	},
	mutations: {
		SET_LOG() {
			// if (state.logs.length === 10) {
			// 	state.logs.shift();
			// 	const newLog = Object.assign({}, state);
			// 	state.logs.push(newLog);
			// } else {
			// 	state.logs.push(state);
			// }
		},
		RESET_SELECTED(state) {
			state.currentSelected.splice(0);
			state.shaStrings = "";
			state.shaNumbers = "";
		},
		SET_CURRENT_OPTION(state, option) {
			if (state.currentSelected.includes(option)) {
				state.currentSelected.splice(
					state.currentSelected.indexOf(option),
					1
				);
			} else {
				state.currentSelected = [...state.currentSelected, option];
			}
			this.commit("SET_CRYPTO", option);
		},
		SET_DATA_TO_STATE(state, data) {
			state.data = data;
		},
		SET_CRYPTO(state, data) {
			if (typeof data === "string") {
				state.allStrings = "";
				state.allStrings = state.currentSelected
					.filter((el) => typeof el === "string")
					.join("");
				this.commit("SHA256", {
					hash: state.allStrings,
					type: "shaStrings",
				});
			}
			if (typeof data === "number") {
				state.allMultiply = 0;
				state.allMultiply = eval(
					state.currentSelected
						.filter((el) => typeof el === "number")
						.join("*")
				);
				this.commit("SHA256", {
					hash: state.allMultiply,
					type: "shaNumbers",
				});
			}
		},
		FLAT_DATA(state, arr) {
			function func(arr) {
				for (let i = 0; i < arr.length; i++) {
					if (Array.isArray(arr[i])) {
						func(arr[i]);
					} else {
						state.data.push(arr[i]);
					}
				}
			}
			func(arr);
		},
		SORT_DATA(state, data) {
			const nums = [];
			const strings = [];
			const obj = [];
			const bool = [];

			for (let i = 0; i < data.length; i++) {
				if (typeof data[i] == "number") {
					nums.push(data[i]);
				} else if (typeof data[i] == "string") {
					strings.push(data[i]);
				} else if (typeof data[i] == "boolean") {
					bool.push(data[i]);
				} else if (typeof data[i] == "object") {
					obj.push(data[i]);
				}
			}

			state.data = [nums, strings, obj, bool];
		},
		async SHA256(state, { hash, type }) {
			// encode as UTF-8
			const msgBuffer = new TextEncoder().encode(hash);

			// hash the message
			const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

			// convert ArrayBuffer to Array
			const hashArray = Array.from(new Uint8Array(hashBuffer));

			// convert bytes to hex string
			const hashHex = [];
			for (let i = 0; i < hashArray.length; i++) {
				hashHex.push(hashArray[i].toString(16).padStart(2, "0"));
			}

			state[type] = hashHex.join("");
		},
	},
	actions: {
		GET_DATA_FROM_API({ commit }) {
			return fetch(
				"https://raw.githubusercontent.com/WilliamRu/TestAPI/master/db.json"
			)
				.then((res) => {
					if (res.status >= 200 && res.status < 300) {
						return res;
					} else {
						let error = new Error("Ошибка запроса на сервер");
						error.response = res;
						throw error;
					}
				})
				.then((data) => data.json())
				.then((json) => {
					commit(
						"FLAT_DATA",
						JSON.parse(JSON.stringify(json.testArr))
					);
					commit("SORT_DATA", this.state.data);

					return json;
				});
		},
	},
	getters: {
		GET_DATA: (state) => state.data,
		GET_DATA_LENGTH: (state) => state.data.length,
		GET_CURRENT_SELECTED: (state) => state.currentSelected,
		GET_HASH_STRINGS: (state) => state.shaStrings,
		GET_HASH_NUMBERS: (state) => state.shaNumbers,
	},
});
