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
		logs: {
			index: 0,
			history: [],
		},
	},
	mutations: {
		//----установка текущего состояния в обьект logs.history
		SET_LOG(state) {
			let deepClone = JSON.parse(JSON.stringify(state));
			delete deepClone.logs;
			if (state.logs.index !== 10) {
				state.logs.index += 1;
			}
			if (state.logs.history.length >= 10) {
				state.logs.history.pop();
				state.logs.history.push(deepClone);
			} else {
				state.logs.history.push(deepClone);
			}
		},
		//----отмена изменений в состоянии
		PREV_STATE(state) {
			if (state.logs.index !== 1) {
				state.logs.index -= 1;
				state = Object.assign(
					state,
					state.logs.history[state.logs.index - 1]
				);
			}
		},
		//----метод возврата изменений
		NEXT_STATE(state) {
			if (state.logs.index !== state.logs.history.length) {
				state = Object.assign(
					state,
					state.logs.history[state.logs.index]
				);
				state.logs.index += 1;
			}
		},
		//----ресет стейта
		RESET_SELECTED(state) {
			state.currentSelected.splice(0);
			state.logs.history.splice(1);
			state.logs.index = 1;
			state.shaStrings = "";
			state.shaNumbers = "";
			state.allMultiply = 0;
			state.allStrings = '';
		},
		//----установка текущей выбранной опции по клику
		SET_CURRENT_OPTION(state, option) {
			if (state.currentSelected.includes(option)) {
				state.currentSelected.splice(
					state.currentSelected.indexOf(option),
					1
				);
			} else {
				state.currentSelected = [...state.currentSelected, option];
			}
			this.dispatch("SET_CRYPTO", option).then(() => {
				setTimeout(() => {
					this.commit("SET_LOG");
				}, 0);
			});
		},
		//----внесение данных в стейт
		SET_DATA_TO_STATE(state, data) {
			state.data = data;
		},
		//----метод разворачивания
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
		//----метод сортировки
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
	},
	actions: {
		//----кодирование в SHA256 строк или суммы чисел
		SET_CRYPTO({ state }, data) {
			if (typeof data === "string") {
				state.allStrings = "";
				state.allStrings = state.currentSelected
					.filter((el) => typeof el === "string")
					.join("");
				this.dispatch("SHA256", {
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
				this.dispatch("SHA256", {
					hash: state.allMultiply,
					type: "shaNumbers",
				});
			}
		},
		//----метод кодирования в SHA 256
		async SHA256({ state }, { hash, type }) {
			// Кодируем в формат UTF-8
			const msgBuffer = new TextEncoder().encode(hash);

			// ХЭШИРУЕМ
			const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

			// конвертируем буфер в массив
			const hashArray = Array.from(new Uint8Array(hashBuffer));

			// конвертируем в строку
			const hashHex = [];
			for (let i = 0; i < hashArray.length; i++) {
				hashHex.push(hashArray[i].toString(16).padStart(2, "0"));
			}

			state[type] = hashHex.join("");
		},
		//----получение данных с API
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
					commit("SET_LOG");
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
		GET_INDEX_STATE: (state) => state.logs.index,

	},
});
