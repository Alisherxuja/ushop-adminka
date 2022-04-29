<template>
  <div>
    <div class="d-flex mb-2">
      <v-btn v-if="nomenclature.parser_url" :href="nomenclature.parser_url" class="mr-4" color="primary"
             target="_blank">trendyol.com
      </v-btn>
      <v-btn :href="'http://v1.outlas.uz'+nomenclature.outlas_url" color="primary" target="_blank">outlas.uz</v-btn>
    </div>
    <v-switch
        v-model="nomenclature.status"
        :false-value="0"
        :true-value="10"
        label="Статус"
    ></v-switch>
    <validation-observer v-if="!initLoading" ref="formObserver" v-slot="{handleSubmit}" tag="div">
      <form @submit.prevent="handleSubmit(submit)">
        <v-row>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Имя en" rules="required" vid="name_en">
              <v-text-field
                  v-model="nomenclature.name_en"
                  :error-messages="errors[0]"
                  dense
                  label="Имя en"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Имя ru" rules="required" vid="name_ru">
              <v-text-field
                  v-model="nomenclature.name_ru"
                  :error-messages="errors[0]"
                  dense
                  label="Имя ru"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Имя uz" rules="required" vid="name_uz">
              <v-text-field
                  v-model="nomenclature.name_uz"
                  :error-messages="errors[0]"
                  dense
                  label="Имя uz"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Ключевое слово" rules="required" vid="keyword">
              <v-text-field
                  v-model="nomenclature.keyword"
                  :error-messages="errors[0]"
                  dense
                  label="Ключевое слово"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Бренд" rules="required" vid="brand_id">
              <v-autocomplete
                  v-model="nomenclature.brand_id"
                  :error-messages="errors[0]"
                  :items="brands"
                  dense
                  item-text="name"
                  item-value="id"
                  label="Бренд"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Измерения" rules="required" vid="measure_id">
              <v-autocomplete
                  v-model="nomenclature.measure_id"
                  :error-messages="errors[0]"
                  :items="measures"
                  dense
                  item-text="name_en"
                  item-value="id"
                  label="Измерения"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="4">
            <validation-provider v-slot="{errors}" name="Тип" rules="required" vid="type">
              <v-autocomplete
                  v-model="type"
                  :error-messages="errors[0]"
                  :items="genderTypes"
                  dense
                  item-text="name"
                  item-value="id"
                  label="Тип"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Категория" rules="required" vid="category_id">
              <v-autocomplete
                  v-model="selectedCategoryId"
                  :error-messages="errors[0]"
                  :items="filteredCategories"
                  dense
                  item-text="name"
                  item-value="id"
                  label="Категория"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <validation-provider v-slot="{errors}" name="Подкатегория" rules="required" vid="category_id">
              <v-autocomplete
                  v-model="nomenclature.category_id"
                  :error-messages="errors[0]"
                  :items="subcategories"
                  dense
                  item-text="name"
                  item-value="id"
                  label="Подкатегория"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12">
            <validation-provider v-slot="{errors}" name="Описание en" rules="required" vid="description_en">
              <v-text-field
                  v-model="nomenclature.description_en"
                  :error-messages="errors[0]"
                  dense
                  label="Описание en"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12">
            <validation-provider v-slot="{errors}" name="Описание ru" rules="required" vid="description_ru">
              <v-text-field
                  v-model="nomenclature.description_ru"
                  :error-messages="errors[0]"
                  dense
                  label="Описание ru"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col cols="12">
            <validation-provider v-slot="{errors}" name="Описание uz" rules="required" vid="description_uz">
              <v-text-field
                  v-model="nomenclature.description_uz"
                  :error-messages="errors[0]"
                  dense
                  label="Описание uz"
                  outlined/>
            </validation-provider>
          </v-col>
          <v-col>
            <v-btn :loading="loading" color="primary" type="submit">Следующий</v-btn>
          </v-col>
        </v-row>
      </form>
    </validation-observer>
    <div v-else class="d-flex justify-center align-center" style="min-height: 500px">
      <v-progress-circular :size="70" color="primary" indeterminate/>
    </div>
  </div>
</template>


<script>
import stepMixin from "./stepMixin";

export default {
  props: ['subcategoryId'],
  data() {
    return {
      categories: [],
      measures: [],
      brands: [],
      selectedCategoryId: null,
      genderTypes: this.$store.state.genderTypes,
      type: null,
      nomenclature: {
        name_en: '',
        name_ru: '',
        name_uz: '',
        description_en: '',
        description_ru: '',
        description_uz: '',
        keyword: '',
        brand_id: null,
        category_id: null,
        measure_id: null,
        status: 10,
      },
    }
  },
  methods: {
    init() {
      let listDataResource = [
        this.getCategories(),
        this.getBrands(),
        this.getMeasures()
      ];
      if (this.isUpdate) {
        listDataResource.push(this.getNomenclature())
      }
      Promise.all(listDataResource)
          .finally(() => {
            this.initLoading = false
          })

    },
    getCategories() {
      return new Promise(resolve => {
        this.$http.get('categories/with-children')
            .then(res => {
              this.categories = res.data.data;
            })
            .catch(err => {
              this.$store.commit('showErrorMessage', err)
            })
            .finally(() => {
              resolve()
            })
      })
    },
    getBrands() {
      return new Promise(resolve => {
        this.$http.get('brands/list')
            .then(res => {
              this.brands = res.data.data;
            })
            .catch(err => {
              this.$store.commit('showErrorMessage', err)
            })
            .finally(() => {
              resolve()
            })
      })
    },
    getMeasures() {
      return new Promise(resolve => {
        this.$http.get('measures/list')
            .then(res => {
              this.measures = res.data.data;
            })
            .catch(err => {
              this.$store.commit('showErrorMessage', err)
            })
            .finally(() => {
              resolve()
            })
      })
    },
    getNomenclature() {
      return new Promise(resolve => {
        this.$http.get(`nomenclatures/${this.nomenclatureId}`)
            .then(res => {
              this.selectedCategoryId = res.data.data.category.parent_id
              this.type = res.data.data.category.type
              this.nomenclature = res.data.data;
            })
            .catch(err => {
              this.$store.commit('showErrorMessage', err)
            })
            .finally(() => {
              resolve()
            })
      })
    },
    submit() {
      this.loading = true;
      let requestUrl = this.isUpdate ? `/nomenclatures/${this.nomenclatureId}` : '/nomenclatures';
      const method = this.isUpdate ? 'put' : 'post'
      this.$http[method](requestUrl, this.nomenclature)
          .then(res => {
            this.$emit('update:subcategoryId', this.selectedCategoryId)
            this.$emit('submit', res.data.data)
          })
          .catch(err => {
            this.$store.commit('showErrorMessage', err);
            if (err.response && err.response.data && err.response.data.errors) {
              this.$refs['formObserver'].setErrors(err.response.data.errors)
            }
          })
          .finally(() => {
            this.loading = false
          })
    },
  },
  mixins: [stepMixin],
  computed: {
    filteredCategories() {
      return this.categories.filter(item => {
        return item.type === this.type
      })
    },
    subcategories() {
      const subCategories = this.categories.find(item => {
        return item.id === this.selectedCategoryId
      })
      return subCategories ? subCategories.children : []
    }
  },
  mounted() {
    this.init()
  }
}
</script>
