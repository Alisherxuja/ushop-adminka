<template>
    <div>
        <v-toolbar flat class="px-0">
            <v-toolbar-title><h4>Сотрудники</h4></v-toolbar-title>
            <v-spacer />
            <v-btn color="success" @click="openDialog">
              <v-icon left>fas fa-plus</v-icon>
              Добавить
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-card-text>
                <v-data-table
                    :items="items"
                    :headers="headers"
                    :items-per-page="items.length"
                    hide-default-footer>
                    <template v-slot:item.status="{item}">
                        <v-switch
                            hide-details
                            class="mt-0"
                            v-if="can('admin.users.changeStatus')" :true-value="10" :false-value="0" @change="changeStatus(item)"
                            v-model="item.status" :loading="item.loading"></v-switch>
                    </template>
                    <template v-slot:item.name="{item}">
                        <div v-if="item.roles && item.roles.includes('customer')">

                        </div>
                        <div v-else>
                            {{ item.name }}
                        </div>
                    </template>
                    <template v-slot:item.actions="{item}">
                        <div class="d-flex align-center" v-if="can('admin.users.destroy')">
                            <v-btn color="error" small icon @click="setDeleteItem(item)">
                                <v-icon size="15">fas fa-trash-alt</v-icon>
                            </v-btn>
<!--                            <v-btn color="error" small icon @click="openRoleModal(item)">-->
<!--                                <v-icon-->
<!--                                    size="15"-->
<!--                                >-->
<!--                                    fas fa-pen-alt-->
<!--                                </v-icon>-->
<!--                            </v-btn>-->
                        </div>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <warning-dialog @apply="removeUser" v-model="showWarningModal"/>
        <v-dialog v-model="roleDialog" scrollable max-width="600px">
            <ValidationObserver
                ref="roleForm"
                tag="form"
                @submit.prevent="attach"
            >
                <v-card>
                    <v-card-title>
                        <span class="headline">Прикрепить роль</span>
                        <v-icon @click="roleDialog = false" class="info_modal_close">
                            mdi-close
                        </v-icon>
                    </v-card-title>
                    <v-container class="pb-0">
                        <v-checkbox class="mt-0" v-model="isSelectedAllRoles" label="Выбрать все"></v-checkbox>
                    </v-container>
                    <v-card-text class="mt-0 pt-0">
                        <v-container class="concul_modal_form">
                            <v-row>
                                <template>
                                    <v-container fluid>
                                        <div v-for="(role, index) in roles" :key="`role-${index}`">
                                            <v-checkbox class="mt-0" v-model="selectedRoles" :label="role"
                                                        :value="role"></v-checkbox>
                                        </div>
                                    </v-container>
                                </template>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions class="footer_modal_user">
                        <v-spacer></v-spacer>
                        <v-btn color="#838EA1" dark @click="roleDialog = false">Отмена</v-btn>
                        <v-btn color="#0076C3" dark type="submit" :loading="loading">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </ValidationObserver>
        </v-dialog>

      <user-create-update @getUserList="getUserList" ref="userFormRef"/>
    </div>
</template>

<script>
import WarningDialog from "../../components/ui/prompt/warning-dialog";
import FullLoading from "../../components/ui/loading/full-loading";
import UserCreateUpdate from "../../components/user/CreateUpdate";

export default {
    components: {UserCreateUpdate, FullLoading, WarningDialog},
    data() {
        return {
            deleteItem: null,
            showWarningModal: false,
            items: [],
            headers: [
                {
                    text: 'Id#',
                    value: 'id'
                },
                {
                    text: 'Имя',
                    value: 'name'
                },
                {
                    text: 'Почта',
                    value: 'email'
                },
                {
                    text: 'Телефон',
                    value: 'phone'
                },
                {
                    text: 'Статус',
                    value: 'status'
                },
                {
                    text: 'Действия',
                    value: 'actions'
                }
            ],
            roles: [],
            selectedRoles: [],
            roleDialog: false,
            id: null,
            loading: false
        }
    },
    computed: {
        isSelectedAllRoles: {
            get() {
                return this.selectedRoles.length === this.roles.length
            },
            set(val) {
                if (val) {
                    this.selectedRoles = this.roles
                } else {
                    this.selectedRoles = []
                }
            }
        }
    },
    methods: {
        changeStatus(item) {
            item.loading = true
            const status = item.status === 0 ? 0 : 10
            this.$http.post(`users/change/${item.id}`, {status})
                .then(res => {
                    item.status = res.data.data.status;
                    this.getUserList();
                }).finally(() => {
                item.loading = false;
            })
        },
        setDeleteItem(item) {
            this.showWarningModal = true
            this.deleteItem = item;
        },
        getUserList() {
            this.$store.commit('showLoading')
            this.$http.get('/users/list')
                .then(res => {
                    this.items = res.data.data;
                })
                .catch(err => this.$store.commit('showErrorMessage', err))
                .finally(() => this.$store.commit('clearLoading'))
        },
        getRoleList() {
            this.$store.commit('showLoading')
            this.$http.get('/roles/list')
                .then(res => {
                    if (res.data.success) {
                        this.roles = res.data.data;
                    }
                })
                .catch(err => this.$store.commit('showErrorMessage', err))
                .finally(() => this.$store.commit('clearLoading'))
        },
        openRoleModal(item) {
            this.id = item.id;
            item.roles.forEach(item => {
                this.selectedRoles.push(item.name);
            });
            this.roleDialog = true
        },
        attach() {
            this.loading = true;
            this.$http.put('users/attach-role/' + this.id, {roles: this.selectedRoles})
                .then(res => {
                    if (res.data.success) {
                        this.$store.commit('showSnackbar', 'Successfully attached');
                    }
                }).catch(err => {
                this.$store.commit('showErrorMessage', err)
            }).finally(() => {
                this.getUserList();
                this.roleDialog = false;
                this.loading = false;
            })
        },
        removeUser() {
            const id = this.deleteItem.id
            if (id) {
                this.$store.commit('showLoading')
                this.$http.delete(`/users/${id}`).then(() => {
                    this.items = this.items.filter(item => item.id !== id)
                    this.deleteItem = null
                }).catch(err => this.$store.commit('showErrorMessage', err))
                    .finally(() => this.$store.commit('clearLoading'))
            }
        },
        openDialog() {
           const {userFormRef} = this.$refs
            userFormRef.openDialog()
        },
    },
    created() {
        this.getUserList()
        this.getRoleList()
    }
}
</script>


<style>

</style>
