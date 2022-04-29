<template>
  <div>
    <div>
      <v-card-title class="px-0">
        Роли
        <v-spacer></v-spacer>
<!--        <v-btn @click="$router.push({name: 'users-role-create'})" color="success darken-1" v-if="can('admin.roles.create')">-->
<!--          <v-icon left>fas fa-plus</v-icon>-->
<!--          Добавить новый-->
<!--        </v-btn>-->
      </v-card-title>
      <v-card>
        <v-card-text>
          <v-data-table
              :headers="header"
              :items="roles"
              :loading="isLoading"
              disable-pagination
              hide-default-footer
              disable-sort
          >
            <template v-slot:item.actions="{ item }">
              <table-actions
                  :actions="actions"
                  :item="item"
                  @deleteItem="deleteItem(item)"
                  @editItem="editItem(item)"
                  :can-mixin-delete="'admin.roles.delete'"
                  :can-mixin-edit="'admin.roles.update'"
              ></table-actions>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <div class="text-center pt-2" v-if="params.pageCount > 1">
        <v-pagination
            :length="params.pageCount"
            color="red"
            total-visible="7"
            v-model="params.page"
        ></v-pagination>
      </div>
      <v-dialog max-width="700px" v-model="dialog">
      </v-dialog>
    </div>
  </div>
</template>

<script>
import TableActions from "../../components/table/TableActions";

export default {
  name: "index",
  components: {TableActions},
  props: ['page'],
  data() {
    return {
      roles: [],
      isLoading: false,
      params: {
        page: 1,
        count: 10,
        pageCount: 0,
        totalCount: 0
      },
      header: [
        {text: 'ID', value: 'id'},
        {text: 'Название', value: 'name'},
        {text: 'Имя охранника', value: 'guard_name'},
      ],
      actions: {
        view: false,
        edit: false,
        delete: false
      },
      dialog: false,
      selectedItem: {},
      locationsList: [],
    };
  },
  watch: {
    "params.page"(val) {
      this.$router.push({name: 'roles', params: {page: val}}).catch(() => {
      });
    },
    "page": "getDevelopers"
  },
  created() {
    this.getDevelopers();
  },
  methods: {
    getDevelopers() {
      this.isLoading = true;
      this.$http.get("roles", {params: {page: this.params.page}})
          .then(response => {
            this.roles = response.data.data;
            if (response.data.links)
              this.params = {
                page: response.data.links.current_page,
                pageCount: response.data.links.last_page,
                totalCount: response.data.links.total
              };
          })
          .catch(error => {
            // this.$setErrorFromServer({error: error});
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    editItem(item) {
      this.$router.push({name: 'users-role-update', params: {id: item.id}});
    },
    refresh() {
      this.selectedItem = {};
      this.dialog = false;
      this.getDevelopers()
    },
    deleteItem(item) {
      this.isLoading = true;
      this.$http.delete("roles/" + item.id)
          .then(response => {
            if (response.data.success) {
              // this.$setSuccess({text: SUCCESS_MESSAGES.deleted});
              this.getDevelopers()
            }
          })
          .catch(error => {
            // this.$setErrorFromServer({error: error});
          })
          .finally(() => {
            this.isLoading = false;
          });
    }
  }
}
</script>

<style scoped>

</style>
