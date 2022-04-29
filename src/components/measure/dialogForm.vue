<template>
  <v-card>
    <v-card-title class="headline">Add new Category</v-card-title>
    <v-card-text>
      <v-container>
        <ValidationObserver v-slot="{handleSubmit}" ref="obs">
          <form @submit.prevent="handleSubmit(save)">
            <v-toolbar flat color="white">
              <v-spacer/>
              <v-switch :true-value="10" :false-value="0" v-model="formData.status" color="primary" class="ma-2" label="Active"
                        style="margin-top: 22px !important;"/>
            </v-toolbar>
            <v-row>
              <v-col md="4">
                <validation-provider name="name_en" v-slot="{errors}">
                  <v-text-field
                    :error-messages="errors[0]"
                    item-text="name"
                    outlined
                    dense
                    clearable
                    label="Name en"
                    v-model="formData.name_en"
                  />
                </validation-provider>
              </v-col>
              <v-col md="4">
                <validation-provider name="name_ru" v-slot="{errors}">
                  <v-text-field
                    :error-messages="errors[0]"
                    item-text="name"
                    outlined
                    dense
                    clearable
                    label="Name ru"
                    v-model="formData.name_ru"
                  />
                </validation-provider>
              </v-col>
              <v-col md="4">
                <validation-provider name="name_uz" v-slot="{errors}">
                  <v-text-field
                    :error-messages="errors[0]"
                    item-text="name"
                    outlined
                    dense
                    clearable
                    label="Name uz"
                    v-model="formData.name_uz"
                  />
                </validation-provider>
              </v-col>
              <v-col md="4">
                <validation-provider name="cargo_price" v-slot="{errors}">
                  <v-text-field
                    :error-messages="errors[0]"
                    item-text="cargo_price"
                    outlined
                    dense
                    clearable
                    label="Стоимость груза в $"
                    v-model="formData.cargo_price"
                  />
                </validation-provider>
              </v-col>
              <v-col md="4">
                <validation-provider name="type" v-slot="{errors}">
                  <v-autocomplete
                    :error-messages="errors[0]"
                    item-text="name"
                    outlined
                    dense
                    clearable
                    label="Type"
                    item-value="id"
                    :items="$store.state.genderTypes"
                    v-model="formData.type"
                  />
                </validation-provider>
              </v-col>
              <v-col md="4">
                <validation-provider name="parent_id" v-slot="{errors}">
                  <v-autocomplete
                    :error-messages="errors[0]"
                    item-text="name"
                    outlined
                    dense
                    clearable
                    label="Parent"
                    :items="filteredCategories"
                    item-value="id"
                    v-model="formData.parent_id"
                    :loading="!ready"
                  />
                </validation-provider>
              </v-col>
              <v-col md="4" v-if="accessToAddBrands">
                <validation-provider name="brands" v-slot="{errors}">
                  <v-autocomplete
                    :error-messages="errors[0]"
                    item-text="name"
                    outlined
                    dense
                    clearable
                    label="Brands"
                    item-value="id"
                    :items="brands"
                    multiple
                    v-model="formData.brands"
                    :loading="!ready"
                  />
                </validation-provider>
              </v-col>
              <v-col md="4">
                <validation-provider name="image" v-slot="{errors}">
                  <v-uploader
                    :error-message="errors[0]"
                    label-text="Image"
                    v-model="formData.image"/>
                </validation-provider>
              </v-col>
            </v-row>
          </form>
        </ValidationObserver>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <div class="d-flex justify-end" style="width: 100%">
        <v-btn color="primary" @click="save" dark class="mb-2" :loading="loading" type="submit">
          Сохранить
        </v-btn>
        <v-btn
          color="red darken-1"
          text
          @click="$emit('closeDialog')"
        >
          Cancel
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import {getErrorMessages} from "@/utils";

export default {
  props: ["type", "category"],
  data() {
    return {
      formData: {
        name_en: '',
        name_ru: '',
        name_uz: '',
        parent_id: this.category,
        type: this.type,
        image: {},
        brands: [],
        status: 0
      },
      loading: false,
      ready: false,
      categories: [],
      brands: []
    }
  },
  watch: {
    accessToAddBrands(val) {
      if (!val) {
        this.formData.brands = []
      }
    }
  },
  computed: {
    accessToAddBrands() {
      return this.formData.parent_id
    },
    filteredCategories() {
      return this.categories.filter(item => {
        return item.type === this.formData.type
      })
    },
  },
  methods: {
    getCategories() {
      return new Promise((resolve) => {
        this.$http.get('categories/parent')
          .then(res => {
            this.categories = res.data.data
          })
          .catch(err => this.$store.commit('showErrorMessage', err))
          .finally(() => resolve())
      })
    },
    getBrands() {
      return new Promise(resolve => {
        this.$http.get('brands/list').then(res => {
          this.brands = res.data.data
        })
          .catch(err => this.$store.commit('showErrorMessage', err))
          .finally(() => resolve())
      })
    },
    save() {
      this.create()
    },
    prepareData() {
      const data = new FormData()
      for (let prop in this.formData) {
        if (prop === 'image') {
          if (this.formData[prop].file) {
            data.append(prop, this.formData[prop].file)
          } else if (this.formData[prop].file === null && this.formData[prop].url === null) {
            data.append(prop, null)
          }
        } else if (prop === 'brands') {
          this.formData[prop].forEach(item => {
            data.append(prop + '[]', item)
          })
        } else {
          data.append(prop, this.formData[prop])
        }
      }
      return data
    },
    create() {
      const data = this.prepareData()
      this.loading = true;
      this.$http.post('categories', data)
        .then(res => {
          if (res.data.success) {
            this.$store.commit('showSnackbar', 'Saved successfully')
            this.$emit('save', res.data.data);
          }

        })
        .catch(err => {
          const {obs} = this.$refs
          obs.setErrors(getErrorMessages(err))
          this.$store.commit('showErrorMessage', err)
        })
        .finally(_ => {
          this.loading = false;
        })
    },
    init() {
      this.$store.commit('showLoading');
      const promisesData = [
        this.getCategories(),
        this.getBrands()
      ]
      Promise.all(promisesData).then(() => {
        this.$store.commit('clearLoading')
        this.ready = true
      })
    }
  },
  created() {
    this.init()
  }
}
</script>

<style scoped>

</style>
