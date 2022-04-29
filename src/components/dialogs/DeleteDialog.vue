<template>
  <v-card>
    <v-card-title class="headline">Хотите удалить?</v-card-title>
    <v-card-text>Вы уверены, что хотите удалить этот элемент?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')" color="red darken-1" text>Отмена</v-btn>
      <v-btn @click="$emit('deleteItem')" color="success darken-1" :loading="loading">Удалить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DeleteDialog",
  props: {
    loading: Boolean
  }
}
</script>

<style scoped>

</style>
