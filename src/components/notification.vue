<template>
    <v-snackbar
            @input="close"
            v-model="snackbar.show"
    >
        {{ snackbar.text }}
        <v-btn
                color="pink"
                text
                @click="close"
        >
            Close
        </v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        computed: {
            snackbar () {
                return this.$store.state.snackbar
            }
        },
        methods: {
            close () {
                this.$store.commit('closeSnackbar')
            }
        }
    }
</script>