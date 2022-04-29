<template>
  <div>
    <v-toolbar flat class="px-0">
      <v-toolbar-title><h4>Пользователи</h4></v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-data-table
          :items="items"
          :headers="headers"
          :items-per-page="items.length"
          hide-default-footer
        >
          <template #body.prepend>
            <td>
            </td>
            <td>
              <v-text-field
                outlined
                dense
                class="mt-6"
                v-model="filter.name"
              />
            </td>
            <td>
              <v-text-field
                outlined
                dense
                class="mt-6"
                v-model="filter.email"
              />
            </td>
            <td>
              <v-text-field
                outlined
                dense
                class="mt-6"
                v-model="filter.phone"
              />
            </td>
            <td>
              <div class="d-flex mt-6">
                <div>
                  <v-select
                    :items="$store.state.status"
                    label="Статус"
                    outlined
                    item-text="text"
                    item-value="id"
                    v-model="filter.status"
                    dense
                  ></v-select>
                </div>
                <div class="d-flex ml-5">
                  <v-btn color="error" x-small height="35"  @click="clearFilters">
                    <v-icon>fas fa-times</v-icon>
                  </v-btn>
                  <v-btn color="primary" class="ml-2" x-small height="35"  @click="getUserList">
                    <v-icon>fas fa-search</v-icon>
                  </v-btn>
                </div>
              </div>
            </td>
          </template>
          <template v-slot:item.status="{item}">
            <v-switch
              hide-details
              class="mt-0"
              v-if="can('admin.users.changeStatus')" :true-value="10" :false-value="0" @change="changeStatus(item)"
              v-model="item.status" :loading="item.loading"></v-switch>
          </template>
          <template v-slot:item.name="{item}">
            <div v-if="item.roles && item.roles.includes('customer')">
              {{ item.name }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import WarningDialog from "../../components/ui/prompt/warning-dialog";
import FullLoading from "../../components/ui/loading/full-loading";

export default {
  components: {FullLoading, WarningDialog},
  data() {
    return {
      deleteItem: null,
      showWarningModal: false,
      items: [],
      headers: [
        {
          text: 'Id',
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
      ],
      roles: [],
      selectedRoles: [],
      roleDialog: false,
      id: null,
      loading: false,
      filter: {
        name: null,
        email: null,
        phone: null,
        status: null,
      }
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
      const status = item.status === 0 ? 0 : 10;
      this.$http.put(`users/${item.id}`, {status})
        .then(res => {
          item.status = res.data.data.status;
        }).finally(() => {
        item.loading = false;
      })
    },
    setDeleteItem(item) {
      this.showWarningModal = true;
      this.deleteItem = item;
    },
    getUserList() {
      this.$store.commit('showLoading');
      this.$http.get('/users/client/list', {params: this.filter}).then(res => {
        this.items = res.data.data.map(item => {
          item.loading = false;
          item.roles = item.roles.map(role => {
            return role.name;
          });
          return item
        })
      }).catch(err => this.$store.commit('showErrorMessage', err))
        .finally(() => this.$store.commit('clearLoading'))
    },
    clearFilters() {
      this.filter = {
        name: null,
        email: null,
        phone: null,
        status: null,
      }
      this.getUserList();
    }
  },
  created() {
    this.getUserList();
  }
}
</script>


<style>
</style>
