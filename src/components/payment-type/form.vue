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
                            <validation-provider name="name_ru" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="Name ru"
                                    v-model="formData.name_ru"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="6">
                            <validation-provider name="name_uz" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="Name uz"
                                    v-model="formData.name_uz"
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
                        <v-col md="6">
                            <validation-provider name="type" v-slot="{errors}">
                                <v-autocomplete
                                    :error-messages="errors[0]"
                                    item-text="name"
                                    outlined
                                    dense
                                    clearable
                                    label="type"
                                    item-value="id"
                                    :items="$store.state.paymentTypes"
                                    v-model="formData.type"
                                />
                            </validation-provider>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-row>
                <v-col class="flex-grow-0 py-0">
                    <v-card-title class="mt-4 px-1 pb-1">Фото</v-card-title>
                    <validation-provider name="file" v-slot="{errors}">
                        <v-uploader
                            :error-message="errors[0]"
                            v-model="formData.file"/>
                    </validation-provider>
                </v-col>
            </v-row>

        </form>
    </ValidationObserver>
</template>

<script>
import {getErrorMessages} from "@/utils";

export default {
    data() {
        return {
            formData: {
                is_default: 0,
                status: 10,
                type: '',
                name_uz: '',
                name_ru: '',
                file: {},
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
                this.$http.get(`payment-types/${this.$route.params.id}`)
                    .then(res => {
                        const data = {}
                        res.data.data.file = {}
                        res.data.data.is_default = res.data.data.is_default === true ? 1 : 0;
                        if (res.data.data.logo_url) {
                            res.data.data.file.url = res.data.data.logo_url
                        }
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
                if (prop === 'file') {
                    if (this.formData[prop].file) {
                        data.append(prop, this.formData[prop].file)
                    } else if (this.formData[prop].file === null && this.formData[prop].url === null) {
                        data.append(prop, null)
                    }
                } else {
                    data.append(prop, this.formData[prop])
                }
            }
            return data
        },
        create() {
            const data = this.prepareData()
            this.$http.post('payment-types', data).then(() => {
                this.$router.push({name: 'payment-types-index'})
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
            this.$http.post(`payment-types/${this.$route.params.id}`, data)
                .then(() => {
                    this.$router.push({name: 'payment-types-index'})
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
