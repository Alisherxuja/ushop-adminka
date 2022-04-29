<template>
    <div>
        <custom-table
            :filters="filters"
            :add-filters="addFilter"
            :can-mixin="'admin.products.store'"
            :can-mixin-delete="'admin.products.destroy'"
            :can-mixin-edit="'admin.products.update'"
            resource="products"
            item-key="id"
            :headers="headers">

            <template v-slot:button.prepend>
                <v-card style="margin-bottom: 8px; margin-right: 8px">
                    <div style="display: flex">
                        <v-select
                            v-model="status"
                            :items="$store.state.statusProduct"
                            placeholder="Поиск по статус"
                            dense
                            item-value="value"
                            item-text="text"
                            style="height: 36px; width: 300px"
                            outlined
                            @input="searchByStatus"
                            clearable
                            :hide-details="true">
                        </v-select>
                    </div>
                </v-card>
            </template>
            <template v-slot:item.avatar="{item}">
                <v-img :lazy-src="item.avatar" :src="item.avatar" height="114" width="78" aspect-ratio="1"></v-img>
            </template>
            <template v-slot:item.id="{item}">
                <div class="d-flex justify-space-between align-center">
                    <div v-if="item.status === 5" class="circle pulse red"></div>
                    <div style="margin-left: 8px;">
                        {{ item.id }}
                    </div>
                </div>
            </template>
            <template v-slot:item.name="{item}">
                <div class="d-flex justify-space-between align-center">
                    <div style="margin-left: 8px;">
                        {{ item.name }}
                        <v-icon v-if="item.is_premium" style="color: goldenrod">fas fa-crown</v-icon>
                    </div>
                </div>
            </template>
            <template v-slot:item.stock="{item}">
                {{ item.stock + ' ' + item.measure_name }}
            </template>
            <template v-slot:item.price="{item}">
                {{ item.price + ' | ' + item.old_price }}
            </template>
            <template v-slot:filter.status="{index}">
                <v-autocomplete
                    clearable
                    :hide-details="true"
                    outlined
                    dense
                    label="Status"
                    item-value="id"
                    v-model="headers[index].filterable.value"
                    :items="$store.state.statusProduct">
                </v-autocomplete>
            </template>
        </custom-table>
    </div>
</template>

<script>

export default {
    data() {
        return {
            headers: [
                {
                    text: '№',
                    value: 'id'
                },
                {
                    text: 'Картинка',
                    value: 'avatar'
                },
                {
                    text: 'Артикул',
                    value: 'sku',
                    filterable: {
                        value: null
                    }
                },
                {
                    text: 'Имя',
                    value: 'name',
                    filterable: {
                        name: 'name',
                        value: ''
                    }
                },
                {
                    text: 'Бренд',
                    value: 'brand',
                    filterable: {
                        value: null
                    },
                },
                {
                    text: 'Категория',
                    value: 'category',
                    filterable: {
                        value: null
                    }
                },
                {
                    text: 'Цена',
                    value: 'price',
                    filterable: {
                        value: null
                    }
                },
                {
                    text: 'Скидка',
                    value: 'discount',
                    filterable: {
                        value: null
                    }
                },
                {
                    text: 'Кол. заказов',
                    value: 'orders_count'
                },
                {
                    text: 'Остаток',
                    value: 'stock',
                },
            ],
            filters: [],
            addFilter: [],
            itemForChangeQuantity: null,
            quantityModal: false,
            link: '',
            status: ''
        }
    },
    methods: {
        searchByStatus() {
            this.addFilter.push({
                name: 'status',
                value: this.status
            });
        },
        async deleteProduct(id) {
            this.$showLoading()
            try {
                await this.$http.delete(`/products/${id}`)
            } catch (e) {

            } finally {
                this.$clearLoading()
            }
        }
    }
}


</script>
