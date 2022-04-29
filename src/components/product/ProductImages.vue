<template>
  <div class="d-flex flex-wrap">
    <div v-if="uploadFile" key="upload-file-card-element" class="pa-2">
      <v-card class="cur-p" height="130" width="130" @click="$emit('onBrowseFile')">
        <v-card-text class="justify-center d-flex align-center" style="height: 100%">+</v-card-text>
      </v-card>
    </div>
    <draggable
        :value="images"
        tag="div"
        @input="data => $emit('update:images', data)"
    >
      <transition-group class="d-flex flex-wrap" name="flip-list" tag="div">
        <div
            v-for="(image, index) in images"
            :key="`tg${index}`"
            class="pa-2"
        >
          <v-card>
            <v-card-text>
              <v-img :src="image.url" class="rounded" height="100px" width="100px"/>
              <v-btn absolute bottom class="rounded"
                     color="error" style="transform: translateX(-50%); left: 50%;" x-small
                     @click="$emit('deleteImage', index)">
                <v-icon>fas fa-times</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>


<script>
import draggable from 'vuedraggable'

export default {
  name: 'product-images',
  props: {
    uploadFile: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: []
    }
  },
  components: {
    draggable
  },
  computed: {
    allImages: {
      get() {
        return this.images
      },
      set(val) {
        this.$emit('update:images', val)
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
}
</script>

<style>
.flip-list-move {
  transition: all .51s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
