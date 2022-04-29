<template>
  <div>
    <v-toolbar flat class="px-0">
      <v-toolbar-title><h4>{{ title }}</h4></v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="button.prepend"></slot>
      <v-btn v-if="addItem && isCrud && can(canMixin)" color="primary" dark class="mb-2"
             :to="{name: createRouteName || `${resource}-create`}">Добавить
        новый
      </v-btn>
    </v-toolbar>

    <v-card style="width: 100%;">
      <v-card-text>
        <v-data-table
            :headers="allHeaders"
            :items="items"
            :items-per-page="perPage"
            :loading="loading"
            :options.sync="options"
            :multi-sort="true"
            hide-default-footer>
          <template v-slot:top>
          </template>
          <template v-slot:item.action="{ item }">
            <slot name="item.action" :item="item">

              <v-btn color="warning" v-if="can(canMixinEdit)"
                     :to="{name: updateRouteName || `${resource}-update-id`, params: getParams(item.id)}" small dark
                     icon>
                <v-icon small>
                  fas fa-pencil-alt
                </v-icon>
              </v-btn>

              <v-btn icon color="error" v-if="can(canMixinDelete)" small dark>
                <v-icon small @click.prevent="showDialog(item)">
                  far fa-trash-alt
                </v-icon>
              </v-btn>

            </slot>
          </template>
          <!--+-+---+-+---+-+- | slot item in body table |--+-+---+-+---+-+--->
          <template v-for="col in headers" v-slot:[`item.${col.value}`]="{item}">
            <slot :name="`item.${col.value}`" :item="item">
              {{ item[col.value] }}
            </slot>
          </template>

          <!--+-+---+-+---+-+- | filter table |--+-+---+-+---+-+--->
          <template v-slot:body.prepend v-if="filterable">
            <tr>
              <td class="pt-2 pb-2"
                  v-for="(item, index) in headers">
                <div v-if="item.filterable">
                  <slot :name="`filter.${item.filterable.name}`" :index="index" :item="item">
                    <v-text-field
                        @keydown.enter.prevent="filterHandler"
                        v-model="item.filterable.value"
                        dense
                        outlined
                        clearable
                        :hide-details="true">
                    </v-text-field>
                  </slot>
                </div>
              </td>
              <td
                  class="pt-2 pb-2 action-td ">
                <div class="d-flex">
                  <v-btn @click="clearFilter" color="error" class="mr-1" x-small style="height: 38px">
                    <v-icon>fas fa-times</v-icon>
                  </v-btn>
                  <v-btn color="primary" @click="filterHandler" x-small style="height: 38px">
                    <v-icon>fas fa-search</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>

      <full-loading v-model="loading"/>
    </v-card>
    <v-pagination class="mt-4" v-if="allCount > perPage" v-model="page" :total-visible="15" :disabled="loading"
                  :length="pagesCount"></v-pagination>
    <warning-dialog ref="deleteDialog" v-model="dialog" @apply="deleteItem"></warning-dialog>
  </div>
</template>

<script>
import FullLoading from "../../../components/ui/loading/full-loading";
import WarningDialog from "@/components/ui/prompt/warning-dialog";

export default {
  name: 'CustomTable',
  components: {WarningDialog, FullLoading},
  props: {
    canMixin: {
      type: String,
    },
    canMixinDelete: {
      type: String,
    },
    canMixinEdit: {
      type: String,
    },
    isCrud: {
      type: Boolean,
      default: true
    },
    queryOptions: {
      type: Boolean,
      default: true
    },
    deleteItemApi: {
      type: String
    },
    getListApi: {
      type: String
    },
    createRouteName: {
      type: String,
    },
    updateRouteName: {
      type: String
    },
    searchQuery: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      default: () => []
    },
    resource: {
      type: String,
    },
    addItem: {
      type: Boolean,
      default: true
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    addFilters: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      items: [],
      allHeaders: [],
      page: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
      perPage: 15,
      allCount: 0,
      loading: false,
      options: {},
      forDelete: {},
      dialog: false,
      queryTimeout: null,
      deleteLoading: false,
    }
  },
  computed: {
    filters() {
      let filters = [];
      this.headers.forEach(item => {
        if (item.filterable) {
          if (!item.filterable.name) {
            item.filterable.name = item.value
          }
          filters.push(item.filterable)
        }
      });
      return filters
    },
    filterable() {
      return this.filters.length !== 0
    },
    title: function () {
      return this.$route.meta.title
    },
    pagesCount: function () {
      return Math.ceil(this.allCount / this.perPage);
    }
  },
  watch: {
    options: {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
    page: function (val) {
      if (!this.loading) {
        this.fetchData();
      }
      this.$router.push({query: {page: val}}).catch(() => {})
    },
    query: function () {
      clearInterval(this.queryTimeout);
      this.queryTimeout = setTimeout(() => {
        this.fetchData();
      }, 500);
    },
    addFilters: function () {
      this.fetchData();
    }
  },
  methods: {
    clearFilter() {
      this.filters.forEach(item => {
        item.value = null
      });
      this.fetchData();
      this.page = 1
    },
    init() {
    },
    getParams(id) {
      let params = {}
      params[this.itemKey] = id
      return params
    },
    filterHandler() {

      this.fetchData();
      this.page = 1
    },
    decryptFilter() {
      let filter = {};
      this.filters.forEach(item => {
        filter[item.name] = item.value
      });
      this.addFilters.forEach(item => {
        filter[item.name] = item.value
      });
      return filter
    },
    fetchData() {
      clearInterval(this.queryTimeout);
      let options = {}
      if (this.queryOptions) {
        options = {
          page: this.page,
          sortBy: this.options.sortBy,
          sortDesc: this.options.sortDesc,
          ...this.decryptFilter()
        }
      }
      this.$router.push({query: options}).catch(() => {})
      this.loading = true;
      this.$http.get(this.resource || this.getListApi, {params: options})
          .then(res => {
            this.items = res.data.data;
            this.setPagination(res.data.links);
            this.loading = false;
          })
          .catch(err => {
            this.$store.commit('showErrorMessage', err);
          })
          .finally(() => {
            this.loading = false;
          })
    },
    setPagination(links) {
      if (links) {
        this.perPage = links['per_page'];
        this.allCount = links.total;
      }
    },
    setHeaders() {
      this.allHeaders = [...this.headers, {text: 'Действия', value: 'action', sortable: false}]
    },
    showDialog(item) {
      this.forDelete = item;
      this.dialog = true;
    },
    deleteItem() {
      const {deleteDialog} = this.$refs
      deleteDialog.loading = true;
      this.$http.delete(this.resource + '/' + this.forDelete.id)
          .then(res => {
            if (res.data.success) {
              this.dialog = false;
              this.$store.commit('showSnackbar', 'Deleted successfully');
              this.items.splice(this.items.indexOf(this.forDelete), 1);
              if (this.items.length === 0 && this.page > 1) {
                this.page--
              }
            }
          })
          .catch(err => {
            this.$store.commit('showErrorMessage', err);
          })
          .finally(() => {
            deleteDialog.loading = false;
          })
    },
  },
  created() {
    const {query} = this.$route
    this.filters.forEach((item) => {
      if(query.hasOwnProperty(item.name) && query[item.name]) {
        item.value = query[item.name]
      }
    })
  },
  mounted() {
    this.init();
    this.setHeaders();
    // console.log(this.canMixin, this.canMixinDelete, this.canMixinEdit)
  }
};
</script>
