<template>
    <ValidationObserver v-slot="{handleSubmit}" ref="obs" v-if="ready">
        <form @submit.prevent="handleSubmit(save)">
            <v-toolbar flat>
                <v-toolbar-title><h4>{{ title }}</h4></v-toolbar-title>
                <v-spacer/>
                <v-switch :false-value="0" :true-value="10"
                          v-model="formData.status" color="primary" class="ma-2" label="Active"
                          style="margin-top: 22px !important;"/>
                <v-btn color="primary" dark class="mb-2" :loading="loading" type="submit">
                    Сохранить
                </v-btn>
            </v-toolbar>
            <v-row>
                <v-col md="4">
                    <v-card height="100%">
                        <v-card-text>
                            <validation-provider name="name" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    item-text="name"
                                    outlined
                                    dense
                                    clearable
                                    label="Название"
                                    v-model="formData.name"
                                />
                            </validation-provider>
                        </v-card-text>
                    </v-card>
                </v-col><v-col md="4">
                    <v-card height="100%">
                        <v-card-text>
                            <validation-provider name="url" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    item-text="url"
                                    outlined
                                    dense
                                    clearable
                                    label="Url"
                                    v-model="formData.url"
                                />
                            </validation-provider>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col md="4">
                    <v-card>
                        <v-card-text>
                            <validation-provider name="file" v-slot="{errors}">
                                <v-uploader
                                    :error-message="errors[0]"
                                    label-text="Image"
                                    v-model="formData.file"/>
                            </validation-provider>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </form>
    </ValidationObserver>
</template>

<script>
import {getErrorMessages} from "../../utils";

export default {
    data() {
        return {
            formData: {
                name: '',
                url: '',
                file: {},
                status: 10
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
                this.$http.get(`adds/${this.$route.params.id}`).then(res => {
                    res.data.data.file = {}
                    if (res.data.data.image_url) {
                        res.data.data.file.url = res.data.data.image_url
                    }
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
            this.loading = true;
            this.$http.post('adds', data)
                .then(() => {
                    this.$router.push({name: 'adds-index'})
                    this.$store.commit('showSnackbar', 'Saved successfully')
                })
                .catch(err => {
                    const {obs} = this.$refs
                    obs.setErrors(getErrorMessages(err))
                    this.$store.commit('showErrorMessage', err)
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        update() {
            const data = this.prepareData()
            data.append('_method', 'put')
            this.loading = true;
            this.$http.post(`adds/${this.$route.params.id}`, data)
                .then(() => {

                    this.$router.push({name: 'adds-index'})
                    this.$store.commit('showSnackbar', 'Saved successfully')
                })
                .catch(err => {
                    const {obs} = this.$refs
                    obs.setErrors(getErrorMessages(err))
                    this.$store.commit('showErrorMessage', err)
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        init() {
            this.$store.commit('showLoading');
            const promisesData = [

            ]
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
