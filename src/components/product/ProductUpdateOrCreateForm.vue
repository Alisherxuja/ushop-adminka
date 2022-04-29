<template>
    <div>
        <validation-observer ref="form" v-slot="{handleSubmit}">
            <form @submit.prevent="handleSubmit(save)">
                <div class="d-flex">
                    <v-card-title class="px-0"><h4>{{ $route.meta.title }}</h4></v-card-title>
                    <v-spacer class="mr-2"></v-spacer>
                    <v-switch
                        v-model="form.status"
                        :false-value="0"
                        :true-value="10"
                        class="ma-0"
                        color="primary"
                        hide-details
                        label="Active"></v-switch>
                    <v-btn
                        :loading="loading" class="ml-4" color="primary"
                        dark type="submit">
                        Сохранить
                    </v-btn>
                </div>

                <product-info-form :form="form"/>

                <div class="d-flex justify-space-between align-center mt-8">
                    <v-card-title class="px-0">Фото</v-card-title>
                </div>
                <v-card class="mt-4">
                    <v-card-text>
                        <v-row>
                            <product-images
                                :images="form.attachments"
                                upload-file
                                @deleteImage="imageIndex => showConfirmDeleteImage(imageIndex)"
                                @onBrowseFile="browseFileHandler()"
                                @update:images="data => form.attachments = data"/>
                        </v-row>
                    </v-card-text>
                </v-card>

                <div class="d-flex justify-space-between align-center mt-8">
                    <v-card-title class="px-0">Характеристики</v-card-title>
                    <div class="d-flex">
                        <v-tooltip top>
                            <template #activator="{on}">
                                <v-btn v-on="on" class="ml-4" color="primary" @click="addProductInfo">+</v-btn>
                            </template>
                            <template #default>
                                <span>Добавить Характеристики</span>
                            </template>
                        </v-tooltip>
                    </div>
                </div>
                <v-card class="mt-4">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6" sm="6">
                                <v-card-title class="px-0">Ru</v-card-title>
                                <v-row v-for="item in form.info_ru">
                                    <v-col cols="12" md="4" sm="4">
                                        <validation-provider v-slot="{errors}" name="Key" vid="key">
                                            <v-text-field
                                                v-model="item.key"
                                                :error-messages="errors[0]"
                                                dense
                                                label="Key"
                                                outlined
                                                type="text"/>
                                        </validation-provider>
                                    </v-col>
                                    <v-col cols="12" md="8" sm="8">
                                        <validation-provider v-slot="{errors}" class="flex-grow-1" name="Value"
                                                             vid="value">
                                            <v-text-field
                                                v-model="item.value"
                                                :error-messages="errors[0]"
                                                dense
                                                label="Value"
                                                outlined
                                                type="text"/>
                                        </validation-provider>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="5" sm="5">
                                <v-card-title class="px-0">Uz</v-card-title>
                                <v-row v-for="item in form.info_uz">
                                    <v-col cols="12" md="4" sm="4">
                                        <validation-provider v-slot="{errors}" name="Key" vid="key">
                                            <v-text-field
                                                v-model="item.key"
                                                :error-messages="errors[0]"
                                                dense
                                                label="Key"
                                                outlined
                                                type="text"/>
                                        </validation-provider>
                                    </v-col>
                                    <v-col cols="12" md="8" sm="8">
                                        <validation-provider v-slot="{errors}" class="flex-grow-1" name="Value"
                                                             vid="value">
                                            <v-text-field
                                                v-model="item.value"
                                                :error-messages="errors[0]"
                                                dense
                                                label="Value"
                                                outlined
                                                type="text"/>
                                        </validation-provider>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-card-title class="px-0"> Action</v-card-title>
                                <v-row v-for="(item, key) in form.info_uz">
                                    <v-col cols="12" md="12" sm="12">
                                        <v-btn v-on="on" class="ml-4" color="danger" style="margin-bottom: 30px"
                                               @click="removeProductInfo(key)">-
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <div class="d-flex mt-5">
                    <v-spacer class="mr-2"></v-spacer>
                    <v-btn
                        :loading="loading" class="ml-4" color="primary"
                        dark type="submit">
                        Сохранить
                    </v-btn>
                </div>
            </form>
        </validation-observer>


        <product-image-cropper
            ref="cropper"
            v-model="cropperImageDialog" @cropped="croppedImage"/>

    </div>
</template>

<script>
import ProductImages from "@/components/product/ProductImages";
import ProductImageCropper from "@/components/product/ProductImageCropper";
import ProductInfoForm from "@/components/product/ProductInfoForm";

export default {
    name: "ProductUpdateOrCreateForm",
    components: {ProductInfoForm, ProductImageCropper, ProductImages},
    data() {
        return {
            form: {
                status: 10,
                p_category_id: null,
                category_id: null,
                info_uz: [
                    {
                        key: null,
                        value: null
                    }
                ],
                info_ru: [
                    {
                        key: null,
                        value: null
                    }
                ],
                attachments: [],
            },
            syncLoading: false,
            cropperImageDialog: false,
            loading: false,
            currentEditingProduct: {
                imageIndex: null,
            }
        }
    },
    methods: {
        addProductInfo() {
            if (!this.form.info_uz)
                this.form.info_uz = [];
            if (!this.form.info_ru)
                this.form.info_ru = [];
            this.form.info_uz.push({key: null, value: null});
            this.form.info_ru.push({key: null, value: null});
        },
        removeProductInfo(index) {
            this.form.info_uz.splice(index, 1);
            this.form.info_ru.splice(index, 1);
        },
        showConfirmDeleteImage(imageIndex) {
            this.currentEditingProduct = {...this.currentEditingProduct, imageIndex}
            this.deleteProductImageHandler()
        },
        deleteProductImageHandler() {
            const {imageIndex} = this.currentEditingProduct
            this.form.attachments.splice(imageIndex, 1)
            this.currentEditingProduct = {...this.currentEditingProduct, imageIndex: null}
        },
        browseFileHandler() {
            this.$refs.cropper.browseFile()
        },
        croppedImage(data) {
            this.form.attachments.push({
                image: data.path,
                ...data
            })
        },
        async save() {
            try {
                this.$showLoading()
                const formData = {...this.form}
                if (this.isUpdate) {
                    await this.updateProduct(formData)
                } else {
                    await this.createProduct(formData)
                }
                await this.$router.go(-1)

            } catch (e) {
                this.$store.commit('showErrorMessage', e)
            } finally {
                this.$clearLoading()
            }
        },
        createProduct(formData) {
            return this.$http.post('products', formData)
        },
        async updateProduct(formData) {
            return this.$http.put(`products/${this.id}`, formData)
        },
        async getData() {
            try {
                const {data: {data}} = await this.$http.get(`products/${this.id}`)
                this.form = {...data}
            } catch (e) {

            }
        },
    },
    computed: {
        isUpdate() {
            return !!this.id
        },
        id() {
            return this.$route.params.id
        }
    },
    async created() {
        this.$showLoading()
        if (this.isUpdate) {
            await this.getData()
        }
        this.$clearLoading()
    }
}
</script>

<style scoped>

</style>
