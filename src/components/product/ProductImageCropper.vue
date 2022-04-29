<template>
  <div>
    <v-cropper :clearable="false" @cropped="croppedImage" :img="image" v-model="dialogValue"/>
    <input accept="image/jpeg" @change="uploadedFile" class="d-none" type="file" ref="fileInput">
  </div>
</template>


<script>
import {parseFileToDataUrl} from "@/utils";
import 'cropperjs/dist/cropper.min.css'
import VCropper from "@/components/nomenclature/v-cropper";
import {uploadImageFormat} from "../../constants";

export default {
  name: 'product-image-cropper',
  components: {VCropper},
  props: {
    value: {
      type: Boolean
    },
    images: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      image: null
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    browseFile() {
      const {fileInput} = this.$refs
      fileInput.click()
    },
    clearFileInput() {
      const {fileInput} = this.$refs
      fileInput.setAttribute('type', 'text')
      fileInput.setAttribute('type', 'file')
    },

    async croppedImage(data) {
      this.$showLoading()
      try {
        const formData = new FormData()
        formData.append('image', data.blob, uploadImageFormat)
        const {data: {data: response}} = await this.$http.post('products/upload', formData)
        this.$emit('cropped', {path: response.path, url: data.base64})
        this.close()
      } catch (e) {
        this.$store.commit('showErrorMessage', e)
      } finally {
        this.$clearLoading()
      }
    },
    async uploadedFile(e) {
      const uploadedFile = e.target.files[0]
      this.clearFileInput()
      this.image = null
      if (uploadedFile) {
        this.$emit('input', true)
          this.image = await parseFileToDataUrl(uploadedFile)
      }
    }
  },
  computed: {
    dialogValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
