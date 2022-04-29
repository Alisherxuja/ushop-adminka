<template>
    <validation-provider v-slot="{errors}" :vid="field.name || field.value" :name="field.label" :rules="field.rules">
        <vue-content
                :error-messages="errors[0]"
                :label="field.label"
                v-model="field.value"
        ></vue-content>
    </validation-provider>
</template>

<script>
    import FormFieldMixin from "./FormFieldMixin";

    export default {
        mixins: [FormFieldMixin]
    }
</script>
