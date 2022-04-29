<template>
    <div class="mb-2">
        <p class="pl-2 mb-2">{{label}}</p>
        <vue-editor
                useCustomImageHandler
                @image-added="handleImageAdded"
                @input="$emit('input', $event)"
                :value="contentValue"
        ></vue-editor>
        <div class="v-text-field__details mt-2 pl-2">
            <span class="error--text v-messages__message v-messages">{{errorMessages}}</span>
        </div>
    </div>
</template>

<script>
    import {VueEditor} from "vue2-editor";

    export default {
        name: 'vue-content',
        props: ['value', 'errorMessages', 'label'],
        computed: {
            contentValue() {
                return this.value
            }
        },
        components: {
            VueEditor
        },
        methods: {
            handleImageAdded (file, Editor, cursorLocation, resetUploader) {
                const formData = new FormData()
                formData.append('image', file)
                this.$http.post("upload/image", formData).then(res => {
                    Editor.insertEmbed(cursorLocation, "image", res.data.data);
                    resetUploader();
                })
            }
        }
    }
</script>
