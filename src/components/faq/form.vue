<template>
    <ValidationObserver v-slot="{handleSubmit}" ref="form" v-if="ready">
        <form @submit.prevent="handleSubmit(save)">
            <v-toolbar flat class="px-0">
                <v-toolbar-title><h4>{{ title }}</h4></v-toolbar-title>
                <v-spacer/>
                <v-switch :true-value="10" :false-value="0" v-model="formData.status" color="primary" class="ma-2"
                          label="Active"
                          style="margin-top: 22px !important;"/>
                <v-btn color="primary" dark class="mb-2" type="submit">
                    Сохранить
                </v-btn>
            </v-toolbar>
            <v-card>
                <v-card-text>
                    <v-row>
                        <v-col md="12">
                            <validation-provider name="Вопрос" vid="question" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    outlined
                                    dense
                                    clearable
                                    label="Вопрос"
                                    v-model="formData.question"
                                />
                            </validation-provider>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card class="mt-4">
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <validation-provider name="Отвечать" vid="answer" v-slot="{errors}">
                                <vue-content
                                    :error-messages="errors[0]"
                                    v-model="formData.answer"
                                    label="Отвечать"
                                ></vue-content>
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
            ready: false,
            formData: {
                question: null,
                answer: null,
                status: 10
            }
        }
    },
    computed: {
        title() {
            return this.$route.meta.title
        },
        isUpdate() {
            return !!this.$route.params.id
        }
    },
    methods: {
        init() {
            const request = []
            if (this.isUpdate) {
                request.push(this.getData())
            }
            this.$store.commit('showLoading')
            Promise.all(request).then(() => {
                this.ready = true
                this.$store.commit('clearLoading')
            })

        },
        getData() {
            return new Promise((resolve, reject) => {
                this.$http.get(`faqs/${this.$route.params.id}`).then(res => {
                    this.formData = res.data.data
                    resolve()
                }).catch(err => reject(err))
            })
        },
        save() {
            let url, method
            if (this.isUpdate) {
                method = 'put'
                url = `faqs/${this.$route.params.id}`
            } else {
                method = 'post'
                url = 'faqs'
            }
            this.$http[method](url, this.formData).then(() => {
                this.$store.commit('showSnackbar', 'Saved successfully')
                this.$router.push({name: 'faqs-index'})
            }).catch(err => {
                const {form} = this.$refs
                this.$store.commit('showErrorMessage', err)
                form.setErrors(getErrorMessages(err))
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>
