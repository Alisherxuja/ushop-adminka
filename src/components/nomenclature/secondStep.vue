<template>
	<div>
		<validation-observer v-if="!initLoading" ref="formObserver" v-slot="{handleSubmit}">
			<form @submit.prevent="handleSubmit(submit)">
				<v-simple-table>
					<thead>
					<tr>
						<th>Характеристика</th>
						<th>Значение</th>
					</tr>
					</thead>
					<tbody>
					<featureRow
							@updateValues="updateValues"
							v-for="(item, index) in features"
							:key="`featureRow-${index}`"
							:selectedValues="nomenclatureValues[item.id]"
							:feature="item">
					</featureRow>
					</tbody>
				</v-simple-table>
				<v-btn @click="$emit('input', value-1)" color="primary" class="mr-2" small style="height: 38px">Предыдущий
				</v-btn>
				<v-btn :loading="loading" color="primary" type="submit" small style="height: 38px">Следующий</v-btn>
			</form>
		</validation-observer>
		<div v-else class="d-flex justify-center align-center" style="height: 500px">
			<v-progress-circular
					indeterminate
					size="70"
					color="primary"/>
		</div>
	</div>
</template>

<script>
	import stepMixin from "./stepMixin";
	import featureRow from "./featureRow";

	export default {
		props: {
			value: {},
			nomenclature_id: {},
			subcategoryId: {}
		},
		data() {
			return {
				feature: null,
				initLoading: true,
				loading: false,
				features: [],
				nomenclatureValues: {}
			}
		},
		watch: {
			value(val) {
				if (val === 2) {
					this.init()
				}
			}
		},
		mixins: [stepMixin],
		methods: {
			getFeatures() {
				return new Promise((resolve, reject) => {
					const url = `features/list?category_id=${this.subcategoryId}`
					this.$http.get(url)
						.then(res => {
							this.features = res.data.data;
							resolve()
						})
						.catch(err => {
							reject(err)
						})
				})
			},
			getData() {
				return new Promise((resolve, reject) => {
					this.$http.get(`nomenclature-feature/main-features/${this.nomenclatureId}`)
						.then(res => {
							if (res.data.data.length > 0) {
								res.data.data.forEach(item => {
									this.nomenclatureValues[item.id] = item['selected_values']
								})
							}
							resolve()
						})
						.catch(err => {
							reject(err)
						})
				})
			},
			init() {
				let requests = [this.getFeatures()];
				if (this.isUpdate) {
					requests.unshift(this.getData())
				}
				Promise.all(requests)
					.catch(err => {
						console.error(err)
						this.$store.commit('showErrorMessage', err)
					})
					.finally(() => {
						this.initLoading = false
					})
			},
			submit() {
				const data = []

				for (let id in this.nomenclatureValues) {
					this.nomenclatureValues[id].forEach(value => {
						data.push(
							{
								id: value.id,
								feature_id: id,
								nomenclature_id: this.nomenclature_id,
								value_en: value.value_en,
								value_ru: value.value_ru,
								value_uz: value.value_uz
							}
						)
					})
				}


				this.loading = true;
				const method = this.isUpdate
				this.$http.post('nomenclature-feature/' + (this.nomenclatureId || this.nomenclature_id), data)
					.then(res => {
						this.$emit('submit', res.data.data)
					})
					.catch(err => {
						this.$store.commit('showErrorMessage', err);
						if (err.response && err.response.data && err.response.data.errors) {
							this.$refs['formObserver'].setErrors(err.response.data.errors)
						}
					})
					.finally(() => {
						this.loading = false
					})
			},
			updateValues({id, values}) {
				this.nomenclatureValues[id] = values
			}
		},
		components: {
			featureRow
		}
	}
</script>
