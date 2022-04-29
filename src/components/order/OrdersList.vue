<template>
    <div>
        <v-card-title class="px-0">
            <div class="d-flex justify-space-between" style="width: 100%">
                <h4>{{ title }}</h4>
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
                                        v-model="filters.date_from"
                                        v-bind="attrs"
                                        v-on="on"
                                        dense
                                        hide-details
                                        label="От"
                                        outlined
                                        prepend-inner-icon="fas fa-calendar-alt"
                                        readonly>
                                        <template v-if="filters.date_from" v-slot:append>
                                            <v-btn class="mt-1" icon x-small @click="filters.date_from  = null">
                                                <v-icon small> fas fa-times</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-text-field>
                                </template>
                                <v-date-picker v-model="filters.date_from"
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
                                        v-model="filters.date_to"
                                        v-bind="attrs"
                                        v-on="on"
                                        dense
                                        hide-details
                                        label="До"
                                        outlined
                                        prepend-inner-icon="fas fa-calendar-alt"
                                        readonly>
                                        <template v-if="filters.date_to" v-slot:append>
                                            <v-btn class="mt-1" icon x-small @click="filters.date_to  = null">
                                                <v-icon small> fas fa-times</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-text-field>
                                </template>
                                <v-date-picker v-model="filters.date_to"
                                               no-title
                                               width="235"
                                               :max="new Date().toISOString()"
                                               @input="toDateModal = false"></v-date-picker>
                            </v-menu>
                        </div>
                    </v-card>
                    <v-btn color="primary" style="height: 40px" @click="filterHandler">
                        Филтер
                    </v-btn>
                </div>
            </div>
        </v-card-title>
        <v-card>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page="options.perPage"
                    hide-default-footer>
                    <template v-slot:body.prepend>
                        <tr>
                            <td>
                                <v-text-field
                                    v-model="filters.id"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                ></v-text-field>
                            </td>
                            <td>
                                <v-text-field
                                    v-model="filters.username"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                    type="text"
                                ></v-text-field>
                            </td>
                            <td>
                                <v-text-field
                                    v-model="filters.amount"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                ></v-text-field>
                            </td>
                            <td>
                                <v-text-field
                                    v-model="filters.address"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                ></v-text-field>
                            </td>
                            <td></td>
                            <td>
                                <v-text-field
                                    v-model="filters.phone"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                ></v-text-field>
                            </td>
                            <td>
                                <v-autocomplete
                                    v-model="filters.status"
                                    :items="$store.state.orderStatus"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                ></v-autocomplete>
                            </td>
                            <td>
                                <div class="d-flex">
                                    <v-btn class="mx-2 mt-1" color="error" height="30" x-small @click="clearFilterHandler">
                                        <v-icon small>fas fa-times</v-icon>
                                    </v-btn>
                                    <v-btn class="mt-1" color="primary" height="30" x-small @click="filterHandler">
                                        <v-icon small>fas fa-search</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-slot:item.total_price="{item}">
                        {{ item.total_price|money }}
                    </template>
                    <template v-slot:item.status="{item}">
                        <v-chip :color="getColor(item.status)" label outlined small>
                            {{ item.status_name }}
                        </v-chip>
                    </template>
                    <template v-slot:item.username="{item}">
                        {{ item.name }}
                    </template>
                    <template v-slot:item.action="{item}">
                        <v-btn color="#0aa89e" small @click="$router.push({name: 'order-item-id', params: {id: item.id}})">
                            <v-icon color="#fff">fas fa-eye</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>

        </v-card>
        <v-pagination
            v-show="options.lastPage > 1"
            v-model="options.page"
            :length="options.lastPage"
            :total-visible="12"
            @input="changePage">
        </v-pagination>
    </div>
</template>

<script>
export default {
    name: "OrdersList",
    props: {
        delivery: {
            type: Boolean,
            required: false,
            default: false,
        },
        cancel: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    data() {
        return {
            fromDateModal: false,
            toDateModal: false,
            items: [],
            dateModal: false,
            filters: {
                id: null,
                username: null,
                total_price: null,
                address: null,
                date: null,
                phone: null,
                status: null,
                action: null,
            },
            headers: [
                {
                    text: 'Id',
                    value: 'id',
                    filterable: {}
                },
                {
                    text: 'Username',
                    value: 'username',
                    filterable: {}
                },
                {
                    text: 'Сумма',
                    value: 'total_price',
                    filterable: {}
                },
                {
                    text: 'Адрес',
                    value: 'address',
                    filterable: {}
                },
                {
                    text: 'Дата',
                    value: 'date',
                    width: 200,
                    filterable: {}
                },
                {
                    text: 'Телефон',
                    value: 'phone',
                    filterable: {}
                },
                {
                    text: 'Статус',
                    value: 'status',
                    filterable: {
                        value: null
                    }
                },
                {
                    text: 'Действия',
                    value: 'action',
                    sortable: false
                },
            ],
            options: {
                page: 1,
                perPage: 15,
                lastPage: 0
            }
        }
    },
    methods: {
        getOrders(query = {}) {
            if (this.delivery) this.getDeliveryList(query);
            else if (this.cancel) this.getCancelList(query);
            else this.getOrdersList(query)
        },
        changePage(val) {
            const {page: queryPage} = this.$route.query
            if (+queryPage !== val) {
                this.getOrdersList()
                this.$router.replace({query: {...this.$route.query, page: val}})
            }
        },
        getOrdersList(query = {}) {
            const {page, perPage: per_page} = this.options
            query = {
                ...query,
                page,
                per_page
            }
            this.$store.commit('showLoading')
            this.$http.get('orders', {
                params: query
            }).then(res => {
                const {links: {last_page: lastPage}} = res.data
                this.items = res.data.data
                this.options.lastPage = lastPage
            }).catch(err => {
                this.$store.commit('showErrorMessage', err)
            }).finally(() => this.$store.commit('clearLoading'))
        },
        getDeliveryList(query = {}) {
            this.$store.commit('showLoading')
            this.$http.get('orders/delivered', {
                params: query
            }).then(res => {
                this.items = res.data.data
                this.pagesCount = res.data.links.total
            }).catch(err => {
                this.$store.commit('showErrorMessage', err)
            }).finally(() => this.$store.commit('clearLoading'))
        },
        getCancelList(query = {}) {
            this.$store.commit('showLoading')
            this.$http.get('orders/cancelled', {
                params: query
            }).then(res => {
                this.items = res.data.data
                this.pagesCount = res.data.links.total
            }).catch(err => {
                this.$store.commit('showErrorMessage', err)
            }).finally(() => this.$store.commit('clearLoading'))
        },
        filterHandler() {
            this.options.page = 1
            this.getOrders(this.filters)
            const query = {}
            Object.keys(this.filters).forEach(item => {
                if (this.filters[item]) {
                    query[item] = this.filters[item]
                }
            })
            this.$router.push({query})
        },
        clearFilterHandler() {
            this.filters = {
                id: null,
                name: null,
                amount: null,
                address: null,
                date_from: null,
                date_to: null,
                phone: '',
                status: null
            }
            this.getOrders(this.filters)
            this.$router.push({query: {}})
        },
        getColor(status) {
            const currentStatus = this.$store.state.statusColors.find(i => i.status === status);
            return currentStatus ? currentStatus.color : '';
        },
    },
    computed: {
        title: function () {
            return this.$route.meta.title
        },
    },
    mounted() {
        const {page} = this.$route.query
        if (page) {
            this.options.page = +page
        }
        this.getOrders()
    }
}
</script>

<style scoped>

</style>
