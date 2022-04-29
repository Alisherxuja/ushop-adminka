<template>
  <div v-if="image" key="thumbImg" ref="imgWrap" class="image-table-card-thumb">
    <v-img
        :height="height"
        :src="image"
        :width="width"
        class="rounded"
        style="margin: auto"/>
    <div class="text-center mt-2">
      <v-btn v-if="cropped" color="primary" height="25" style="min-width: auto" width="25" x-small
             @click.stop="$emit('crop-img')">
        <v-icon>fas fa-cut</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      image: String || undefined || null,
      width: Number || String,
      height: Number || String,
      cropped: {
        type: Boolean,
        default: true
      }
    },
    methods: {},
  }
</script>
