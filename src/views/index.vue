<template>
  <div>

    <v-row>
      <v-col cols="12" md="2">
        <v-menu
            v-model="firstPicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                solo
                dense
                v-model="dateFrom"
                label="Дата от"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="dateFrom"
              @input="firstPicker = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="2">
        <v-menu
            v-model="secondPicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                solo
                dense
                v-model="dateTo"
                label="Дата до"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="dateTo"
              @input="secondPicker = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn color="primary" elevation="4" :loading="loading" @click="getDashboardData">Показать</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" lg="6">
        <v-row>
          <v-col cols="12" md="2" lg="3">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2 mb-1">Посещения за день</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    11<p :class="11 > 0 ? 'in' : 'out'">{{ parseInt(18) }}%</p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="3" lg="2">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2 mb-1">Заказы за месяц</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    32<p :class="32 > 0 ? 'in' : 'out'">{{ 32 }}%</p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" lg="4">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2 mb-1">Оборот за месяц</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    {{ 1508000 | money }} <p>Сум</p>
                    <p :class="13 > 0 ? 'in':'out'">{{ 13 }}%</p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="3" lg="3">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2 mb-1">Конверсия</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    1.6<p class="out">-56%</p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <v-row>
          <v-col cols="12" md="5" lg="5">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2 mb-1">Новые заказы на сегодня</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    {{ 12 }} <p>на</p> {{ 780600 | money }} <p>Сум</p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" lg="4">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2 mb-1">Заказы в обработке</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    {{ 3 }} <p>на</p> {{ 690000 | money }} <p>Сум</p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="3" lg="3">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2 mb-1">Общее кол-во заказов на сегодня</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    {{ 4 }} <p>на</p> {{ 5966300 | money }} <p>Сум</p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
let date = new Date();
let y = date.getFullYear();
let m = date.getMonth();
let d = date.getDate();
import VueApexCharts from 'vue-apexcharts';

export default {
  components: {VueApexCharts},
  data() {
    return {
      dateFrom: new Date(y, m - 1, d, 5).toISOString().substr(0, 10),
      dateTo: new Date(y, m, d, 5).toISOString().substr(0, 10),
      firstPicker: false,
      secondPicker: false,
      loading: false,
    }
  },
  created() {
    // this.getDashboardData();
  },
  methods: {
    getDashboardData() {
      this.loading = true;
      this.$http.get('dashboard', {params: {date_from: this.dateFrom, date_to: this.dateTo}})
          .then(res => {

          })
          .catch(err => {

          })
          .finally(() => {
            this.loading = false;
          })
    },
  }

}
</script>
<style scoped lang="scss">
.headline p {
  font-size: 15px;
  display: inline;

  &.in {
    color: #2E7D32;
    margin-left: 10px;
  }

  &.out {
    color: #C62828;
    margin-left: 10px;
  }
}

.chart-header {
  padding: 10px 15px;
  background: #eee;
  line-height: 1;
  border-bottom: 1px solid #ccc;
  color: #000;
}
</style>
