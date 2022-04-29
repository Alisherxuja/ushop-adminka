<template>
  <custom-table
      title="Payment Type"
      resource="payment-types"
      :headers="headers"
      :can-mixin="'admin.payment-types.create'"
      :can-mixin-delete="'admin.payment-types.destroy'"
      :can-mixin-edit="'admin.payment-types.update'"
  >
    <template v-slot:item.logo_url="{item}">
      <v-img :lazy-src="item.logo_url" :src="item.logo_url" height="114" width="78" aspect-ratio="1"></v-img>
    </template>
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
          text: 'Картинка',
          value: 'logo_url',
        },
        {
          text: 'status',
          value: 'status',
        },
        {
          text: 'type',
          value: 'type',
        }
      ]
    }
  },
  methods: {}
}
</script>
