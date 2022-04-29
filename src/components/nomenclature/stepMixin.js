export default {
    data () {
        return {
            initLoading: true,
            loading: false
        }
    },
    computed: {
        isUpdate() {
            return !!this.$route.params['nomenclatureId']
        },
        nomenclatureId() {
            return this.$route.params['nomenclatureId']
        }
    },
}