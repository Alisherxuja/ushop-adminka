<template>
    <div>
        <v-row>
            <v-col>
                <div class="d-flex align-center mb-4">
                    <v-toolbar-title>
                        <h4 class="pl-3">Контакты</h4>
                    </v-toolbar-title>
                    <v-btn v-if="can('admin.contact.update')" class="ml-10" small color="primary"
                           @click="formModalShow = true">
                        <v-icon x-small>fas fa-edit</v-icon>
                    </v-btn>
                </div>
                <v-card
                    v-if="contact">
                    <v-card-text class="overflow-hidden">
                        <v-list flat color="transparent">
                            <div class="px-2">
                            </div>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon size="25">fa-envelope</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ contact.email }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon size="25">fa-map-marker-alt</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ contact.address_ru }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon size="25">fa-map-marker-alt</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ contact.address_uz }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon size="25">fa-mobile-alt</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ contact.phone }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="contact.second_phone">
                                <v-list-item-icon>
                                    <v-icon size="25">fa-mobile-alt</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ contact.second_phone }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item v-if="contact.android_app_url">
                                <v-list-item-icon>
                                    <v-icon size="25">fa-google-play</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ contact.android_app_url }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item v-if="contact.ios_app_url">
                                <v-list-item-icon>
                                    <v-icon size="25">fa-mobile-alt</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ contact.ios_app_url }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <div v-if="contact.social">
                                <v-list-item
                                    :key="`social${index}`"
                                    v-for="(item, index) in contact.social"
                                >
                                    <v-list-item-icon>
                                        <v-icon size="25">fas fa-share</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </div>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="formModalShow" width="500">
            <v-card>
                <v-card-title>Контакты</v-card-title>
                <v-card-text>
                    <validation-observer ref="obs" v-slot="{handleSubmit}">
                        <v-form @submit.prevent="handleSubmit(submit)">
                            <validation-provider name="email" rules="required" v-slot="{errors}">
                                <v-text-field
                                    :error-messages="errors[0]"
                                    label="Email"
                                    prepend-icon="fa-envelope"
                                    dense
                                    outlined
                                    v-model="formContact.email"
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider name="Адрес ru" vid="address_ru" rules="required" v-slot="{errors}">
                                <v-text-field
                                    label="Адрес ru"
                                    :error-messages="errors[0]"
                                    prepend-icon="fa-map-marker-alt"
                                    dense
                                    outlined
                                    v-model="formContact.address_ru"
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider name="Адрес uz" vid="address_uz" rules="required" v-slot="{errors}">
                                <v-text-field
                                    label="Адрес uz"
                                    :error-messages="errors[0]"
                                    prepend-icon="fa-map-marker-alt"
                                    dense
                                    outlined
                                    v-model="formContact.address_uz"
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider vid="phone" name="Номер телефона" rules="required" v-slot="{errors}">
                                <v-text-field
                                    label="Номер телефона"
                                    :error-messages="errors[0]"
                                    prepend-icon="fa-mobile-alt"
                                    dense
                                    outlined
                                    v-model="formContact.phone"
                                ></v-text-field>
                            </validation-provider>

                            <validation-provider vid="phone2" name="Номер телефона" rules="required"
                                                 v-slot="{errors}">
                                <v-text-field
                                    label="Номер телефона"
                                    :error-messages="errors[0]"
                                    prepend-icon="fa-mobile-alt"
                                    dense
                                    outlined
                                    v-model="formContact.phone2"
                                ></v-text-field>
                            </validation-provider>

                            <div class="">
                                <h4 class="mb-3">Social</h4>
                                <div class="d-flex"
                                     v-for="(item, index) in formContact.social">
                                    <div class="flex-grow-1">
                                        <validation-provider name="Название" rules="required" v-slot="{errors}">
                                            <v-autocomplete
                                                :error-messages="errors[0]"
                                                :items="socials"
                                                item-text="title"
                                                item-value="short"
                                                dense
                                                outlined
                                                label="Название"
                                                v-model="item.name"/>
                                        </validation-provider>
                                        <validation-provider name="Значение" rules="required" v-slot="{errors}">
                                            <v-text-field
                                                :error-messages="errors[0]"
                                                dense
                                                outlined
                                                label="Значение"
                                                v-model="item.value"
                                            ></v-text-field>
                                        </validation-provider>
                                    </div>
                                    <div class="ml-2">
                                        <v-btn key="plusBtn" :disabled="formContact.social.length > socials.length-1"
                                               v-if="index === 0" x-small height="30" class="mt-1" color="primary"
                                               @click="addSocial">
                                            <v-icon>fas fa-plus</v-icon>
                                        </v-btn>
                                        <v-btn key="minusBtn" v-else color="error" x-small class="mt-1" height="30"
                                               @click="removeSocial(index)">
                                            <v-icon>fas fa-minus</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <v-btn type="submit" color="primary">Сохранить</v-btn>
                            </div>
                        </v-form>
                    </validation-observer>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {getErrorMessages} from "../../utils";

export default {
    data() {
        return {
            formModalShow: false,
            contact: null,
            socials: [
                {
                    title: 'facebook',
                    short: 'fb',
                },
                {
                    title: 'instagram',
                    short: 'instagram',
                },
                {
                    title: 'telegram',
                    short: 'telegram',
                },
            ],
            formContact: {
                email: '',
                phone: '',
                phone2: '',
                address_uz: '',
                address_ru: '',
                social: [
                    {
                        name: '',
                        value: ''
                    }
                ]
            }
        }
    },
    methods: {
        submit() {
            const formData = {...this.formContact};
            this.$http.post('setting', formData).then(res => {
                this.contact = res.data.data
                this.formModalShow = false;
                this.$store.commit('showSnackbar', 'Successfully updated');
            }).catch(err => {
                this.$refs.obs.setErrors(getErrorMessages(err))
            })
        },
        addSocial() {
            this.formContact.social.push({
                name: '',
                value: ''
            })
        },
        removeSocial(key) {
            this.formContact.social.splice(key, 1)
        },
        getContacts() {
            this.$store.commit('showLoading')
            this.$http.get('/setting').then(res => {
                this.contact = res.data.data
                this.formContact = Object.assign({}, res.data.data)
                if (!res.data.data || !res.data.data.social || res.data.data.social.length === 0) {
                    this.$set(this.formContact, 'social',
                        [
                            {
                                name: '',
                                value: ''
                            }
                        ])
                } else {
                    this.formContact.social = [...res.data.data.social]
                }


            }).finally(() => {
                this.$store.commit('clearLoading')
            })
        }
    },
    destroyed() {
        this.$store.commit('clearLoading')
        this.formModalShow = false
    },
    watch: {
        formModalShow(val) {
            if (!val) {
                this.$refs['obs'].reset()
            }
        }
    },
    created() {
        this.getContacts();
    }
}
</script>
