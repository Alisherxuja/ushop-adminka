<template>
    <validation-provider tag="div" v-slot="{errors}" :vid="field.name || field.label" :name="field.label" :rules="field.rules">
        <v-text-field
                dense
                :type="nativeType ? field.type : 'text'"
                color="purple darken-3"
                v-model="field.value"
                :label="field.label"
                :maxlength="field.maxlength ? field.maxlength : 255"
                :error-messages="errors"
                clearable
                counter
                outlined
                autocomplete="off"
        ></v-text-field>
    </validation-provider>
</template>

<script>
    import FormFieldMixin from "./FormFieldMixin";

    export default {
        mixins: [FormFieldMixin]
    }
</script>