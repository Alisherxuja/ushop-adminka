<template>
    <div>
        <v-card-title class="px-0">Инфо</v-card-title>
        <v-card>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <validation-provider v-slot="{errors}" name="Nomi" rules="required" vid="name_uz">
                            <v-text-field
                                v-model="form.name_uz"
                                :error-messages="errors[0]"
                                dense
                                label="Nomi"
                                outlined/>
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <validation-provider v-slot="{errors}" name="Имя" rules="required" vid="name_ru">
                            <v-text-field
                                v-model="form.name_ru"
                                :error-messages="errors[0]"
                                dense
                                label="Имя"
                                outlined/>
                        </validation-provider>
                    </v-col>

                    <v-col cols="12" md="3" sm="3">
                        <validation-provider rules="required" vid="brand_id" name="Бренд" v-slot="{errors}">
                            <v-autocomplete
                                :error-messages="errors[0]"
                                item-text="name"
                                outlined
                                dense
                                clearable
                                label="Бренд"
                                item-value="id"
                                :items="brands"
                                v-model="form.brand_id"
                            />
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <validation-provider rules="required" vid="p_category_id" name="Категория" v-slot="{errors}">
                            <v-autocomplete
                                :error-messages="errors[0]"
                                item-text="name"
                                outlined
                                dense
                                @input="() => {form.category_id = null}"
                                clearable
                                item-value="id"
                                label="Категория"
                                :items="filteredCategories"
                                v-model="form.p_category_id"
                            />
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <validation-provider rules="required" vid="category_id" name="Подкатегория" v-slot="{errors}">
                            <v-autocomplete
                                :error-messages="errors[0]"
                                item-text="name"
                                outlined
                                dense
                                clearable
                                label="Подкатегория"
                                item-value="id"
                                :items="subCategories"
                                v-model="form.category_id"
                            />
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <validation-provider rules="required" vid="measure_id" name="Measure" v-slot="{errors}">
                            <v-autocomplete
                                :error-messages="errors[0]"
                                item-text="name"
                                outlined
                                dense
                                clearable
                                label="Measure"
                                item-value="id"
                                :items="measures"
                                v-model="form.measure_id"
                            />
                        </validation-provider>
                    </v-col>

                    <v-col cols="12" md="3" sm="3">
                        <validation-provider v-slot="{errors}" name="Цена" rules="required" vid="price">
                            <v-text-field
                                v-model="form.price"
                                :error-messages="errors[0]"
                                dense
                                label="Цена"
                                outlined
                                :disabled="form.discount"
                                type="number"/>
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <validation-provider v-slot="{errors}" name="Скидка" vid="discount">
                            <v-text-field
                                v-model="form.discount"
                                :error-messages="errors[0]"
                                dense
                                label="Скидка"
                                outlined
                                type="number"/>
                        </validation-provider>
                    </v-col>
                    <v-col v-if="form.discount" cols="12" md="3" sm="3">
                        <validation-provider v-slot="{errors}" name="Цена old" vid="old_price">
                            <v-text-field
                                v-model="form.old_price"
                                :error-messages="errors[0]"
                                dense
                                label="Цена old"
                                outlined
                                type="number"/>
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <validation-provider v-slot="{errors}" class="flex-grow-1" name="Количество"
                                             vid="stock">
                            <v-text-field
                                v-model="form.stock"
                                :error-messages="errors[0]"
                                dense
                                label="Количество"
                                outlined
                                type="input"/>
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <validation-provider v-slot="{errors}" class="flex-grow-1" name="Sku"
                                             vid="sku">
                            <v-text-field
                                v-model="form.sku"
                                :error-messages="errors[0]"
                                dense
                                label="Sku"
                                outlined
                                type="text"/>
                        </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <validation-provider v-slot="{errors}" class="flex-grow-1" name="Unicode"
                                             vid="unicode">
                            <v-text-field
                                v-model="form.unicode"
                                :error-messages="errors[0]"
                                dense
                                label="Unicode"
                                outlined
                                type="text"/>
                        </validation-provider>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>


<script>
export default {
    name: 'product-info-form',
    props: {
        form: {
            type: Object
        }
    },
    data() {
        return {
            brands: [],
            categories: [],
            measures: [],
        }
    },
    watch: {
        "form.discount"() {
            if (!this.form.old_price)
                this.form.old_price = this.form.price;
            this.form.price = parseInt(this.form.old_price - ((this.form.old_price / 100) * this.form.discount));
        }
    },
    methods: {

        async getBrands() {
            try {
                const {data: {data}} = await this.$http.get('brands/list')
                this.brands = data
            } catch (e) {
            }
        },
        async getCategories() {
            try {
                const {data: {data}} = await this.$http.get('categories/parent-with-children')
                this.categories = data
            } catch (e) {
            }
        },
        async getMeasures() {
            try {
                const {data: {data}} = await this.$http.get('measure/list')
                this.measures = data
            } catch (e) {
            }
        },

        init() {
            this.getBrands()
            this.getCategories()
            this.getMeasures()
        },
    },
    computed: {
        subCategories: function () {
            const category = this.categories.find(item => item.id === this.form.p_category_id)
            if (category) return category.children
            return [];
        },
        filteredCategories() {
            return this.categories
        }
    },
    created() {
        this.init()
    }


}
</script>
