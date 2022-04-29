<template>
  <v-dialog :value="value" persistent width="1100" @click:outside="close">
    <v-card>
      <v-card-text>
        <div class="pt-16">
          <img ref="cropperImage" :src="img" :style="{minWidth: minWidth +'px', minHeight: minHeight + 'px'}"
               class="cropped-img">
        </div>
        <div class="text-right mt-4">
          <v-btn class="mr-2" color="error" outlined @click="close">Отмена</v-btn>
          <v-btn class="mr-2" v-if="clearable" color="warning" @click="$emit('clear')">Сброс</v-btn>
          <v-btn color="primary" @click="cropHandler">Сохранить</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

let cropper = null

export default {
  name: 'v-cropper',
  props: {
    'value':{},
    'img':{},
    'aspectRatio':{},
    'minWidth':{},
    'maxWidth':{},
    'maxHeight':{},
    'minHeight':{},
    clearable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    img() {
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    cropHandler() {
      if (cropper) {
        const canvas = cropper.getCroppedCanvas({
          width: this.minWidth,
          height: this.minHeight,
          fillColor: '#fff'
        })
        const base64 = canvas.toDataURL('image/jpeg')
        // const image = document.createElement('img')
        // image.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 9999'
        // image.src = base64
        // document.body.append(image)
        canvas.toBlob(blob => {
          this.$emit('cropped', {
            base64,
            blob
          })
        }, 'image/jpeg')
      }
    },
    init() {
      const {cropperImage} = this.$refs
      if (cropperImage) {
        if (!cropper) {
          cropper = new Cropper(cropperImage, {
            aspectRatio: this.aspectRatio,
            cropBoxResizable: false,
            dragMode: false
          })
        } else {
          this.$nextTick(() => {
            cropper.clear()
            cropper.replace(this.img)
            cropper.setAspectRatio(this.aspectRatio)
          })
        }
      }

    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    if (cropper) {
      cropper.destroy()
    }
  }
};
</script>

<style>
.cropped-img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
  margin: auto;
}

.cropper-modal {
  background: #fff;
}

.cropper-container {
  margin: auto;
}
</style>
