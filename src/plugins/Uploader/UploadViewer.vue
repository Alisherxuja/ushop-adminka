<template>
    <div class="reg-space">
        <slot></slot>
        <div class="v-uploader-viewer">
            <div class="v-uploader-image-wrap v-uploader-block list-complete-item">
                <button @click.prevent="remove" class="v-uploader-image-close-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill-rule="evenodd"
                         clip-rule="evenodd">
                        <path d="M479.64 23.8c36.544-37.111 95.954-37.277 132.71-.355 36.72 36.898 36.886 96.91.354 133.998L452.367 320.071 612.87 482.864c36.237 36.804 35.74 96.438-1.086 133.195-36.84 36.745-96.072 36.65-132.285-.165L320.07 454.234 160.36 616.203c-36.544 37.11-95.954 37.276-132.71.354-36.721-36.898-36.887-96.91-.355-133.998L187.632 319.93 27.13 157.137C-9.106 120.334-8.61 60.7 28.217 23.942c36.839-36.744 96.072-36.65 132.285.165l159.427 161.66L479.64 23.798z"/>
                    </svg>
                </button>
                <img
                        v-show="src && isImage"
                        class="v-uploader-image"
                        :src="src" alt="">
                <div class="v-uploader-info" v-if="!isImage" :type="typeFile">
                    <svg height="50" viewBox="-35 0 511 512" width="50" xmlns="http://www.w3.org/2000/svg">
                        <path d="m436.03125 107.03125-104.601562-102.734375c-2.804688-2.753906-6.578126-4.296875-10.511719-4.296875h-264.449219c-30.859375 0-55.96875 25.105469-55.96875 55.96875v400.0625c0 30.859375 25.105469 55.96875 55.96875 55.96875h328.082031c30.859375 0 55.96875-25.105469 55.96875-55.96875v-338.296875c0-4.027344-1.617187-7.882813-4.488281-10.703125zm-100.113281-56.273438 52.921875 51.976563h-48.152344c-2.628906 0-4.769531-2.140625-4.769531-4.769531zm48.632812 431.242188h-328.082031c-14.316406 0-25.96875-11.648438-25.96875-25.96875v-400.0625c0-14.320312 11.648438-25.96875 25.96875-25.96875h249.453125v67.964844c0 19.171875 15.597656 34.769531 34.769531 34.769531h69.828125v323.296875c0 14.320312-11.648437 25.96875-25.96875 25.96875zm0 0"/>
                        <path d="m324.644531 238h-211.453125c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15h211.453125c8.285157 0 15-6.714844 15-15s-6.714843-15-15-15zm0 0"/>
                        <path d="m113.191406 328h172.414063c8.285156 0 15-6.714844 15-15s-6.714844-15-15-15h-172.414063c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15zm0 0"/>
                        <path d="m306.40625 358h-193.214844c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15h193.214844c8.28125 0 15-6.714844 15-15s-6.71875-15-15-15zm0 0"/>
                    </svg>

                    <!--                <p style="text-overflow: ellipsis">{{fileName}}</p>-->
                </div>
            </div>
        </div>
        <span class="error--text caption">{{errorMessage}}</span>
    </div>
</template>

<script>
    export default {
        props: {
            file: Object,
            index: Number,
            errorMessage: String,
        },
        data() {
            return {
                imageType: [
                    'png', 'jpg', 'svg', 'jpeg', 'webp'
                ],
            }
        },
        methods: {
            remove() {
                this.$emit('remove', {index: this.index, file: this.file})
            }
        },
        computed: {
            fileName() {
                if (this.file.file) {
                    let text = this.file.file.name.split('.');
                    return text.slice(0, text.length - 1).join(' ');
                }
                return null
            },
            isImage() {
                return this.imageType.includes(this.typeFile)
            },
            typeFile() {
                if (this.file.file) {
                    let text = this.file.file.name.split('.');
                    return text[text.length - 1];
                } else if (this.file.url) {
                    let text = this.file.url.split('.');
                    return text[text.length - 1];
                }
                return 'none'
            },
            src() {
                return this.file.fileBase64 || this.file.url
            }
        }
    }
</script>
