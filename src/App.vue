<template>
    <v-app>
        <router-view/>
        <notification/>
    </v-app>
</template>

<script>
    import notification from "./components/notification";
    export default {
        components: {
            notification
        }
    }
</script>

