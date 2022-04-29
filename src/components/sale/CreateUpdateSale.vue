<template>
  <v-dialog v-model="dialog" width="800">
    <validation-observer ref="form" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(save)">
        <v-card>
          <v-card-title>
            {{ form.id ? 'Изменить продажа' : 'Добавить продажа' }}
          </v-card-title>
          <v-divider/>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <validation-provider
                    vid="title_en"
                    v-slot="{ errors }"
                    name="Заголовка en"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      label="Заголовка en"
                      dense
                      outlined
                      v-model="form.title_en"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    vid="title_ru"
                    v-slot="{ errors }"
                    name="Заголовка ru"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      label="Заголовка ru"
                      dense
                      outlined
                      v-model="form.title_ru"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    vid="title_uz"
                    v-slot="{ errors }"
                    name="Заголовка uz"
                    rules="required|max:255"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      label="Заголовка uz"
                      dense
                      outlined
                      v-model="form.title_uz"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    vid="min_percent"
                    v-slot="{ errors }"
                    name="мин. процент"
                    rules="required"
                >
                  <v-text-field
                      :error-messages="errors[0]"
                      label="мин. процент"
                      dense
                      type="number"
                      outlined
                      v-model="form.min_percent"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" md="6">
                <validation-provider
                    vid="image"
                    v-slot="{ errors }"
                    name="Изображении"
                    :rules="{ rules: !form.id }"
                >
                  <v-file-input
                      v-if="!image"
                      :error-messages="errors[0]"
                      label="Изображении"
                      dense
                      outlined
                      v-model="form.image"
                  />
                </validation-provider>
                <v-card v-if="image" width="100px">
                  <v-card-text class="pa-1">
                    <v-btn
                        small
                        fab
                        absolute
                        width="20"
                        height="20"
                        color="error"
                        style="left: 50%;
                        transform: translateX(-50%);
                        bottom: -10px"
                        @click="image = null"
                    >
                      <v-icon size="12">
                        fas fa-times
                      </v-icon>
                    </v-btn>
                    <v-img src="https://webmeup.com/upload/blog/lead-image-105.png" style="border-radius: 4px"></v-img>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn
                @click="dialog = false"
                text
            >
              Отмена
            </v-btn>
            <v-btn
                color="success"
                type="submit"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </validation-observer>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateUpdateSale",
  data() {
    return {
      dialog: false,
      form: {
        title_en: null,
        title_ru: null,
        title_uz: null,
        image: null,
        min_percent: null,
      },
      image: null,
    }
  },
  methods: {
    openDialog(item) {
      if (item) {
        this.form = this.getValueByKey(this.form, item);
        this.form.id = item.id
        this.image = item.avatar_url
      }
      this.dialog = true
    },
    getValueByKey (obj1, obj2) {
      const obj = {}
      Object.keys(obj1).forEach(keys => {
        if (obj2[keys]) {
          obj[keys] = obj2[keys]
        } else {
          obj[keys] = obj1[keys]
        }
      })
      return obj
    },
    async save() {
      this.$showLoading();
      try {
        if (this.form.id) {
          const formData = this.getFormData('put');
          await this.$http.post(`sale/${this.form.id}`, formData);
          // await this.$http.put(`sale/${this.form.id}`, this.form);
        } else {
          const formData = this.getFormData();
          await this.$http.post(`sale`, formData);
        }
        this.dialog = false;
        this.$emit('getData');
        this.$store.commit('showSnackbar', 'Saved successfully')
      } catch (err) {
        this.$store.commit('showErrorMessage', err);
      } finally {
        this.$clearLoading();
      }
    },
    getFormData(method) {
      const formData = new FormData();
      formData.append('title_en', this.form.title_en);
      formData.append('title_ru', this.form.title_ru);
      formData.append('title_uz', this.form.title_uz);
      if(this.form.image)
        formData.append('image', this.form.image);
      // if(this.image)
      //   formData.append('image', this.image);
      formData.append('min_percent', this.form.min_percent);
      if(method)
        formData.append('_method', method)
      return formData
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.form = {
          title_en: null,
          title_ru: null,
          title_uz: null,
          image: null,
          min_percent: null,
        }
        this.$refs.form.reset();
      }
    }
  }
}
</script>

<style scoped>

</style>