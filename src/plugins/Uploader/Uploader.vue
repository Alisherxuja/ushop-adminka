<template>
    <div :class="wrapClass">
        <input
                :multiple="multiple"
                :accept="accept"
                ref="uploadInput"
                @change="changeUploader"
                type="file" class="v-uploader-input">
        <div class="v-uploader-inner">
            <div :class="[itemClass]"
                 v-if="showBrowseFile">
                <div class="v-uploader-block list-complete-item">
                    <div @click="clickHandler" class="v-uploader-browse-file" :title="labelText">
                        <svg height="50" viewBox="-35 0 511 512" width="50" xmlns="http://www.w3.org/2000/svg">
                            <path d="m436.03125 107.03125-104.601562-102.734375c-2.804688-2.753906-6.578126-4.296875-10.511719-4.296875h-264.449219c-30.859375 0-55.96875 25.105469-55.96875 55.96875v400.0625c0 30.859375 25.105469 55.96875 55.96875 55.96875h328.082031c30.859375 0 55.96875-25.105469 55.96875-55.96875v-338.296875c0-4.027344-1.617187-7.882813-4.488281-10.703125zm-100.113281-56.273438 52.921875 51.976563h-48.152344c-2.628906 0-4.769531-2.140625-4.769531-4.769531zm48.632812 431.242188h-328.082031c-14.316406 0-25.96875-11.648438-25.96875-25.96875v-400.0625c0-14.320312 11.648438-25.96875 25.96875-25.96875h249.453125v67.964844c0 19.171875 15.597656 34.769531 34.769531 34.769531h69.828125v323.296875c0 14.320312-11.648437 25.96875-25.96875 25.96875zm0 0"/>
                            <path d="m324.644531 238h-211.453125c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15h211.453125c8.285157 0 15-6.714844 15-15s-6.714843-15-15-15zm0 0"/>
                            <path d="m113.191406 328h172.414063c8.285156 0 15-6.714844 15-15s-6.714844-15-15-15h-172.414063c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15zm0 0"/>
                            <path d="m306.40625 358h-193.214844c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15h193.214844c8.28125 0 15-6.714844 15-15s-6.71875-15-15-15zm0 0"/>
                        </svg>
                    </div>
                </div>
                <small class="mt-1 error--text">{{errorMessage}}</small>
            </div>
            <upload-viewer
                    v-if="!showBrowseFile"
                    :file="value"
                    :error-message="errorMessage"
                    @remove="removeFile">
            </upload-viewer>
            <slot name="upload-multiple-viewer" v-if="multiple" :files="files" :removeFile="removeFile">
                <upload-viewer
                        v-for="(file, key) in files"
                        :key="`file${key}`"
                        :index="key"
                        :file="file"
                        @remove="removeFile"
                ></upload-viewer>
            </slot>
            <upload-loading :progress="loadingProgress" v-if="loading" key="upload-loading"></upload-loading>
        </div>
    </div>
</template>

<script>
    import "./scss/uploader.scss";
    import UploadLoading from "./UploadLoading";

    export default {
        props: {
            deletePromise: {
                type: Function,
                default: () => Promise.resolve()
            },
            errorMessage: {
                type: undefined | String | Array
            },
            multiple: {
                default: false
            },
            accept: {
                default: null
            },
            labelText: {
                type: String
            },
            type: {
                type: String,
                default: 'quarter'
            },
            value: {
                type: Object | Array,
                required: true
            },
            itemClass: {
                type: String,
                default: 'reg-space'
            }
        },
        data() {
            return {
                loading: false,
                loadingProgress: 0
            }
        },
        methods: {
            convertFileBase(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadstart = () => this.loading = true;
                    reader.onloadend = () => {
                        this.loading = false;
                        this.loadingProgress = 0;
                    };
                    reader.onprogress = e => {
                        this.loadingProgress = Math.floor((e.loaded * 100) / e.total)
                    };
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error)
                })
            },
            removeFile({index, file}) {
                if (this.multiple) {
                    if (file.url) {
                        this.deletePromise(file.id).then(() => {
                            this.value.splice(index, 1)
                        })
                    } else {
                        this.value.splice(index, 1)
                    }
                } else {
                    this.$emit('input', {
                        file: null,
                        fileBase64: null,
                        url: null
                    });
                }
            },
            async changeUploader() {
                const {uploadInput} = this.$refs;
                const files = uploadInput.files;
                if (files.length !== 0) {
                    for (let index in files) {
                        if (index !== 'item' && index !== 'length') {
                            const fileBase64 = await this.convertFileBase(files[index]);
                            if (this.multiple) {
                                let values = this.value;
                                values.push({
                                    url: null,
                                    fileBase64,
                                    file: files[index]
                                });
                                this.$emit('input', values)
                            } else {
                                this.$emit('input', {
                                    url: null,
                                    fileBase64,
                                    file: files[index]
                                })
                            }
                        }
                    }
                }

            },
            clickHandler() {
                const {uploadInput} = this.$refs;
                uploadInput.click();
            }
        },
        computed: {
            files() {
                return this.multiple ? this.value : []
            },
            showBrowseFile() {
                if (this.multiple) {
                    return true
                } else {
                    return !this.value.file && !this.value.url && !this.value.fileBase64
                }
            },
            transition() {
                return 'list-complete'
            },
            wrapClass() {
                return {
                    'v-uploader': true,
                    'v-uploader-round': this.type === 'round',
                    'v-uploader-danger': this.errorMessage
                }
            }
        },
        components: {
            UploadLoading
        }
    }
</script>




