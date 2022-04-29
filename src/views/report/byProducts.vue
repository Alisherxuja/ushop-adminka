<template>
  <div>
    <v-card-title class="px-0">
      <div class="d-flex justify-space-between" style="width: 100%">
        <h4>Отчёт по товарам</h4>
        <div class="d-flex">
          <v-card style="margin-right: 10px;">
            <div>
              <v-menu
                v-model="fromDateModal"
                :close-on-content-click="false"
                offset-y
                transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filter.from"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    hide-details
                    label="От"
                    outlined
                    prepend-inner-icon="fas fa-calendar-alt"
                    readonly>
                    <template v-if="filter.from" v-slot:append>
                      <v-btn class="mt-1" icon x-small @click="filter.from  = null">
                        <v-icon small> fas fa-times</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker v-model="filter.from"
                               no-title
                               width="235"
                               @input="fromDateModal = false"></v-date-picker>
              </v-menu>
            </div>
          </v-card>
          <v-card style="margin-right: 10px;">
            <div>
              <v-menu
                v-model="toDateModal"
                :close-on-content-click="false"
                offset-y
                transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filter.to"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    hide-details
                    label="До"
                    outlined
                    prepend-inner-icon="fas fa-calendar-alt"
                    readonly>
                    <template v-if="filter.to" v-slot:append>
                      <v-btn class="mt-1" icon x-small @click="filter.to  = null">
                        <v-icon small> fas fa-times</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker v-model="filter.to"
                               no-title
                               width="235"
                               :max="new Date().toISOString()"
                               @input="toDateModal = false"></v-date-picker>
              </v-menu>
            </div>
          </v-card>
          <v-btn color="primary" style="height: 40px" @click="getData">
            Филтер
          </v-btn>
          <v-btn color="primary" style="height: 40px" class="ml-2" @click="exportToExcel">
            Экспорт в Excel
          </v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-default-footer
        >
          <template v-slot:item.name="{item}">
            <router-link :to="'/products/' + item.id">
              {{ item.name }}
            </router-link>
          </template>
          <template v-slot:item.ai_price="{item}">
            <b>{{ item.ai_price | money }}</b>TL
          </template>
          <template v-slot:item.tl_course="{item}">
            <b>{{ item.tl_course | money }}</b>$
          </template>
          <template v-slot:item.usd_course="{item}">
            <b>{{ item.usd_course | money }}</b> UZS
          </template>
          <template v-slot:item.ai_sum="{item}">
            <b>{{ item.ai_sum | money }}</b> UZS
          </template>
          <template v-slot:item.cargo_price="{item}">
            <b>{{ item.cargo_price }}</b>$
          </template>
          <template v-slot:item.cargo_sum="{item}">
            <b>{{ item.cargo_sum | money }}</b> UZS
          </template>
          <template v-slot:item.percent="{item}">
            <b>{{ item.percent }}</b>%
          </template>
          <template v-slot:item.ai_sum_with_income="{item}">
            <b>{{ item.ai_sum_with_income | money }}</b> UZS
          </template>
          <template v-slot:item.price="{item}">
            <b>{{ item.price | money }}</b> UZS
          </template>
          <template v-slot:item.qty="{item}">
            <b>{{ item.qty }}</b>шт.
          </template>
          <template v-slot:item.real_cargo="{item}">
            <b>{{ item.real_cargo }}</b>$
          </template>
          <template v-slot:item.real_cargo_sum="{item}">
            <b>{{ item.real_cargo_sum | money }}</b> UZS
          </template>
          <template v-slot:item.turnover="{item}">
            <b>{{ item.turnover | money }}</b> UZS
          </template>
          <template v-slot:item.cost_price="{item}">
            <b>{{ item.cost_price | money }}</b> UZS
          </template>
          <template v-slot:item.turnover_without_cargo="{item}">
            <b>{{ item.turnover_without_cargo | money }}</b> UZS
          </template>
          <template v-slot:item.purchase="{item}">
            <b>{{ item.purchase | money }}</b> UZS
          </template>
          <template v-slot:item.profit="{item}">
            <b>{{ item.profit | money }}</b> UZS
          </template>
          <template v-slot:item.marga="{item}">
            <b>{{ item.marga }} %</b>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-pagination
      v-show="options.lastPage > 1"
      v-model="options.page"
      :length="options.lastPage"
      :total-visible="12"
      @input="getData">
    </v-pagination>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      fromDateModal: false,
      toDateModal: false,
      headers: [
        {text: 'Наименование', value: 'name', width: 300},
        {text: 'Артикул', value: 'barcode'},
        {text: 'Цена (TL)', value: 'ai_price'},
        {text: 'Курс TL-$', value: 'tl_course'},
        {text: 'Курс $-сум', value: 'usd_course', width: 150},
        {text: 'Цена TL-(сум)', value: 'ai_sum'},
        {text: 'Cargo $', value: 'cargo_price'},
        {text: 'Cargo сум', value: 'cargo_sum', width: 150},
        {text: 'Наценка', value: 'percent'},
        {text: 'Цена Tl + Наценка', value: 'ai_sum_with_income'},
        {text: 'Цена OUTLAS', value: 'price'},
        {text: 'Продано', value: 'qty'},
        {text: 'Cargo новый', value: 'real_cargo'},
        {text: 'Cargo новая цена', value: 'real_cargo_sum'},
        {text: 'Оборот', value: 'turnover', width: 150},
        {text: 'Себестоимость', value: 'cost_price'},
        {text: 'Цена', value: 'turnover_without_cargo', width: 150},
        {text: 'Закупка', value: 'purchase', width: 150},
        {text: 'Прибыль', value: 'profit', width: 150},
        {text: 'Маржа', value: 'marga'},
      ],
      items: [],
      filter: {
        from: null,
        to: null
      },
      options: {
        page: 1,
        perPage: 20,
        lastPage: 0
      }
    }
  },
  methods: {
    async getData() {
      this.$store.commit('showLoading');
      try {
        let params = {...this.filter, ...this.options}
        const {data} = await this.$http.get('reports/products', {params: params})
        this.items = data.data;
        this.options.lastPage = data.links.last_page;
      } catch (e) {
        this.$store.commit('showErrorMessage', e);
      } finally {
        this.$store.commit('clearLoading');
      }
    },
    async exportToExcel() {
      this.$store.commit('showLoading');
      try {
        let params = {...this.filter, ...this.options}
        const {data} = await this.$http.get('reports/export-products', {params: params, responseType: 'blob'});
        const url = URL.createObjectURL(new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Отчёт по товарам.xlsx');
        document.body.appendChild(link);
        link.click()
      } catch (e) {
        this.$store.commit('showErrorMessage', e);
      } finally {
        this.$store.commit('clearLoading');
      }
    },
    clearFilters() {
      this.filter = {
        from: null,
        to: null,
        product_name: null,
        name: null
      }
      this.getData();
    }
  },
  created() {
    this.getData();
  }
}
</script>

<style scoped>

</style>
