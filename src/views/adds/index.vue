<template>
    <custom-table
        title="Adds"
        resource="adds"
        :headers="headers"
        :can-mixin="'admin.adds.create'"
        :can-mixin-delete="'admin.adds.destroy'"
        :can-mixin-edit="'admin.adds.update'"
    >
        <template v-slot:filter.status="{index}">
            <v-autocomplete
                clearable
                outlined
                dense
                v-model="headers[index].filterable.value"
                :items="$store.state.status"
                item-value="id"
                :hide-details="true"
            ></v-autocomplete>
        </template>
        <template v-slot:item.status="{item}">{{ item.status | status }}</template>
        <template v-slot:item.image_url="{item}">
            <v-img :lazy-src="item.image_url" :src="item.image_url" height="114" width="78" aspect-ratio="1"></v-img>
        </template>
    </custom-table>
</template>


<script>
export default {
    data() {
        return {
            headers: [
                {
                    text: 'Id#',
                    value: 'id'
                },
                {
                    text: 'Logo',
                    value: 'image_url'
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
                    text: 'Url',
                    value: 'url'
                },
                {
                    text: 'Статус',
                    value: 'status',
                    filterable: {
                        type: 'text-field',
                        name: 'status',
                        items: this.$store.state.status,
                        value: null
                    }
                }
            ]
        }
    },
    methods: {}
}
</script>
