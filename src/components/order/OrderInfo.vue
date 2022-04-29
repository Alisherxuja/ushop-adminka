<template>
    <div>
        <v-row>
            <v-col cols="12" lg="4" v-if="client" class="d-flex flex-column">
                <v-expansion-panels v-model="accordionClient">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <v-toolbar-title class="ml-0">Информация о клиенте</v-toolbar-title>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-simple-table class="table-border">
                                <tr v-if="client.first_name">
                                    <td class="font-weight-bold">Ф.И.О</td>
                                    <td>
                                        {{ client.first_name }}
                                        {{ client.last_name }}
                                        {{ client.middle_name }}
                                    </td>
                                </tr>
                                <tr v-if="client.gender">
                                    <td class="font-weight-bold">Пол</td>
                                    <td>{{ client.gender === 'm' ? 'Мужчина' : 'Женщина' }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Телефон</td>
                                    <td>{{ client.phone | formatterPhone }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Email</td>
                                    <td>{{ client.email }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Дата регистрации</td>
                                    <td>{{ client.created_at | formatterDate }}</td>
                                </tr>
                            </v-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols="12" lg="4" class="d-flex flex-column">
                <v-expansion-panels v-model="accordionDelivery">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <v-toolbar-title class="ml-0">Информация о курьере</v-toolbar-title>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-simple-table class="table-border">
                                <tr>
                                    <td class="font-weight-bold">Имя курьера</td>
                                    <td>{{ courier.name }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Номер курьера</td>
                                    <td>
                                        {{ courier.phone }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Рейтинг курьера</td>
                                    <td>{{ courier.rate }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Номер автомобиля</td>
                                    <td>{{ courier.car_number }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Модель автомобиля</td>
                                    <td>
                                        {{ courier.car_model }}
                                    </td>
                                </tr>
                            </v-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols="12" lg="4" class="d-flex flex-column">

                <v-expansion-panels v-model="accordionOrder">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <v-toolbar-title class="ml-0">Информация о заказе</v-toolbar-title>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-simple-table class="table-border">
                                <tr>
                                    <td class="font-weight-bold">Номер заказа</td>
                                    <td>{{ order.id }} {{ order.sku ? '( SKU - ' + order.sku + ' )' : '' }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Общая сумма</td>
                                    <td>{{ order.total_price | money }} сум (Доставка - {{
                                            order.delivery_price | money
                                        }}
                                        сум)
                                    </td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Тип оплаты</td>
                                    <td>{{ order.payment_type || '' }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Статус оплаты</td>
                                    <td>
                                        {{ order.paid_status_name }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Дата заказа</td>
                                    <td>{{ order.created_at | formatterDate }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Дата последного изменение</td>
                                    <td>{{ order.updated_at | formatterDate }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Статус</td>
                                    <td>
                                        <div style="display: flex ">
                                            <v-chip :color="getColor()" label outlined small>
                                                {{ order.status_name }}
                                            </v-chip>
                                            <div class="px-2"
                                                 v-if="(order.status > 1 && order.status < 10)  && order.paid_status === 10">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn
                                                            @click="nextStatusOrder" color="info" small
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        >
                                                            <i class="fas fa-arrow-right"></i>
                                                        </v-btn>
                                                    </template>
                                                    <span>Изменит статус на следующий</span>
                                                </v-tooltip>
                                            </div>
                                        </div>
                                    </td>

                                <tr v-if="order.comment">
                                    <td class="font-weight-bold">Коммент</td>
                                    <td>{{ order.comment }}</td>
                                </tr>
                                <tr>
                                    <td class="font-weight-bold">Действия</td>
                                    <td>
                                        <div class="d-flex">
                                            <div v-if="showAcceptBtn()">
                                                <div class="px-2">
                                                    <v-tooltip top>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn
                                                                @click="payOrder" color="success" small
                                                                v-bind="attrs"
                                                                v-on="on"
                                                            >
                                                                <i class="fas fa-check"></i>
                                                            </v-btn>
                                                        </template>
                                                        <span>Принят</span>
                                                    </v-tooltip>
                                                </div>
                                            </div>
                                            <div v-if="showCancelBtn()">
                                                <div class="px-2">
                                                    <v-tooltip top>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn
                                                                @click="dialog=true" color="error" small
                                                                v-bind="attrs"
                                                                v-on="on"
                                                            >
                                                                <i class="fas fa-times"></i>
                                                            </v-btn>
                                                        </template>
                                                        <span>Отменить</span>
                                                    </v-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </v-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" width="500">
            <validation-observer ref="obs" v-slot="{handleSubmit}">
                <v-card>
                    <v-card-title>
                        <h4>Причина {{ order.paid_status === 10 ? 'реверсироват' : 'отказа' }}</h4>
                    </v-card-title>
                    <v-card-text>
                        <validation-provider name="Коментарии" rules="required" v-slot="{errors}" vid="comment">
                            <v-textarea
                                :error-messages="errors[0]"
                                dense
                                outlined
                                v-model="comment"
                            ></v-textarea>
                        </validation-provider>
                        <div class="pt-5 d-flex justify-end">
                            <div class="px-2">
                                <v-btn @click="dialog = false" color="error">Закрыть</v-btn>
                            </div>
                            <div class="px-2">
                                <v-btn @click="handleCancel" color="primary">Отправить</v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </validation-observer>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "OrderInfo",
    props: {
        order: {
            type: Object,
            required: true
        },
        client: {
            type: Object,
            required: true
        },
        courier: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            accordionClient: 0,
            accordionOrder: 0,
            accordionDelivery: 0,
            dialog: false,
            comment: null
        }
    },
    methods: {
        nextStatusOrder() {
            if (confirm('Вы действительно хотите изменить статус?')) {
                this.$http.post('orders/change/' + this.order.id)
                    .then((res) => {
                        this.$emit('statusChanged')
                    })
                    .catch(err => {
                        this.$store.commit('showErrorMessage', err)
                    })
            }
        },
        payOrder() {
            this.nextStatusOrder();
        },
        getColor() {
            const currentStatus = this.$store.state.statusColors.find(i => i.status === this.order.status);
            return currentStatus ? currentStatus.color : '';
        },
        async handleCancel() {
            let success = await this.$refs.obs.validate();
            if (!success) return;
            this.cancel()
        },
        cancel() {
            if (confirm('Вы действительно хотите отменить заказ?')) {
                this.$http.post('orders/cancel/' + this.order.id, {comment: this.comment})
                    .then(() => {
                        this.$emit('statusChanged');
                        this.dialog = false;
                    })
                    .catch(err => {
                        this.$store.commit('showErrorMessage', err)
                    })
            }
        },
        showCancelBtn() {
            return this.order.status === 1
        },
        showAcceptBtn() {
            return this.order.status === 1 //&& this.order.paid_status === 10//(this.order.paid_status === 5 && this.order.status === 1)
        },
    },
    watch: {
        dialog(val) {
            if (!val) {
                this.comment = ''
                this.$refs.obs.reset()
            }
        }
    },
}
</script>

<style scoped>
.table-border tr td {
    border-bottom: 1px solid #ebebeb;
    padding: 7px 0;
}
</style>
