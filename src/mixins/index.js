import canRole from "./canRole";
import can from './can.js'

const mixin = {
    methods: {
        can, canRole,
        $showLoading() {
            this.$store.commit('showLoading')
        },
        $clearLoading() {
            this.$store.commit('clearLoading')
        }
    },
    computed: {
        console: () => console
        // title() {
        //     return this.$route.meta.title
        // }
    }
}

export default {
    install(Vue) {
        Vue.mixin(mixin)
    }
}