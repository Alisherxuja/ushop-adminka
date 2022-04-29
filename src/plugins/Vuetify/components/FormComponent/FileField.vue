<template>
    <validation-provider v-slot="{errors}" tag="div" :name="field.name" :rules="field.rules">
        <v-uploader ref="uploader" v-model="field.value" :error-message="errors[0]" :accept="field['accept']"
                    :label-text="field.label"></v-uploader>
    </validation-provider>
</template>

<script>
    import FormFieldMixin from "./FormFieldMixin";

    export default {
        mixins: [FormFieldMixin],
    }
</script>