<template>
  <div class="table_profile_page">
    <div class="mb-4">
      <v-btn color="success" @click="editProfileDialog = true">Изменить</v-btn>
      <v-btn color="success" class="ml-3" @click="PasswordEditDialog = true">Изменить Пароль</v-btn>
    </div>
    <v-card>
      <v-card-text>
        <v-simple-table>
          <tbody class="table_profile_inner">
          <tr>
            <td>Название</td>
            <td>{{ users.name }}</td>
          </tr>
          <tr>
            <td>Почта</td>
            <td>{{ users.email }}</td>
          </tr>
          <tr>
            <td>Телефон</td>
            <td>{{ users.phone }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="PasswordEditDialog" width="500">
      <v-card>
        <v-card-title class="mb-4">
          <span>
            Изменит пароль
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="PasswordEditDialog = false">fas fa-times-circle</v-icon>
        </v-card-title>
        <v-card-text>
          <validation-observer ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(updatePassword)">
              <validation-provider rules="required" name="Старый пароль" vid="oldPassword" v-slot="{errors}">
                <v-text-field
                    :error-messages="errors[0]"
                    label="Старый пароль"
                    outlined
                    dense
                    v-model="changePassword.oldPassword"
                />
              </validation-provider>
              <validation-provider name="Новый пароль" rules="required" v-slot="{errors}" vid="newPassword">
                <v-text-field
                    :error-messages="errors[0]"
                    label="Новый пароль"
                    outlined
                    dense
                    v-model="changePassword.newPassword"
                />
              </validation-provider>
              <validation-provider vid="confirmation" name="повторите новый пароль" rules="required|confirmed:newPassword" v-slot="{errors}">
                <v-text-field
                    :error-messages="errors[0]"
                    label="повторите новый пароль"
                    outlined
                    v-model="changePassword.confirmNewPassword"
                    dense
                />
              </validation-provider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closePasswordDialog" color="red darken-1" text>Отмена</v-btn>
                <v-btn type="submit" color="success darken-1">Сохранить</v-btn>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editProfileDialog" width="500">
      <v-card>
        <v-card-title class="mb-4">
          <span>Изменить</span>
          <v-spacer></v-spacer>
          <v-icon @click="editProfileDialog = false">fas fa-times-circle</v-icon>
        </v-card-title>
        <validation-observer ref="formProfile" v-slot="{ handleSubmit }">
          <v-card-text>
            <v-row>
              <v-col class="" cols="12" md="12">
                <validation-provider rules="required" vid="name" name="Имя" v-slot="{errors}">
                  <v-text-field
                      :error-messages="errors[0]"
                      label="Имя"
                      outlined
                      dense
                      v-model="userFormData.name"
                  />
                </validation-provider>
              </v-col>
              <v-col class="" cols="12" md="12">
                <validation-provider rules="required" vid="phone" name="Телефон" v-slot="{errors}">
                  <v-text-field
                      :error-messages="errors[0]"
                      label="Телефон"
                      outlined
                      dense
                      v-model="userFormData.phone"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="editProfileDialog = false" color="red darken-1" text>Отмена</v-btn>
            <v-btn @click="updateProfiles" color="success darken-1">Сохранить</v-btn>
          </v-card-actions>
        </validation-observer>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import {getErrorMessages} from "@/utils";

export default {
  name: "index",
  data() {
    return {
      user_info: {},
      PasswordEditDialog: false,
      editProfileDialog: false,
      password: {},
      changePassword: {
        oldPassword: null,
        newPassword: null,
        confirmNewPassword: null
      },
      users: {},
      userFormData: {
        phone: null,
        name: null,
      }
    }
  },
  created() {
    this.getProfile();
  },
  watch: {
    PasswordEditDialog(val) {
      if (!val) {
        this.changePassword = {
          oldPassword: null,
          password: null,
          confirmNewPassword: null
        }
        this.$refs.form.reset();
      }
    },
    editProfileDialog(val) {
      if (!val) {
        this.userFormData = {
          phone: null,
          name: null,
        }
        this.$refs.formProfile.reset()
      }
    }
  },
  methods: {
    getProfile() {
      this.$showLoading();
      this.$http.get('profile/get')
          .then(res => {
            this.users = res.data.data;
          })
          .catch(err => {
          })
          .finally(() => {
            this.$clearLoading();
          })
    },
    updatePassword() {
      this.$http.post('profile/password', this.changePassword)
          .then(() => {
            this.closePasswordDialog()
          })
          .catch(err => {
            this.$refs.form.setErrors(getErrorMessages(err))
          })
          .finally(() => {

          })
    },
    updateProfiles() {
      this.$http.post('profile/update', this.userFormData)
          .then(() => {
            this.editProfileDialog = false;
            this.getProfile();
          })
          .catch(err => {
            this.$refs.formProfile.setErrors(getErrorMessages(err))
          })
          .finally(() => {

          })
    },
    closePasswordDialog() {
      this.PasswordEditDialog = false;
      this.$refs.form.reset();
    }
  }
}
</script>

<style scoped>

.table_profile_inner tr td {
  padding: 17px !important;
}

.table_profile_inner tr td:nth-last-child(odd) {
  border-left: 1px solid lightgray;
}


</style>