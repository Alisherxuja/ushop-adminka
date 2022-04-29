<template>
    <div>
        <v-card-title class="px-0">
            <!--      <back-router-btn/>-->
            <v-spacer></v-spacer>
            <span>{{ roles.id ? 'Обновить' : 'Создать' }} Роль</span>
            <v-spacer></v-spacer>
            <v-btn color="success darken-1" @click="save">
                Сохранить
            </v-btn>
        </v-card-title>
        <validation-observer ref="form" tag="form">
            <v-row justify="center">
                <v-col lg="12" md="12">
                    <v-card>
                        <v-card-text>
                            <validation-provider name="Name" rules="required|min:2|max:255" v-slot="{errors}" vid="name">
                                <v-text-field
                                    outlined
                                    dense
                                    clearable
                                    label="Названия"
                                    type="text"
                                    :error-messages="errors[0]"
                                    v-model="roles.name"
                                >
                                </v-text-field>
                            </validation-provider>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-card>
                <v-card-text>
                    <v-checkbox color="success" @click="selectAll" v-model="checkAllPermissions" label="Вибрать все"></v-checkbox>
                </v-card-text>
            </v-card>

            <v-row>
                <v-col :cols="12" md="4" lg="3" :class="{'col-auto': $vuetify.breakpoint.lgAndUp}"
                       v-for="(permission, key) in permissions" :key="key">

                    <v-card min-width="340px" height="100%">
                        <v-card-title class="pb-0">{{ permission.name }}</v-card-title>
                        <validation-provider name="Разрешение" v-slot="{errors}" v-if="key === 0" rules="required"
                                             vid="permissions" tag="div" class="px-4">
                            <v-checkbox
                                class="d-none"
                                v-model="roles.permissions"></v-checkbox>
                            <span class="error--text v-messages">{{ errors[0] }}</span>
                        </validation-provider>

                        <v-card-text>
                            <div v-for="(item, key) in permission.values" :key="key">
                                <v-checkbox
                                    hide-details
                                    v-model="roles.permissions" :value="item.name" color="success darken-1"
                                    :label="item.description" class="mt-1">
                                </v-checkbox>
                            </div>
                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
        </validation-observer>
    </div>
</template>

<script>
// import BackRouterBtn from "@/components/ui/BackRouteBtn";
// import {SUCCESS_MESSAGES} from "@/utils/constants";

export default {
    name: "CreateOrUpdateRoles",
    // components: {BackRouterBtn},
    props: ['roles'],
    data() {
        return {
            loading: false,
            permissions: [],
            checkAllPermissions: false,
        }
    },
    methods: {
        async save() {
            let success = await this.$refs.form.validate();
            if (success) {
                if (this.roles.id) {
                    this.update()
                } else {
                    this.create()
                }
            }
        },
        selectAll() {
            if (this.checkAllPermissions) {
                let all = []
                this.permissions.forEach(item => {
                    item.values.forEach(value => {
                        all.push(value.name);
                    })
                })
                this.roles.permissions = all;
            } else
                this.roles.permissions = [];
        },
        update() {
            this.$showLoading()
            this.$http.put('roles/' + this.roles.id, this.roles)
                .then(() => {
                    // this.$setSuccess({text: SUCCESS_MESSAGES.saved});
                    this.$router.push('/roles')
                })
                .catch(err => {
                    // this.$setErrorFromServer({error: err});
                    this.$setFormErrors({error: err, obs: this.$refs['form']})
                })
                .finally(() => {
                    this.$clearLoading()
                })
        },
        create() {
            this.$showLoading()
            this.$http.post('roles', this.roles)
                .then(() => {
                    // this.$setSuccess({text: SUCCESS_MESSAGES.saved});
                    this.$refs.form.reset();
                    this.$router.push('/roles')
                })
                .catch(err => {
                    this.$setFormErrors({error: err, obs: this.$refs['form']});
                    // this.$setErrorFromServer({error: err});
                })
                .finally(() => {
                    this.$clearLoading()
                })
        },
        getPermissions() {
            this.$http.get('roles/permissions')
                .then(res => {
                    this.permissions = res.data.data
                })
        }
    },
    mounted() {
        this.getPermissions()
    },
}
</script>

<style scoped>

</style>
