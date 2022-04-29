import Vue from 'vue'
import Vuex from 'vuex'
import TokenService from "../services/TokenService";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loading: false,
		test: 'test',
		inputTypes: [
			{
				name: 'checkbox',
				id: 'checkbox'
			},
			{
				name: 'radio',
				id: 'radio'
			},
			{
				name: 'string',
				id: 'string',
			},
			{
				name: 'text',
				id: 'text',
			},
			{
				name: 'number',
				id: 'number',
			},
			{
				name: 'select',
				id: 'select',
			},
			{
				name: 'color',
				id: 'color',
			},
			{
				name: 'date',
				id: 'date',
			},
			{
				name: 'datetime',
				id: 'datetime',
			},
			{
				name: 'time',
				id: 'time',
			},
			{
				name: 'email',
				id: 'email',
			},
			{
				name: 'range',
				id: 'range',
			}
		],
		featureClasses: [
			{
				name: 'Цвет',
				id: 'color'
			},
			{
				name: 'Размер',
				id: 'size'
			},
		],
		paymentTypes: [
			{
				name: 'Cash',
				id: 'cash'
			},
			{
				name: 'Self card',
				id: 'self_card'
			},
			{
				name: 'Card',
				id: 'card'
			},
		],
		subscriberTypes: ['all', 'sales', 'notifications'],
		status: [
			{
				text: 'Активный',
				id: 10
			},
			{
				text: 'Не активный',
				id: 0
			}
		],
		statusLocations: [
			{
				name: 'Активный',
				id: 10
			},
			{
				name: 'Неактивный',
				id: 0
			}
		],
		statusProduct: [
			{
				text: 'Неактивный',
				value: 0
			},
			{
				text: 'Активный',
				value: 10
			},
		],
		snackbar: {
			text: '',
			show: false
		},
		orderStatus: [
			{
				text: 'Отменено',
				value: 0
			},
			{
				text: 'Новый заказ',
				value: 1,
				next: "Принять заказ"
			},
			{
				text: 'Заказ принят',
				value: 2,
				next: "Заказ в пути"
			},
			{
				text: 'Заказ в пути',
				value: 3,
				next: "Доставлен в Узбекистан"
			},
			{
				text: 'Доставлен в Узбекистан',
				value: 4,
				next: "Доставлено"
			},
			{
				text: 'Доставлено',
				value: 10
			}
		],
		statusColors: [
			{
				color: "red",
				status: 0
			},
			{
				color: "orange",
				status: 1
			},
			{
				color: "blue",
				status: 2
			},
			{
				color: "blue",
				status: 3
			},
			{
				color: "blue",
				status: 4
			},
			{
				color: "blue",
				status: 5
			},
			{
				color: "green",
				status: 10
			},
			{
				color: "green",
				status: 6
			},
			{
				color: "green",
				status: 7
			},

		]
	},
	getters: {
		test: state => state.test
	},
	mutations: {
		changeTest(state) {
			state.test = 'Hello world'
		},
		showErrorMessage(state, err) {
			if (err.response && err.response.data && err.response.data.message && err.response.data.message !== '') {
				state.snackbar.text = err.response.data.message
			} else {
				state.snackbar.text = err.message
			}
			state.snackbar.show = true;
		},
		showSnackbar(state, message) {
			state.snackbar.show = true;
			state.snackbar.text = message
		},
		closeSnackbar(state) {
			state.snackbar.show = false;
			state.snackbar.text = ''
		},
		setToken(state, {token, expire}) {
			TokenService.setToken(token, expire)
		},
		setPermissions(state, {permissions}) {
			TokenService.setPermissions(permissions)
		},
		setRole(state, {role}) {
			TokenService.setRole(role)
		},
		showLoading(state) {
			state.loading = true
		},
		clearLoading(state) {
			state.loading = false
		},
		clearToken() {
			TokenService.removeToken()
		}
	},
	actions: {},
	modules: {}
})
