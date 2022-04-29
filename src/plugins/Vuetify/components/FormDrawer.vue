<template>
    <v-col cols="12" :sm="field.sm ? field.sm : 6" :md="field.md ? field.md : 6">
        <slot :name="`item.${field.name}`">
            <component
                    :field="field"
                    :name="field.name"
                    :nativeType="nativeType(nativeType)"
                    :is="getFormType(field.type)"/>
        </slot>
        <slot/>
    </v-col>
</template>

<script>
    import FileField from "./FormComponent/FileField";
    import TextAreaField from "./FormComponent/TextAreaField";
    import TextField from "./FormComponent/TextField";
    import SwitchField from "./FormComponent/SwitchField";
    import AutoCompleteField from "./FormComponent/AutoCompleteField";
    import ContentField from "./FormComponent/ContentField";

    const formFields = {
        text: "TextField",
        password: "TextField",
        email: "TextField",
        switch: "SwitchField",
        autocomplete: "AutoCompleteField",
        textarea: "TextAreaField",
        file: "FileField",
        content: "ContentField",
        number: "TextField"
    };
    export default {
        name: "FormDrawer",
        props: {
            field: {
                type: Object,
                required: true
            },
        },
        components: {FileField, TextField, TextAreaField, SwitchField, AutoCompleteField, ContentField},
        data() {
            return {
                id: null
            }
        },
        computed: {
            title: function () {
                return this.$route.meta.title
            },
            isUpdate: function () {
                return this.id > 0;
            }
        },
        methods: {
            nativeType(type) {
                const nativeTypes = ["password", "email", "number"]
                return nativeTypes.includes(type)
            },
            getFormType(type) {
                if (formFields.hasOwnProperty(type)) {
                    return formFields[type]
                }
                return false
            }
        },
    }
</script>

<style scoped>

</style>
