<template>
  <div class="pb-6">
    <validation-observer ref="formObserver" class="pl-2" tag="div">
      <validation-provider v-slot="{errors}" name="images">
        <div class="image-table-wrap">
          <div class="d-flex flex-wrap">
            <h3 class="mb-2 mr-5">Изображение</h3>
            <v-btn class="min-width-auto mr-2" color="primary" height="25" width="25" x-small
                   @click="$refs['inputFile'].click()">
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
            <v-btn :loading="parserImagesLoading" class="min-width-auto mr-2" color="success" height="25"
                   x-small @click="getParserAttachments">
              Parser Images
            </v-btn>
            <div class="flex-grow-1"/>
            <v-btn v-if="allImages.length" class="min-width-auto mr-2" color="error"
                   height="25"
                   x-small @click="deleteAllImageDialog = true">Удалить все картинки
            </v-btn>
          </div>
          <div class="mb-2">
            <small class="error--text">Пожалуйста, загрузите изображение больше по размеру 528x528, меньше
              512kb. Расширение изображение должен быть JPEG</small>
          </div>
          <input ref="inputFile" class="d-none" multiple type="file" @change="browseFileHandler">
          <image-table-row
              v-for="(imageRow, index) in images"
              :key="`image${index}`"
              ref="tableRow"
              :features="features"
              :image="imageRow"
              :nomenclature_id="nomenclature_id"
              :sizes="sizes"
              @removeRow="id => confirmRemoveHandler(paginationCurrentFirstIndex + index, id)"
              @crop-img="({image, size}) => cropImageHandler({image, size, index: paginationCurrentFirstIndex + index})"/>
        </div>
      </validation-provider>
      <div class="mt-7">
        <v-btn class="mr-2" color="primary" small style="height: 38px" @click="$emit('input', value-1)">Назад</v-btn>
      </div>
    </validation-observer>

    <warning-dialog
        v-model="dialog"
        @apply="applyDeleteImageRowHandler"
    ></warning-dialog>

    <warning-dialog
        v-model="deleteAllImageDialog"
        description="Вы действительно хотите удалить все картинки! Отменить это действие невозможно!!"
        @apply="deleteAllImages"
    ></warning-dialog>
    <v-cropper
        v-model="croppedImg.dialog"
        :aspect-ratio="croppedImg.size.width/croppedImg.size.height"
        :img="croppedImg.image"
        :min-height="croppedImg.size.height"
        :min-width="croppedImg.size.width"
        @clear="clearCropImgHandler"
        @cropped="croppedImgHandler"/>
    <v-pagination
        v-show="imagePerPage > 1"
        v-model="imagePage" :length="imagePerPage"
        class="mt-4"
        style="position:fixed; bottom: 10px; z-index: 5; left: 50%; transform: translateX(-50%)"></v-pagination>

  </div>
</template>

<script>
  import stepMixin from "./stepMixin";
  import imageTableRow from "./image/imageTableRow";
  import {parseFileToDataUrl, uploadFileMaxSize, uploadImageMinSize, validateFileType} from "../../utils";
  import warningDialog from "@/components/ui/prompt/warning-dialog"
  import {blobToDataUrl, clearUploadInput, fetchBlobByUrl} from "@/utils";
  import VCropper from "@/components/nomenclature/v-cropper";
  import {IMAGE_SIZES} from "@/constants";

  function getSizeKey(size) {
    return `${size.width}_${size.height}`
  }

  const defaultCroppedImg = {
    dialog: false,
    index: null,
    image: null,
    size: {
      width: null,
      height: null
    }
  }


  export default {
    props: {
      value: {},
      feature_values_id: {
        type: Number || null
      },
      nomenclature_id: {
        type: Number || null
      }
    },
    data() {
      return {
        deleteAllImageDialog: false,
        deleteImage: null,
        croppedImg: {...defaultCroppedImg},
        sizes: IMAGE_SIZES,
        dialog: false,
        allImages: [],
        imageLimit: 2,
        imagePage: 1,
        parserImagesLoading: false,
        features: [],
        types: {}
      }
    },
    watch: {
      value(val) {
        if (val === 3) {
          this.init()
        }
      },
    },
    methods: {
      async deleteAllImages() {
        this.$showLoading()
        try {
          await this.$http.delete(`nomenclature-attachment/batch/${this.nomenclature_id}`)

        } catch (e) {

        }
        this.$clearLoading()
        this.allImages = []
      },
      clearCropImgHandler() {
        const {index, size: {width, height}} = this.croppedImg
        let image = this.allImages[index]
        image[`${width}_${height}`] = {
          url: image.original.url,
          blob: null
        }
        this.allImages.splice(index, 1, image)
        this.croppedImg.image = image.original.url
      },
      croppedImgHandler({base64, blob}) {
        const {index, size: {width, height}} = this.croppedImg
        let image = this.allImages[index]
        image[`${width}_${height}`] = {
          url: base64,
          blob,
          isChanged: true
        }
        this.allImages.splice(index, 1, image)
        this.croppedImg = {...defaultCroppedImg}
      },
      cropImageHandler({image, index, size}) {
        this.croppedImg = {
          dialog: true,
          image,
          index,
          size: size
        }
      },
      async applyDeleteImageRowHandler() {
        if (this.deleteImage.id) {
          this.loading = true
          try {
            await this.$http.delete(`nomenclature-attachment/${this.deleteImage.id}`)
            this.$store.commit('showSnackbar', 'Image deleted')
          } catch (e) {
            this.$store.commit('setErrorMessage', e)
          }
          this.loading = false
        }
        if (this.imagePerPage === this.imagePage && this.images.length === 1) {
          this.imagePage--
        }
        this.allImages.splice(this.deleteImage.index, 1)
        this.deleteImage = null
      },
      confirmRemoveHandler(index, id = null) {
        this.deleteImage = {index, id};
        this.dialog = true
      },
      browseFileHandler(e) {
        const browseFiles = e.target.files
        browseFiles.forEach(async (blob) => {
          const dataUrl = await parseFileToDataUrl(blob)
          const validateImage = [
            {
              name: 'type',
              message: 'Тип изображения не поддерживается, пожалуйста, загрузите JPEG изображение',
              valid: validateFileType(blob, "image/jpeg"),
            },
            {
              name: 'size',
              message: 'Размер изображения слишком большое, пожалуйста, загрузите изображение менще 512kb',
              valid: uploadFileMaxSize(blob, 512)
            },
            {
              name: 'format',
              valid: await uploadImageMinSize(blob, 528),
              message: 'Изображения по размеру не валидная, пожалуйста, загрузите изображение не меньше 528x528'
            }
          ]
          const imageValidError = validateImage.find(item => {
            return !item.valid
          })

          if (!imageValidError) {
            const image = {
              isAvatar: false,
              isThumbnail: false,
            }

            IMAGE_SIZES.forEach(({width, height}) => {
              image[`${width}_${height}`] = {
                url: dataUrl,
                blob,
                isChanged: true
              }
            })
            image.original = {
              url: dataUrl,
              blob,
              isChanged: true
            }
            this.allImages.push(image)
          } else {
            this.$store.commit('showSnackbar', imageValidError.message)
          }
        })
        clearUploadInput(e.target)
      },
      async getData() {
        try {
          const {data: {data}} = await this.$http.get('nomenclature-attachment', {params: {nomenclature_id: this.nomenclatureId}})
          this.allImages = data.map(item => {
            const image = {};
            image.id = item.id
            if (image) {
              image.original = {
                url: item.image,
                blob: null
              }
            }
            if (item['s78_114']) {
              image['78_114'] = {
                url: item['s78_114'],
                blob: null
              }
            }
            if (item['s254_380']) {
              image['254_380'] = {
                url: item['s254_380'],
                blob: null
              }
            }
            if (item['s415_622']) {
              image['415_622'] = {
                url: item['s415_622'],
                blob: null
              }
            }
            image.isAvatar = item['is_avatar']
            image.isThumbnail = item['is_thumbnail']
            image.isChanged = false
            if (item['n_feature_values_id']) {
              image['n_feature_values_id'] = item['n_feature_values_id']
            }
            return image
          })
        } catch (e) {
          this.$store.commit('showErrorMessage', e);
        }
      },
      init() {
        this.initLoading = true;
        let request = [this.getFeatures()];
        if (this.isUpdate) {
          request.push(this.getData());
        }
        Promise.all(request).finally(() => {
          this.initLoading = false
        });
      },
      async getFeatures() {
        const {data: {data}} = await this.$http.get('nomenclature-feature-values/features-children/' + this.nomenclatureId)
        this.features = data.reduce((subcategory, category, index) => {
          subcategory.push({header: category.name})
          category.featureValues.forEach(item => {
            item.group = category.name
            subcategory.push(item)
          })
          if (index + 1 < data.length)
            subcategory.push({divider: true})
          return subcategory
        }, []);
      },
      async getParserAttachments() {
        this.parserImagesLoading = true;
        const fetchBlob = (url, size, index) => {
          return new Promise(async (resolve, reject) => {
            const blob = await fetchBlobByUrl(url)
            const dataUrl = await blobToDataUrl(blob)
            resolve({blob, size, index, url: dataUrl})
          })
        }
        try {
          const {data: {data}} = await this.$http.get(`nomenclatures/parser-images/${this.nomenclature_id}`)
          let requests = data.map((item, attachmentIndex) => {
            let request = Object.entries(item).map(([key, value]) => {
              if (key === 'images') {
                return fetchBlob(value, 'original', attachmentIndex)
              } else {
                const [width, height] = key.substring(1).split('_')
                return fetchBlob(value, `${width}_${height}`, attachmentIndex)
              }
            }, {})
            return Promise.all(request)
          })
          const allData = await Promise.all(requests)
          let parserImages = []
          allData.forEach((item, index) => {
            item.forEach(({index, blob, size, url}) => {
              if (!parserImages[index]) {
                parserImages[index] = {}
              }
              parserImages[index][size] = {
                blob,
                url,
                isChanged: true,
              }
            })
            parserImages[index].isThumbnail = false
            parserImages[index].isAvatar = false
            parserImages[index].n_feature_values_id = null
          })
          this.allImages = [...this.allImages, ...parserImages];
        } catch (e) {
          console.error(e)
        }
        this.parserImagesLoading = false;

      }
    },
    computed: {
      paginationCurrentFirstIndex() {
        return (this.imagePage - 1) * this.imageLimit
      },
      images() {
        return this.allImages.slice(this.imageLimit * (this.imagePage - 1), this.imageLimit * this.imagePage)
      },
      imagePerPage() {
        return Math.ceil(this.allImages.length / this.imageLimit)
      }
    },
    components: {
      VCropper,
      imageTableRow,
      warningDialog
    },
    mixins: [stepMixin],
  }

</script>

