<template>
    <div>
        <v-row>
            <v-col cols="12" class="d-flex flex-column">
                <v-expansion-panels v-model="accordion">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <v-toolbar-title class="ml-0">Информация о доставке</v-toolbar-title>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="12" lg="6" md="6">
                                    <v-simple-table class="table-border">
                                        <tr v-if="deliveryInfo.address">
                                            <td class="font-weight-bold">Адрес доставки</td>
                                            <td>{{ deliveryInfo.address }}</td>
                                        </tr>
                                        <tr v-if="client.first_name">
                                            <td class="font-weight-bold">Получатель</td>
                                            <td>{{ client.first_name }}</td>
                                        </tr>
                                        <tr v-if="client.phone || deliveryInfo.phone">
                                            <td class="font-weight-bold">Телефон получателя</td>
                                            <td v-if="deliveryInfo.phone">{{ deliveryInfo.phone | formatterPhone }}</td>
                                            <td v-else-if="client.phone">{{ client.phone | formatterPhone }}</td>
                                        </tr>
<!--                                        <tr v-if="deliveryInfo.name">-->
<!--                                            <td class="font-weight-bold">Тип доставки</td>-->
<!--                                            <td>{{ deliveryInfo.name }}</td>-->
<!--                                        </tr>-->
<!--                                        <tr v-if="deliveryInfo.delivery_price">-->
<!--                                            <td class="font-weight-bold">Цена доставки</td>-->
<!--                                            <td>{{ deliveryInfo.delivery_price | money }}</td>-->
<!--                                        </tr>-->
                                    </v-simple-table>
                                </v-col>
                                <v-col cols="12" lg="6" md="6" v-if="deliveryInfo.coordinates">
                                    <GmapMap
                                        :center="position"
                                        :zoom="16"
                                        map-type-id="terrain"
                                        style="width: 100%; height: 300px"
                                        v-if="lat && lng"
                                    >
                                        <GmapMarker
                                            :draggable="true"
                                            :position="position"
                                        />
                                    </GmapMap>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>

        </v-row>
    </div>
</template>

<script>
export default {
    name: "DeliveryInfo",
    props: {
        deliveryInfo: {
            type: Object,
            required: true
        },
        client: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            accordion: 0,
            lat: null,
            lng: null,
            position: {
                lat: null,
                lng: null
            }
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            if (this.deliveryInfo.coordinates) {
                this.lat = parseFloat(this.deliveryInfo.coordinates.lat);
                this.lng = parseFloat(this.deliveryInfo.coordinates.lng);
                this.position = {
                    lat: this.lat,
                    lng: this.lng,
                }
            }
        }
    }
}
</script>

<style scoped>
.table-border tr td {
    border-bottom: 1px solid #ebebeb;
    padding: 7px 0;
}
</style>
