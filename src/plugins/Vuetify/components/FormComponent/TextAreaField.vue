<template>
    <validation-provider tag="div" v-slot="{errors}" :vid="field.name || field.value" :name="field.label" :rules="field.rules">
    <v-textarea
            dense
            color="purple darken-3"
            :error-messages="errors"
            v-model="field.value"
            :label="field.label"
            type="textarea"
            rows="3"
            :maxlength="field.maxlength ? field.maxlength : 1024"
            clearable
            counter
            outlined
    />
    </validation-provider>
</template>

<script>
    import FormFieldMixin from "./FormFieldMixin";

    export default {
        mixins: [FormFieldMixin]
    }
</script>
