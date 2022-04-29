<template>
    <div>
        <v-stepper v-model="step">
            <v-stepper-header class="mb-4">
                <v-stepper-step :complete="step > 1" step="1">
                    <h4>Создать продукт</h4>
                </v-stepper-step>
                <v-stepper-step :complete="step > 2" step="2">
                    <h4>Создать номенклатурный оссобенность</h4>
                </v-stepper-step>
                <v-stepper-step :complete="step > 3" step="3">
                    <h4>Добавить к номенклатуре</h4>
                </v-stepper-step>
            </v-stepper-header>
            <v-stepper-content class="pa-0" step="1">
                <v-card>
                    <v-card-text>
                        <first-step
                            v-model="step"
                            :subcategoryId.sync="subcategoryId"
                            @submit="nomenclatureFormSubmit">
                        </first-step>
                    </v-card-text>
                </v-card>
            </v-stepper-content>
            <v-stepper-content class="pa-0" step="2">
                <v-card>
                    <v-card-text>
                        <second-step
                            v-model="step"
                            :nomenclature_id="nomenclature_id"
                            :subcategoryId="subcategoryId"
                            @submit="nomenclatureFeatureSubmit">
                        </second-step>
                    </v-card-text>
                </v-card>
            </v-stepper-content>
            <v-stepper-content class="pa-0" step="3">
                <third-step
                    v-model="step"
                    :feature_values_id="feature_values_id"
                    :nomenclature_id="nomenclature_id">
                </third-step>
            </v-stepper-content>
        </v-stepper>
    </div>
</template>


<script>
import firstStep from "./firstStep";
import secondStep from "./secondStep";
import thirdStep from "./thirdStep";

export default {
    data() {
        return {
            step: 1,
            subcategoryId: null,
            nomenclature_id: null,
            feature_values_id: null,
        }
    },
    computed: {
        isUpdate() {
            return !!this.$route.params.id
        },
        id() {
            return this.$route.params.id
        }
    },
    components: {firstStep, secondStep, thirdStep},
    methods: {
        nomenclatureFormSubmit(data) {
            this.nomenclature_id = data.id
            this.step = 2;
        },
        nomenclatureFeatureSubmit(data) {
            if (data.id) {
                this.feature_values_id = data.id;
            }
            this.step = 3;
        }
    },
    mounted() {
    }

}
</script>
