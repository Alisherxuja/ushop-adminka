<template>
  <div>
    <ValidationObserver v-slot="{handleSubmit}" ref="form" v-if="ready">
      <form @submit.prevent="handleSubmit(save)">
        <v-toolbar flat class="px-0">
          <v-toolbar-title><h4>Page</h4></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" :loading="loading" type="submit">
            Сохранить
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col
                lg="4"
                md="6"
                cols="12">
                <validation-provider name="title" v-slot="{errors}" rules="required">
                  <v-text-field
                    label="Title ru"
                    :error-messages="errors[0]"
                    outlined
                    dense
                    v-model="page.title_ru"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col
                lg="4"
                md="6"
                cols="12">
                <validation-provider name="title" v-slot="{errors}" rules="required">
                  <v-text-field
                    label="Title uz"
                    :error-messages="errors[0]"
                    outlined
                    dense
                    v-model="page.title_uz"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <vue-content
                  label="Content ru"
                  v-model="page.content_ru"
                />
              </v-col>
              <v-col cols="12">
                <vue-content
                  label="Content uz"
                  v-model="page.content_uz"
                />
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import {getErrorMessages} from "../../utils";

export default {
  data() {
    return {
      loading: false,
      ready: true,
      page: {
        title_ru: '',
        title_uz: '',
        content_ru: '',
        content_uz: '',
      }
    }
  },
  methods: {
    save() {
      if (this.isUpdate) {
        this.update()
      } else {
        this.create()
      }
    },
    getData() {
      this.$http.get(`pages/${this.$route.params.id}`)
          .then(res => {
            this.page = res.data.data
          })
          .catch(err => this.$store.commit('showErrorMessage', err))
    },
    update() {
      this.$http.put(`pages/${this.$route.params.id}`, this.page)
          .then(() => {
            this.$router.push({name: 'pages-index'})
          })
          .catch(err => {
            const {form} = this.$refs;
            form.setErrors(getErrorMessages(err))
            this.$store.commit('showErrorMessage', err)
          })
    },
    create() {
      this.$http.post('pages', this.page)
          .then(res => {
            this.$router.push({name: 'pages-index'})
          })
          .catch(err => {
            const {form} = this.$refs;
            form.setErrors(getErrorMessages(err))
            this.$store.commit('showErrorMessage', err)
          })
    }
  },
  computed: {
      isUpdate() {
          return this.$route.params.id
      },
  },
  mounted() {
    if (this.isUpdate) {
      this.getData()
    }
  }

}
</script>