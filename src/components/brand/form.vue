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
                            <v-switch
                                v-model="formData['is_popular']"
                                label="Popular"
                                dense
                                hide-details
                            ></v-switch>
                            {{ formData.is_popular }}
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col md="4">
                    <v-card height="100%">
                        <v-card-text>
                            <validation-provider name="categories" v-slot="{errors}">
                                <v-autocomplete
                                    v-model="formData.categories"
                                    :items="categories"
                                    outlined
                                    dense
                                    label="Категории"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                >
                                    <template #selection="{item, index}">
                                        <template v-if="index < 3">
                                            <v-chip>{{ item.name }}</v-chip>
                                        </template>
                                        <template v-if="index === 3">
                                            <v-chip>+{{ formData.categories.length - 3 }}</v-chip>
                                        </template>
                                    </template>
                                    <template v-slot:item="data">
                                        <template>
                                            <v-list-item-content>
                                                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                                            </v-list-item-content>
                                        </template>
                                    </template>
                                </v-autocomplete>
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
                file: {},
                categories: [],
                status: 10
            },
            loading: false,
            ready: false,
            categories: [],
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
                this.$http.get(`brands/${this.$route.params.id}`).then(res => {
                    res.data.data.file = {}
                    res.data.data.categories = res.data.data.category_brands.map(item => {
                        return item.category_id
                    })
                    if (res.data.data.logo_url) {
                        res.data.data.file.url = res.data.data.logo_url
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
        getCategories() {
            return new Promise((resolve) => {
                this.$http.get('categories/parent-with-children').then(res => {
                    this.categories = res.data.data.reduce((subcategory, category, index) => {
                        subcategory.push({header: category.name})
                        category.children.forEach(item => {
                            item.group = category.name
                            subcategory.push(item)
                        })
                        if (index + 1 < res.data.data.length)
                            subcategory.push({divider: true})
                        return subcategory
                    }, [])
                })
                    .catch(err => this.$store.commit('showErrorMessage', err))
                    .finally(() => resolve())
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
                } else if (prop === 'categories') {
                    this.formData[prop].forEach(item => {
                        data.append(prop + '[]', item)
                    })
                } else if (prop === 'is_popular') {
                    if (this.formData[prop] === true) {
                        data.append(prop, 1)
                    } else {
                        data.append(prop, 0)
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
            this.$http.post('brands', data)
                .then(() => {
                    this.$router.push({name: 'brands-index'})
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
            this.$http.post(`brands/${this.$route.params.id}`, data)
                .then(() => {

                    this.$router.push({name: 'brands-index'})
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
                this.getCategories(),
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
