<template>
  <custom-table
      title="Banners"
      resource="banners"
      :headers="headers"
      :can-mixin="'admin.banner.create'"
      :can-mixin-delete="'admin.banner.destroy'"
      :can-mixin-edit="'admin.banner.update'"
  >
    <template v-slot:item.image_url="{item}">
      <v-img :lazy-src="item.image_url" :src="item.image_url" height="114" width="78" aspect-ratio="1"></v-img>
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
          text: 'Картинка',
          value: 'image_url',
        },
        {
          text: 'status',
          value: 'status',
        },
        {
          text: 'is_main',
          value: 'is_main',
        }
      ]
    }
  },
  methods: {}
}
</script>
