<template>
    <ValidationObserver v-slot="{handleSubmit}" ref="obs" v-if="ready">
        <form @submit.prevent="handleSubmit(save)">
            <v-card-title class="px-0">
                <h4>{{ title }}</h4>
                <v-spacer/>
                <v-btn color="primary" dark class="mb-2" :loading="loading" type="submit">
                    Сохранить
                </v-btn>
            </v-card-title>


            <v-card>
                <v-card-text>
                    <v-row>
                        <v-col md="6">
                            <validation-provider name="name" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="Name"
                                    v-model="formData.name"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="6">
                            <validation-provider name="phone" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="phone"
                                    v-model="formData.phone"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="6">
                            <validation-provider name="car_number" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="car_number"
                                    v-model="formData.car_number"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="6">
                            <validation-provider name="car_type" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="car_type"
                                    v-model="formData.car_type"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="6">
                            <validation-provider name="car_model" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="car_model"
                                    v-model="formData.car_model"
                                />
                            </validation-provider>
                        </v-col>

                        <v-col md="6">
                            <validation-provider name="status" v-slot="{errors}">
                                <v-autocomplete
                                    :error-messages="errors[0]"
                                    item-text="text"
                                    outlined
                                    dense
                                    clearable
                                    label="Status"
                                    item-value="id"
                                    :items="$store.state.status"
                                    v-model="formData.status"
                                />
                            </validation-provider>
                        </v-col>

                    </v-row>
                </v-card-text>
            </v-card>
        </form>
    </ValidationObserver>
</template>

<script>
import {getErrorMessages} from "@/utils";

export default {
    data() {
        return {
            formData: {
                status: 10,
                name: '',
                phone: '',
                car_number: '',
                car_type: '',
                car_model: '',
            },
            loading: false,
            ready: false,
        }
    },
    computed: {
        title() {
            return this.$route.meta.title
        },
        isUpdate() {
            return this.$route.params.id
        }
    },
    methods: {
        getData() {
            return new Promise((resolve) => {
                this.$http.get(`courier/${this.$route.params.id}`)
                    .then(res => {
                        const data = {}
                        for (let prop in res.data.data) {
                            if (this.formData.hasOwnProperty(prop)) {
                                data[prop] = res.data.data[prop]
                            }
                        }
                        this.formData = data
                    }).finally(() => resolve())
            })
        },

        save() {
            if (this.isUpdate) {
                this.update()
            } else {
                this.create()
            }
        },
        prepareData() {
            const data = new FormData()
            for (let prop in this.formData) {
                data.append(prop, this.formData[prop])
            }
            return data
        },
        create() {
            const data = this.prepareData()
            this.$http.post('courier', data).then(() => {
                this.$router.push({name: 'courier-index'})
                this.$store.commit('showSnackbar', 'Saved successfully')
            }).catch(err => {
                const {obs} = this.$refs
                obs.setErrors(getErrorMessages(err))
                this.$store.commit('showErrorMessage', err)
            })
        },
        update() {
            const data = this.prepareData()
            data.append('_method', 'put')
            this.$http.post(`courier/${this.$route.params.id}`, data)
                .then(() => {
                    this.$router.push({name: 'courier-index'})
                    this.$store.commit('showSnackbar', 'Saved successfully')
                })
                .catch(err => {
                    const {obs} = this.$refs
                    obs.setErrors(getErrorMessages(err))
                    this.$store.commit('showErrorMessage', err)
                })
        },
        init() {
            this.$store.commit('showLoading');
            const promisesData = []
            if (this.isUpdate) {
                promisesData.push(this.getData())
            }
            Promise.all(promisesData).then(() => {
                this.$store.commit('clearLoading')
                this.ready = true
            })
        }
    },
    created() {
        this.init()
    }
}
</script>
