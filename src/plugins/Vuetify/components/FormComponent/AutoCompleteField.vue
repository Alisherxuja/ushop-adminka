<template>
    <validation-provider tag="div" v-slot="{errors}"  :vid="field.name || field.value" :name="field.label"  :rules="field.rules">
    <v-autocomplete
            dense
            :multiple="field.multiple"
            color="purple darken-3"
            v-model="field.value"
            :error-messages="errors"
            :items="field.items"
            item-text="name"
            item-value="id"
            :label="field.label"
            clearable
            counter
            outlined
            autocomplete="off"
    />
    </validation-provider>
</template>

<script>
    import FormFieldMixin from "./FormFieldMixin";

    export default {
        mixins: [FormFieldMixin]
    }
</script>