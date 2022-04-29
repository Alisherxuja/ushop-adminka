<template>
    <div v-if="order_info">
        <div class="d-flex justify-space-between">
            <h3>Заказ № {{ order_info.id }}</h3>
            <!--      <router-link target='_blank' class="v-btn" :to="{name: 'check', params: {id: order_info.id} }">-->
            <!--        <v-btn class="primary">-->
            <!--          <v-icon class="mr-2">fa fa-print</v-icon>-->
            <!--          <span>Распечатать</span>-->
            <!--        </v-btn>-->
            <!--      </router-link>-->
        </div>
        <v-row>
            <v-col cols="12">
                <order-info :client="client" :order="order_info" :courier="courier"
                            @statusChanged="getOrder"></order-info>
                <delivery-info :deliveryInfo="address" :client="client"></delivery-info>
            </v-col>
            <v-col cols="12">
                <v-expansion-panels v-model="accordion">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <v-toolbar-title class="ml-0">Продукты</v-toolbar-title>
                            <template v-slot:actions>
                                <v-icon>
                                    fas fa-chevron-down
                                </v-icon>
                            </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <products-list :products="products" :order="order_info" class="mb-5"
                                           @statusChanged="getOrder"></products-list>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import OrderInfo from "../../components/order/OrderInfo";
import ProductsList from "../../components/order/ProductsList";
import DeliveryInfo from "../../components/order/DeliveryInfo";

export default {
    components: {ProductsList, OrderInfo, DeliveryInfo},
    props: ['id'],
    data() {
        return {
            courier: null,
            client: null,
            order_info: null,
            address: null,
            products: [],
            accordion: 0
        }
    },
    methods: {
        getOrder() {
            this.$store.commit('showLoading');
            this.$http.get(`orders/${this.id}`)
                .then(res => {
                    this.order_info = res.data.data.order_info;
                    this.address = res.data.data.address;
                    this.courier = res.data.data.courier;
                    this.client = res.data.data.client;
                    this.products = res.data.data.products
                })
                .finally(() => this.$store.commit('clearLoading'))
        },
    },
    mounted() {
        this.getOrder()
    }
}
</script>
<style>
.marginbt {
    margin-bottom: 100px;
}
</style>
