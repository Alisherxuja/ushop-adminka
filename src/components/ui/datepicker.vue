<template>
    <v-menu
        v-model="firstPicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                solo
                dense
                v-model="dateFrom"
                label="Дата от"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker
            v-model="dateFrom"
            @input="firstPicker = false"
        ></v-date-picker>
    </v-menu>
</template>

<script>
export default {
name: "datepicker",
    props: {
    model: {

    }
    }
}
</script>

<style scoped>

</style>
