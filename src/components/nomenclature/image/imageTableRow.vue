<template>
  <div class="d-flex ma-n2">
    <div v-for="(size, index) in sizes"
         :key="`image-${index}`"
         class="pa-2 flex-grow-1">
      <v-card>
        <v-card-text
            class="image-table-td-wth-img position-relative">
          <span v-if="image[`${size.width}_${size.height}`].isChanged" class="notify-circle notify-circle-error"></span>
          <image-uploader
              ref="uploader"
              :height="size.height"
              :image="image[`${size.width}_${size.height}`].url"
              :original="image.original"
              :width="size.width"
              @crop-img="$emit('crop-img', {
                image: image[`${size.width}_${size.height}`].url,
                size
              })"
          />
        </v-card-text>
      </v-card>
    </div>
    <div class="pa-2 flex-grow-1 text-center">
      <v-card>
        <v-card-text class="position-relative">
          <span v-if="image.original.isChanged" class="notify-circle notify-circle-error"></span>
          <image-uploader
              ref="uploaderOriginal"
              :cropped="false"
              :image="image.original.url"
              :isUpdate="isUpdate"
          />
        </v-card-text>
      </v-card>
    </div>
    <div class="pa-2 flex-grow-1 text-center">
      <v-card>
        <v-card-text>
          <div class="d-flex mx-n2 position-relative">

            <div class="pa-2">
              <v-switch
                  v-model="image.isThumbnail"
                  class="mt-0"
                  dense
                  hide-details
                  label="Миниатюра"
              ></v-switch>
            </div>
            <div class="pa-2">
              <v-switch
                  v-model="image.isAvatar"
                  class="mt-0"
                  dense
                  hide-details
                  label="Аватар"
              ></v-switch>
            </div>
          </div>
          <div class="mt-2">
            <v-autocomplete
                v-model="image.n_feature_values_id"
                :items="features"
                dense
                item-text="value"
                item-value="id"
                label="Features"
                outlined
            >
              <template v-slot:item="data">
                <template>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.value"></v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
          </div>
          <div class="d-flex">
            <v-btn :loading="loading" class="mr-2 flex-grow-1" color="primary" @click="submit">Сохранить</v-btn>
            <v-btn class="flex-grow-1" color="error" @click="removeRow">
              Удалить
            </v-btn>
          </div>

        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
  import imageUploader from "./imageUploader";
  import {IMAGE_SIZES} from "@/constants";

  export default {
    props: {
      image: Object,
      sizes: {
        type: Array
      },
      nomenclature_id: {},
      features: Array
    },
    data() {
      return {
        isChanged: false,
        loading: false
      }
    },
    computed: {
      isUpdate() {
        return !!this.image.id
      },
      id() {
        return this.image.id
      }
    },
    watch: {
      "image.isAvatar"(val) {
        if (val) {
          this.$emit('changeImageStatus', 'avatar')
        }
        this.changeHandler()
      },
      "image.isThumbnail"(val) {
        if (val) {
          // this.$emit('changeImageStatus', 'thumbnail')
        }
        this.changeHandler()
      },
      "image.n_feature_values_id"() {
        this.changeHandler()
      }
    },
    methods: {
      changeHandler() {
        this.isChanged = true;
      },
      removeRow() {
        this.$emit('removeRow', this.id)
      },
      getConfig() {
        return {
          isAvatar: this.image.isAvatar,
          isThumbnail: this.image.isThumbnail,
          nFeatureValuesId: this.image.n_feature_values_id
        }
      },
      getData() {
        const formData = new FormData()
        IMAGE_SIZES.forEach(item => {
          const size = `${item.width}_${item.height}`;
          if (this.image[size].blob) {
            this.image[size].isChanged = false
            formData.append(`s${size}`, this.image[size].blob)
          }
        })
        if (this.image.original.blob) {
          this.image.original.isChanged = false
          formData.append('image', this.image.original.blob)
        }
        formData.append('is_avatar', this.image.isAvatar)
        formData.append('is_thumbnail', this.image.isThumbnail)
        formData.append('n_feature_values_id', this.image.n_feature_values_id)
        formData.append('nomenclature_id', this.nomenclature_id);
        return formData
      },
      async create(formData) {
        await this.$http.post('nomenclature-attachment', formData)
      },
      update(formData, id) {
        formData.append('_method', 'put')
        this.$http.post(`nomenclature-attachment/${id}`, formData)
      },
      async submit() {
        const formData = this.getData()
        this.loading = true;
        try {
          if (this.image.id) {
            await this.update(formData, this.image.id)
          } else {
            await this.create(formData)
          }
          this.$store.commit('showSnackbar', 'Успешно сохранено')
        }catch (e) {

        } finally {
          this.loading = false
        }

      },
    },
    components: {
      imageUploader,
    }
  }
</script>
