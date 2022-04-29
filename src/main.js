import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/Vuetify';
import veeValidate from './plugins/VeeValidate'
import http from './plugins/Axios'
import Uploader from "./plugins/Uploader";
import {mask} from 'vue-the-mask'
import Filters from './filters'
import * as VueGoogleMaps from 'vue2-google-maps'
import mixins from "./mixins";
Vue.use(mixins)




Vue.directive('mask', mask)


Vue.use(Filters)
Vue.use(vuetify);
Vue.use(veeValidate);
Vue.use(Uploader);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB4comL9rm4zlzLsE0MVsraCVTt4uSSF_U',
    libraries: 'places',
    installComponents: true
  }
});
Vue.prototype.$http = http


Vue.config.productionTip = false;
import('./assets/scss/style.scss')


new Vue({
  router,
  store,
  vuetify: vuetify.lib,
  render: h => h(App)
}).$mount('#app');
