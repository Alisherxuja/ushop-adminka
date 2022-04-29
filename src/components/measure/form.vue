<template>
    <ValidationObserver v-slot="{handleSubmit}" ref="obs" v-if="ready">
        <form @submit.prevent="handleSubmit(save)">
            <v-card-title class="px-0">
                <h4>{{ title }}</h4>
                <v-spacer/>
                <v-switch :true-value="10" :false-value="0" v-model="formData.status" color="primary" class="ma-2"
                          label="Active"
                          style="margin-top: 22px !important;"/>
                <v-btn color="primary" dark class="mb-2" :loading="loading" type="submit">
                    Сохранить
                </v-btn>
            </v-card-title>
            <v-card>
                <v-card-text>
                    <v-row>
                        <v-col md="3">
                            <validation-provider name="name_ru" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    item-text="name"
                                    outlined
                                    dense
                                    clearable
                                    label="Название ru"
                                    v-model="formData.name_ru"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="3">
                            <validation-provider name="name_uz" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    item-text="name"
                                    outlined
                                    dense
                                    clearable
                                    label="Название uz"
                                    v-model="formData.name_uz"
                                />
                            </validation-provider>
                        </v-col>

                        <v-col md="3">
                            <validation-provider name="symbol_ru" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="symbol ru"
                                    v-model="formData.symbol_ru"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="3">
                            <validation-provider name="symbol_uz" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="symbol uz"
                                    v-model="formData.symbol_uz"
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
import {getErrorMessages} from "../../utils";

export default {
    data() {
        return {
            formData: {
                name_ru: '',
                name_uz: '',
                symbol_ru: '',
                symbol_uz: '',
                status: 10,
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
        },
    },
    methods: {
        getData() {
            return new Promise((resolve) => {
                this.$http.get(`measure/${this.$route.params.id}`).then(res => {
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
            this.$http.post('measure', data).then(() => {
                this.$router.push({name: 'measure-index'})
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
            this.$http.post(`measure/${this.$route.params.id}`, data)
                .then(() => {
                    this.$router.push({name: 'measure-index'})
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
            if (this.isUpdate) {
                this.getData()
            }
            this.$store.commit('clearLoading')
            this.ready = true
        },
    },
    created() {
        this.init()
    }
}
</script>
