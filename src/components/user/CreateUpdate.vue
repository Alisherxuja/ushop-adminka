<template>
  <v-dialog v-model="dialog" width="600">
    <validation-observer v-slot="{ handleSubmit }" ref="form">
      <form @submit.prevent="handleSubmit(save)">
        <v-card>
          <v-card-title>
            {{ form.id ? 'Изменить' : 'Добавить' }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" vid="role_name" name="Роль" rules="required">
                  <v-select
                      :error-messages="errors[0]"
                      v-model="form.role_name"
                      outlined
                      :items="roles"
                      item-value="name"
                      item-text="name"
                      label="Роль"
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" vid="name" name="Имя" rules="required">
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.name"
                      outlined
                      label="Имя"
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" vid="last_name" name="фамилия" rules="required">
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.last_name"
                      outlined
                      label="Имя"
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" vid="password" name="Пароль" rules="required">
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.password"
                      outlined
                      label="Пароль"
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" vid="email" name="Почта" rules="required">
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.email"
                      outlined
                      label="Почта"
                      dense
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" vid="phone" name="Телефон" rules="required">
                  <v-text-field
                      :error-messages="errors[0]"
                      v-model="form.phone"
                      type="number"
                      outlined
                      label="Телефон"
                      dense
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer />
            <v-btn text @click="dialog = false">Отмена</v-btn>
            <v-btn type="submit" color="success" :loading="loading">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </validation-observer>
  </v-dialog>
</template>

<script>
import {getErrorMessages} from "../../utils";

const form = {
  role_name: null,
  name: null,
  last_name: null,
  email: null,
  phone: null,
  password: null
}


export default {
  name: "UserCreateUpdate",
  data() {
    return {
      dialog: false,
      form: {...form},
      roles: [],
      loading: false
    }
  },
  created() {
    this.getRoles();
  },
  methods: {
    async save() {
      this.loading = true;
      try {
        await this.$http.post(`users`, this.form);
        this.dialog = false;
        this.$emit('getUserList');
      } catch (err) {
        this.$store.commit('showErrorMessage', err);
        const {form} = this.$refs;
        form.setErrors(getErrorMessages(err));
      } finally {
        this.loading = false;
      }
    },
    openDialog() {
      this.dialog = true;
    },
    async getRoles() {
      try {
        const {data: {data}} = await this.$http.get('roles');
        this.roles = data;
      } catch (err) {
        this.$store.commit('showErrorMessage', err);
      }
    }
  },
  watch: {
    dialog(val) {
      if(!val) {
        this.form = {...form};
        this.$refs.form.reset();
      }
    }
  }
}
</script>

<style scoped>

</style>