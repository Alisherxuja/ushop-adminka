<template>
  <div class="d-flex align-center ma-n1">
    <div class="pa-1" v-if="actions.view && can(canMixinView)">
      <v-btn @click="$emit('viewItem')" small color="primary" class="min-width-auto">
        <v-icon x-small>fas fa-eye</v-icon>
      </v-btn>
    </div>
    <div class="pa-1" v-if="actions.edit && can(canMixinEdit)">
      <v-btn @click="$emit('editItem')" small color="warning" class="min-width-auto">
        <v-icon x-small>fas fa-pencil-alt</v-icon>
      </v-btn>
    </div>
    <div class="pa-1" v-if="actions.delete && can(canMixinDelete)">
      <v-btn @click="dialog = true" small color="error" class="min-width-auto">
        <v-icon x-small>
          fas fa-trash
        </v-icon>
      </v-btn>
    </div>
    <v-dialog max-width="500px" v-model="dialog" v-if="actions.delete">
      <delete-dialog @close="dialog = false" @deleteItem="deleteItem"></delete-dialog>
    </v-dialog>
  </div>
</template>

<script>
import DeleteDialog from "../dialogs/DeleteDialog";

export default {
  name: "TableActions",
  components: {DeleteDialog},
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {
        return []
      }
    },
    actions: {
      type: Object,
      required: false,
      default: () => {
        return {
          view: true,
          edit: true,
          delete: true
        }
      }
    },
    canMixinEdit: {
      type: String
    },
    canMixinDelete: {
      type: String
    },
    canMixinView: {
      type: String
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    deleteItem() {
      this.dialog = false;
      this.$emit('deleteItem')
    }
  }
}
</script>

<style scoped>

</style>
