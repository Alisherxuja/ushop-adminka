<template>
    <custom-table
        :headers="headers"
        :can-mixin="'admin.measure.create'"
        :can-mixin-delete="'admin.measure.destroy'"
        :can-mixin-edit="'admin.measure.update'"
        resource="measure">
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
    data: () => ({
        test: '',
        headers: [
            {
                text: 'Id',
                value: 'id'
            },
            {
                text: 'Имя',
                value: 'name',
            },
            {
                text: 'symbol',
                value: 'symbol_ru',
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
