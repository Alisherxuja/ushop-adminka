<template>
    <div style="width: 100%;">
        <ValidationObserver v-slot="{handleSubmit}" ref="obs" v-if="ready">
            <form @submit.prevent="handleSubmit(save)">
                <v-toolbar flat class="px-0">
                    <v-toolbar-title class="px-0"><h4>{{title}}</h4></v-toolbar-title>
                    <v-spacer/>
                    <v-switch v-if="hasStatus" :true-value="10" :false-value="0" v-model="status" color="primary" class="ma-2" label="Active"
                              style="margin-top: 22px !important;"/>
                    <v-btn color="primary" dark class="mb-2" :loading="loading" type="submit">
                        Сохранить
                    </v-btn>
                </v-toolbar>
                <v-card>
                    <v-card-text>
                        <v-row>
                            <template v-if="fields.length > 0">
                                <form-drawer ref="form" v-for="field in fields"
                                             :key="field['name']"
                                             :field="field">
                                    <template v-slot:[`item.${field.name}`]>
                                        <slot :item="field" :name="`item.${field.name}`"/>
                                    </template>
                                </form-drawer>
                            </template>
                        </v-row>
                    </v-card-text>
                </v-card>
            </form>
        </ValidationObserver>
        <div v-else class="d-flex align-center justify-center" style="height: 90vh">
            <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate/>
        </div>
    </div>
</template>

<script>

    export default {
        name: "DynamicForm",
        props: {
            hasStatus :{
              type: Boolean,
                default: true
            },
            fields: {
                type: Array,
                required: true
            },
            resource: {
                type: String,
                required: true
            },
            onInit: {
                type: Function,
                default: () => Promise.resolve(true)
            }
        },
        data() {
            return {
                loading: false,
                status: 10,
                ready: false
            }
        },
        computed: {
            id() {
                return this.$route.params.id
            },
            wthFormData() {
                return this.fields.some(item => item.type === 'file')
            },
            title: function () {
                return this.$route.meta.title
            },
            isUpdate: function () {
                return this.id > 0;
            }
        },
        methods: {
            save() {
                if (this.isUpdate) {
                    this.update(this.getFormData());
                } else {
                    this.store(this.getFormData());
                }
            },
            store(data) {
                this.$http.post(this.resource, data).then(res => {
                    this.$store.commit('showSnackbar', 'Saved successfully');
                    this.$router.push({
                        name: `${this.resource}-index`
                    })
                }).catch(err => {
                    this.$store.commit('showErrorMessage', err);
                    if (err.response.data && err.response.data.errors) {
                        this.$refs.obs.setErrors(err.response.data.errors);
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            update(data) {
                if (this.wthFormData) {
                    data.append('_method', 'PUT');
                }
                this.$http[this.wthFormData ? 'post' : 'put'](this.resource + '/' + this.id, data).then(() => {
                    this.$store.commit('showSnackbar', 'Saved successfully');
                    this.$router.push({
                        name: `${this.resource}-index`
                    })
                }).catch(err => {
                    this.$store.commit('showErrorMessage', err);
                    if (err.response && err.response.data && err.response.data.errors) {
                        this.$refs.obs.setErrors(err.response.data.errors);
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            getFormData() {
                let data;
                if (this.wthFormData) {
                    data = new FormData();
                } else {
                    data = {
                        append(prop, value) {
                            this[prop] = value
                        }
                    }
                }
                this.fields.forEach(field => {
                    if (field.type === 'file') {
                        if (field.value.file) {
                            data.append(field.name, field.value.file);
                        } else if (field.value.file === null && field.value.url === null) {
                            data.append(field.name, null);
                        }
                    } else {
                        data.append(field.name, field.value);
                    }
                });
                if(this.hasStatus) {
                  data.append('status', this.status ? "10" : "0");
                }
                return data;
            },
            getItem() {
                return new Promise((resolve, reject) => {
                    this.$http.get(this.resource + '/' + this.id)
                        .then(res => {
                            resolve(res.data.data)
                        }).catch(err => {
                        reject(err)
                    })
                })
            },
            prepareForm(data) {
                if (this.hasStatus && data.status) {
                    this.status = data.status
                }
                this.fields.forEach(field => {
                    if (field.type === 'file') {
                        field.value.url = data[field.url] || null
                    } else {
                        field.value = data[field.name]
                    }
                });
            },
            async init() {
                try {
                    if (this.isUpdate) {
                        let data = await this.getItem();
                        this.prepareForm(data)
                    }
                    await this.onInit()
                } catch (err) {
                    this.$store.commit('showErrorMessage', err)
                } finally {
                    this.ready = true
                }
            }
        },
        created() {
            this.init()
        }
    }
</script>

<style scoped>

</style>
