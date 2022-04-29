<template>
    <validation-provider tag="div" v-slot="{errors}" :name="field.name" :rules="field.rules">
    <v-switch
            dense
            v-model="field.value"
            color="purple darken-3"
            class="ma-2"
            :label="field.label"
    ></v-switch>
    </validation-provider>
</template>

<script>
    import FormFieldMixin from "./FormFieldMixin";

    export default {
        mixins: [FormFieldMixin]
    }
</script>