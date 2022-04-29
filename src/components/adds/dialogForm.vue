<template>
    <v-card>
        <v-card-title class="headline">Add new Brand</v-card-title>
        <v-card-text>
            <v-container>
                <ValidationObserver v-slot="{handleSubmit}" ref="obs">
                    <form @submit.prevent="handleSubmit(save)">
                        <v-row>
                            <v-col md="6">
                                <validation-provider name="name" v-slot="{errors}">
                                    <v-text-field
                                        :error-messages="errors[0]"
                                        item-text="name"
                                        outlined
                                        dense
                                        clearable
                                        label="Name"
                                        v-model="formData.name"
                                    />
                                </validation-provider>
                                <div class="d-flex">
                                    <v-switch
                                        v-model="formData['is_top']"
                                        label="Top"
                                        dense
                                        hide-details
                                    ></v-switch>
                                    <v-switch false-value="0" true-value="10" dense hide-details
                                              v-model="formData.status" class="ml-3" label="Active"/>
                                </div>
                            </v-col>
                            <v-col md="6">
                                <validation-provider name="categories" v-slot="{errors}">
                                    <v-autocomplete
                                        v-model="formData.categories"
                                        :items="categories"
                                        outlined
                                        dense
                                        label="Categories"
                                        item-text="name"
                                        item-value="id"
                                        multiple
                                        :loading="!ready"
                                    >
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
                            </v-col>
                            <v-col md="6">
                                <validation-provider name="image" v-slot="{errors}">
                                    <v-uploader
                                        :error-message="errors[0]"
                                        label-text="Image"
                                        v-model="formData.image"/>
                                </validation-provider>
                            </v-col>
                        </v-row>
                    </form>
                </ValidationObserver>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="d-flex justify-end" style="width: 100%">
                <v-btn color="primary" dark class="mb-2" @click="save" :loading="loading" type="submit">
                    Сохранить
                </v-btn>
                <v-btn
                    color="red darken-1"
                    text
                    @click="$emit('closeDialog')"
                >
                    Cancel
                </v-btn>
            </div>
        </v-card-actions>
    </v-card>
</template>

<script>
import {getErrorMessages} from "../../utils";

export default {
    name: "dialogForm",
    props: ['name'],
    data() {
        return {
            formData: {
                name: '',
                image: {},
                categories: [],
                is_top: false,
                status: 0
            },
            loading: false,
            ready: false,
            categories: [],
        }
    },
    methods: {
        getCategories() {
            return new Promise((resolve) => {
                this.$http.get('categories/with-children')
                    .then(res => {
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
            this.create();
        },
        prepareData() {
            const data = new FormData()
            for (let prop in this.formData) {
                if (prop === 'image') {
                    if (this.formData[prop].file) {
                        data.append(prop, this.formData[prop].file)
                    } else if (this.formData[prop].file === null && this.formData[prop].url === null) {
                        data.append(prop, null)
                    }
                } else if (prop === 'categories') {
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
            this.loading = true;
            this.$http.post('brands', data)
                .then(res => {
                    if (res.data.success) {
                        this.$store.commit('showSnackbar', 'Saved successfully')
                        this.$emit('save');
                    }

                })
                .catch(err => {
                    const {obs} = this.$refs
                    obs.setErrors(getErrorMessages(err))
                    this.$store.commit('showErrorMessage', err)
                })
                .finally(_ => {
                    this.loading = false;
                })
        },
        init() {
            this.$store.commit('showLoading');
            const promisesData = [
                this.getCategories(),
            ]
            Promise.all(promisesData).then(() => {
                this.$store.commit('clearLoading')
                this.ready = true
            })
        }
    },
    created() {
        this.formData.name = this.name;
        this.init();
    }
}
</script>

<style scoped>

</style>
