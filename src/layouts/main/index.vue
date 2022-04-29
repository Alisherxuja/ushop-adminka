<template>
  <div>
    <app-sidebar :mini="mini" :drawer.sync="drawer"></app-sidebar>
    <v-app-bar
      flat
      class="appBar_outlas"
      clipped-left
      app
    >
      <v-app-bar-nav-icon class="ml-2" x-small @click.stop="miniVariant"/>

      <v-spacer/>
      <div class="d-flex align-center">
        <label>
          Ночной
        </label>
        <v-switch
          class="mt-6 ml-3"
          v-model="switch1"
          @change="changeT"
        >
        </v-switch>
      </div>
      <v-col md="1">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }" class="mb-4">
            <v-btn
                v-bind="attrs"
                v-on="on"
                text
                width="100%"
            >
              {{ name }}
              <v-avatar
                  class="user_icon_header border ml-3"
                  size="36"
                  color="grey lighten-2"
              >
                <v-icon size="20">fas fa-user</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item
                @click="$router.push('/profile')"
            >
              <v-list-item-title class="text-center">
                Профил
              </v-list-item-title>
            </v-list-item>
            <v-list-item
                @click="logOut"
            >
              <v-list-item-title class="text-center">
                Выйти
              </v-list-item-title>
            </v-list-item>
          </v-card>
        </v-menu>
      </v-col>

    </v-app-bar>
    <v-main>
      <v-container
        fluid>
        <v-row
          justify="center">
          <v-col class="grow">
            <template>
              <router-view
                key="router"
              ></router-view>
              <full-loading v-model="loading"/>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>


  </div>
</template>

<script>
import sidebar from "./sidebar";
import {mapState} from 'vuex'
import FullLoading from "../../components/ui/loading/full-loading";
import UserInfo from "../../plugins/UserInfo";
import item from "../../views/order/item";
import User from "../../router/modules/User";

export default {
  data: () => ({
    drawer: null,
    test: '',
    switch1: false,
    mini: true,
    strokeLight: '#fff',
    strokeDark: '#000',
    theme: 'light',
    name: '',
  }),
  components: {
    FullLoading,
    appSidebar: sidebar
  },
  methods: {
    logOut() {
      this.$store.commit('clearToken');
      this.$vuetify.theme.dark = false;
      this.$router.push({name: 'login'})
    },
    changeT() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      if (this.$vuetify.theme.dark) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    },
    miniVariant() {
     if (this.$vuetify.breakpoint.mobile) {
       this.drawer = !this.drawer
       this.mini = false
     } else {
       this.mini = !this.mini;
       if (this.mini) {
         localStorage.setItem('mini', 'true')
       } else {
         localStorage.setItem('mini', 'false')
       }
     }
    },
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
  mounted() {

    if (localStorage.theme === 'dark') {
      this.$vuetify.theme.dark = true
      this.switch1 = true
    }

    if (localStorage.mini === 'true') {
      this.mini = true
    } else {
      this.mini = false
    }


    if(UserInfo.getUserInfo()) {
      const user = UserInfo.getUserInfo()
      this.name = user.name
    }
  },
}
</script>


<style scoped>
.appBar_outlas {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33) !important;
}
</style>