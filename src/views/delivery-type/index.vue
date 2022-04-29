<template>
    <custom-table
        title="Delivery Type"
        resource="delivery-types"
        :headers="headers"
        :can-mixin="'admin.delivery-types.create'"
        :can-mixin-delete="'admin.delivery-types.destroy'"
        :can-mixin-edit="'admin.delivery-types.update'"
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
        <template v-slot:item.status="{item}">
            {{ item.status | status }}
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
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Description',
                    value: 'description',
                },
                {
                    text: 'status',
                    value: 'status',
                }
            ]
        }
    },
    methods: {}
}
</script>
