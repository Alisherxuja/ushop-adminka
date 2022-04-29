<template>
    <custom-table
        :headers="headers"
        :can-mixin="'admin.categories.create'"
        :can-mixin-delete="'admin.categories.destroy'"
        :can-mixin-edit="'admin.categories.update'"
        resource="categories">
        <template v-slot:item.image_url="{item}">
            <v-img :lazy-src="item.image_url" :src="item.image_url" height="114" width="78" aspect-ratio="1"></v-img>
        </template>
        <template v-slot:item.status="{item}">
            {{ item.status | status }}
        </template>
        <template v-slot:item.parent_name="{item}">
            {{ item.parent_name }}
        </template>
        <template v-slot:filter.status="{index, item}">
            <v-autocomplete
                clearable
                :label="item.text"
                outlined
                dense
                v-model="headers[index].filterable.value"
                :items="$store.state.status"
                item-value="id"
                :hide-details="true"/>
        </template>
    </custom-table>
</template>

<script>
export default {
    data: () => ({
        test: '',
        headers: [
            {
                text: 'Id',
                value: 'id'
            },
            {
                text: 'Image',
                value: 'image_url'
            },
            {
                text: 'Имя',
                value: 'name_ru',
                filterable: {
                    name: 'name',
                    value: ''
                }
            },
            {
                text: 'Родитель',
                value: 'parent_name',
                filterable: {
                    value: null
                }
            },
            {
                text: 'Статус',
                value: 'status',
                filterable: {
                    value: null
                }
            }
        ]
    }),
}
</script>
