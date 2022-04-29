<template>
    <custom-table
        :headers="headers"
        :can-mixin="'admin.locations.create'"
        :can-mixin-delete="'admin.locations.destroy'"
        :can-mixin-edit="'admin.locations.update'"
        resource="locations">
        <template v-slot:item.parent="{item}">
            {{ item['parent_name'] | ifNone }}
        </template>
        <template v-slot:item.status="{item}">
            {{ item.status | status }}
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
    data() {
        return {
            headers: [
                {
                    text: 'Название',
                    value: 'name',
                    filterable: {
                        value: ''
                    }
                },
                {
                    text: 'Регион',
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
        }
    },
    methods: {
        init() {

        }
    }
}
</script>
