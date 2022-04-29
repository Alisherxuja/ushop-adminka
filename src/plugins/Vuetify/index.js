import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import components from "./components";
import '@fortawesome/fontawesome-free/css/all.css'

export default {
    lib: new Vuetify({
        icons: {
            iconfont: 'fa',
        },
        theme: {
            themes: {
                light: {
                    primary: '#0aa89e',
                    error: '#FF6760',
                    success: '#34EEAE',
                    warning: '#ff9800',
                    accent: '#52575C',
                    secondary: '#A0A4A8',
                    info: '#2196F3',
                },
                dark: {
                    success: '#34EEAE',
                    primary: '#0aa89e',
                }
            }
        },
    }),
    install() {
        Vue.use(Vuetify);
        Vue.use(components)
    }
};