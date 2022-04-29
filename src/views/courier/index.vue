<template>
    <custom-table
        title="Courier"
        resource="courier"
        :headers="headers"
        :can-mixin="'admin.courier.create'"
        :can-mixin-delete="'admin.courier.destroy'"
        :can-mixin-edit="'admin.courier.update'"
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
        <template v-slot:item.car="{item}">
            {{ item.car_number }} | {{ item.car_type }} | {{ item.car_model }}
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
                    text: 'phone',
                    value: 'phone',
                },
                {
                    text: 'car',
                    value: 'car',
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
