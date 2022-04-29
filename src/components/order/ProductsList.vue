<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="products"
            disable-sort
            disable-filtering
            disable-pagination
            class="mt-4"
            hide-default-footer>
            <template #item.avatar="{item}">
                <v-img :lazy-src="item.avatar" :src="item.avatar" height="114" width="78" aspect-ratio="1"></v-img>
            </template>
            <template #item.name="{item}" style="width: 150px">
                {{ item.name }}
            </template>
            <template #item.price="{item}">{{ item.price|money }}</template>
            <template #item.total="{item}">{{ (item.price * item.qty)|money }}</template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    name: "ProductsList",
    props: {
        products: {
            type: Array,
            required: true
        },
        order: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            headers: [
                {
                    text: 'Фото',
                    value: 'avatar'
                },
                {
                    text: 'Наименование',
                    value: 'name',
                    width: '175'
                },
                {
                    text: 'Бренд',
                    value: 'brand_name'
                },
                {
                    text: 'Category',
                    value: 'category_name'
                },
                {
                    text: 'Цена',
                    value: 'price'  
                },
                {
                    text: 'Кол-во',
                    value: 'qty'
                },
                {
                    text: 'Общая цена',
                    value: 'total'
                }
            ],
        }
    }
}
</script>

<style scoped>

</style>
