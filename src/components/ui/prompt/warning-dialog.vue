<template>
    <v-dialog @click:outside="this.close" :value="value" :max-width="maxWidth">
        <v-card>
            <v-card-title class="headline">{{title}}</v-card-title>
            <v-card-text>{{description}}</v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="primary" small @click="cancel" :loading="loading">Нет</v-btn>
                <v-btn color="error" small @click="apply" :loading="loading">Да, Удалить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            maxWidth: {
              type: Number,
              default: 300
            },
            value: {
                type: Boolean
            },
            title: {
                type: String,
                default: 'Предупреждение!'
            },
            description: {
                type: String,
                default: 'Вы действительно хотите удалить этот элемент?'
            }
        },
        data() {
            return {
                loading : false
            }
        },
        methods: {
            close() {
                this.$emit('input', false)
            },
            apply() {
                this.$emit('apply');
                this.close()
            },
            cancel() {
                this.$emit('cancel');
                this.close()
            }
        }
    }
</script>