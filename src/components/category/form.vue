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
                        <v-col md="4">
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
                        <v-col md="4">
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

                        <v-col md="4">
                            <validation-provider name="parent_id" v-slot="{errors}">
                                <v-autocomplete
                                    :error-messages="errors[0]"
                                    item-text="name_ru"
                                    outlined
                                    dense
                                    clearable
                                    label="Родитель"
                                    :items="categories"
                                    item-value="id"
                                    v-model="formData.parent_id"
                                />
                            </validation-provider>
                        </v-col>
                        <v-col md="4" v-if="accessToAddBrands">
                            <validation-provider name="brands" v-slot="{errors}">
                                <v-autocomplete
                                    :error-messages="errors[0]"
                                    item-text="name"
                                    outlined
                                    dense
                                    clearable
                                    label="Brands"
                                    item-value="id"
                                    :items="brands"
                                    multiple
                                    v-model="formData.brands"
                                >
                                    <template #prepend-item>
                                        <v-list-item ripple @click="toggle(!likesAllBrand)">
                                            <v-list-item-action>
                                                <v-icon :color="formData.brands.length > 0 ? 'indigo darken-4' : ''">
                                                    {{ icon }}
                                                </v-icon>
                                            </v-list-item-action>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    Выбрать все
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                    <template #selection="{item, index}">
                                        <template v-if="index < 3">
                                            <v-chip>{{ item.name }}</v-chip>
                                        </template>
                                        <template v-if="index === 3">
                                            <v-chip>+{{ formData.brands.length - 3 }}</v-chip>
                                        </template>
                                    </template>
                                </v-autocomplete>
                            </validation-provider>
                        </v-col>
                        <v-col md="4">
                            <validation-provider name="file" v-slot="{errors}">
                                <v-uploader
                                    :error-message="errors[0]"
                                    label-text="Image"
                                    v-model="formData.file"/>
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
                parent_id: '',
                file: {},
                brands: [],
                is_popular: 0,
                status: 10,
            },
            loading: false,
            ready: false,
            categories: [],
            brands: []
        }
    },
    watch: {
        accessToAddBrands(val) {
            if (!val) {
                this.formData.brands = []
            }
        }
    },
    computed: {
        title() {
            return this.$route.meta.title
        },
        isUpdate() {
            return this.$route.params.id
        },
        accessToAddBrands() {
            return this.formData.parent_id
        },
        likesAllBrand() {
            return this.formData.brands.length === this.brands.length
        },
        likesSomeFruit() {
            return this.formData.brands.length > 0 && !this.likesAllBrand
        },
        icon() {
            if (this.likesAllBrand) return 'fas fa-times';
            if (this.likesSomeFruit) return 'fas fa-minus';
            return 'fas fa-check'
        },
    },
    methods: {
        toggle(val) {
            this.$nextTick(() => {
                if (val) {
                    let brands = []
                    for (let i = 0; i < this.brands.length; i++) {
                        brands[i] = this.brands[i].id
                    }
                    this.formData.brands = brands
                } else {
                    this.formData.brands = []
                }
            })
        },
        getData() {
            return new Promise((resolve) => {
                this.$http.get(`categories/${this.$route.params.id}`).then(res => {
                    res.data.data.file = {}
                    res.data.data.brands = res.data.data.category_brands.map(item => {
                        return item.brand_id
                    })
                    if (res.data.data.image_url) {
                        res.data.data.file.url = res.data.data.image_url
                    }
                    if (res.data.data.parent_id === null) {
                        res.data.data.parent_id = ''
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
                this.$http.get('categories/parent-list')
                    .then(res => {
                        this.categories = res.data.data
                    })
                    .catch(err => this.$store.commit('showErrorMessage', err))
                    .finally(() => resolve())
            })
        },
        getBrands() {
            return new Promise(resolve => {
                this.$http.get('brands/list')
                    .then(res => {
                        this.brands = res.data.data
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
                    }
                } else if (prop === 'brands') {
                    this.formData[prop].forEach(item => {
                        data.append(prop + '[]', item)
                    })
                } else {
                    data.append(prop, this.formData[prop])
                }
            }
            return data
        },
        create() {
            const data = this.prepareData()
            this.$http.post('categories', data).then(() => {
                this.$router.push({name: 'categories-index'})
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
            this.$http.post(`categories/${this.$route.params.id}`, data)
                .then(() => {
                    this.$router.push({name: 'categories-index'})
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
            const promisesData = [
                this.getCategories(),
                this.getBrands()
            ]
            if (this.isUpdate) {
                promisesData.push(this.getData())
            }
            Promise.all(promisesData).then(() => {
                this.$store.commit('clearLoading')
                this.ready = true
            })
        },
        filterParents() {
            this.filteredCategories = this.categories.filter(c => c.type === this.formData.type);
        }
    },
    created() {
        this.init()
    }
}
</script>
