<template>
    <ValidationObserver v-slot="{handleSubmit}" ref="form" v-if="ready">
        <form @submit.prevent="handleSubmit(save)">
            <v-toolbar flat class="px-0">
                <v-toolbar-title><h4>{{title}}</h4></v-toolbar-title>
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
                        <v-col md="4">
                            <validation-provider name="Називание en" vid="name_en" v-slot="{errors}">
                                <v-text-field
                                  :error-messages="errors[0]"
                                  outlined
                                  dense
                                  clearable
                                  label="Називание en"
                                  v-model="formData.name_en"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="4">
                            <validation-provider name="Називание ru" vid="name_ru" v-slot="{errors}">
                                <v-text-field
                                  :error-messages="errors[0]"
                                  outlined
                                  dense
                                  clearable
                                  label="Називание ru"
                                  v-model="formData.name_ru"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="4">
                            <validation-provider name="Називание uz" vid="name_uz" v-slot="{errors}">
                                <v-text-field
                                  :error-messages="errors[0]"
                                  outlined
                                  dense
                                  clearable
                                  label="Називание uz"
                                  v-model="formData.name_uz"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="4">
                            <validation-provider name="image" v-slot="{errors}">
                                <v-uploader
                                  label-text="ico"
                                  :error-message="errors[0]"
                                  v-model="formData.image"
                                ></v-uploader>
                            </validation-provider>
                        </v-col>
                    </v-row>

                </v-card-text>
            </v-card>
        </form>
    </ValidationObserver>
</template>

<script>
    import ImageUploader from "@/components/nomenclature/image/imageUploader";
    import {getErrorMessages} from "@/utils";

    export default {
        components: {ImageUploader},
        data() {
            return {
                ready: false,
                formData: {
                    name_en: '',
                    name_ru: '',
                    name_uz: '',
                    image: {},
                    status: false
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
            prepareData() {
                const {name_en, name_ru, name_uz, status, image} = this.formData
                const formData = new FormData();
                formData.append('name_en', name_en)
                formData.append('name_ru', name_ru)
                formData.append('name_uz', name_uz)
                formData.append('status', status)
                if (image.file || image.file === null) {
                    formData.append('image', image.file)
                }
                if (this.isUpdate) {
                    formData.append('_method', 'put')
                }

                return formData
            },

            getData() {
                return new Promise((resolve, reject) => {
                    this.$http.get(`faqs/category/view/${this.$route.params.id}`).then(res => {
                        if (!res.data.data['url']) {
                            res.data.data.image = {}
                        } else {
                            res.data.data.image = {
                                url: res.data.data['url']
                            }
                        }
                        this.formData = res.data.data
                    }).finally(() => resolve())
                })
            },
            init() {
                const request = []
                if (this.isUpdate) {
                    request.push(this.getData())
                }
                this.$store.commit('showLoading')
                Promise.all(request).then(() => {
                    this.$store.commit('clearLoading');
                    this.ready = true
                })
            },
            save() {
                let url;
                if (this.isUpdate) {
                    url = `faqs/category/update/${this.$route.params.id}`
                } else {
                    url = 'faqs/category/create'
                }
                this.$store.commit('showLoading');
                this.$http.post(url, this.prepareData()).then(() => {

                    this.$router.push({name: 'faq-categories-index'})
                }).catch(err => {
                    this.$store.commit('showErrorMessage', err)
                    const {form} = this.$refs
                    form.setErrors(getErrorMessages(err))
                }).finally(() => this.$store.commit('clearLoading'))
            }
        },
        mounted() {
            this.init()
        },
    }
</script>
