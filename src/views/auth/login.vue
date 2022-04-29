<template>
  <div class="flex-grow-1 fill-height d-flex">
    <v-col
        class="fill-height d-flex justify-center login-form-wrap flex-column px-md-10 position-relative"
        cols="12"
        md="5"
        sm="12"
    >
      <div>
        <img src="../../assets/images/logo-ru.svg" class="image_logo_login_page" alt="">
      </div>
      <div class="form_login">
        <v-card-title class="pl-0 mb-2">Добро пожаловать</v-card-title>
        <validation-observer ref="form" v-slot="{handleSubmit}" class="">
          <v-form @submit.prevent="handleSubmit(login)">
            <v-card>
              <v-card-text>
                <validation-provider v-slot="{errors}" name="Email" rules="required" vid="username">
                  <v-text-field
                    v-model="user.phone"
                    :error-messages="errors[0]"
                    label="Email"
                    outlined
                    autofocus
                  >
                    <template v-slot:prepend-inner>
                      <v-icon class="mr-1">far fa-user</v-icon>
                    </template>
                  </v-text-field>
                </validation-provider>
                <validation-provider v-slot="{errors}" name="Пароль" rules="required" vid="password">
                  <v-text-field
                    id="password"
                    v-model="user.password"
                    :error-messages="errors[0]"
                    label="Пароль"
                    :append-icon="show ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    outlined
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon class="mr-1">fas fa-lock</v-icon>
                    </template>
                  </v-text-field>
                </validation-provider>
                <div class="text-right">
                  <v-btn :loading="loading" color="primary" type="submit">Войти</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-form>
        </validation-observer>
      </div>
    </v-col>
    <v-col class="flex-grow-1 login-layout-backdrop fill-height background_image_loginPage" :class="$vuetify.theme.dark ? 'background_image_light' : 'background_image_dark'"></v-col>
  </div>
</template>

<script>
import {getErrorMessages} from "../../utils";
import '../../assets/scss/module/_login.scss'
import UserInfo from "../../plugins/UserInfo";

export default {
  data() {
    return {
      loading: false,
      user: {
        phone: '',
        password: '',
      },
      strokeLight: '#fff',
      strokeDark: '#000',
      show: false
    }
  },
  methods: {
    login() {
      this.loading = true;
      this.$http.post('auth/login', this.user)
          .then(res => {
            this.$store.commit('setToken', {
              token: res.data.data['access_token'],
              expire: res.data.data['expires_in']
            });
            this.$store.commit('setPermissions', {
              permissions: res.data.data['permissions'],
            });
            this.$store.commit('setRole', {
              role: res.data.data['roles'][0],
            });
            this.getUser(res.data.data.access_token);
          }).finally(() => {
        this.loading = false;
      }).catch(err => {
        this.$store.commit('showErrorMessage', err);
        this.$refs.form.setErrors(getErrorMessages(err))
      })
    },
    async getUser (token) {
      try {
        const {data: {data}} = await this.$http.post('/auth/me', token)
        if (data) {
          UserInfo.setUserInfo(data)
          this.$router.push({name: 'index'})
        }
      } catch (err) {
        this.$store.commit('showErrorMessage', err)
      }
    }
  }
}
</script>



<style>
.image_logo_login_page {
  position: absolute;
  width: 50%;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
}
@media screen and (max-width: 1000px) {
  .background_image_loginPage {
    display: none;
  }
}
@media screen and (min-width: 700px) and (max-width: 1000px) {
  .form_login {
    width: 60% !important;
    margin: 0 auto;
  }
  .image_logo_login_page {
    width: 30% !important;
  }
}
</style>
