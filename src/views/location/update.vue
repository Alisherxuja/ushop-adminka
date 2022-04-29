<template>
    <dynamic-form
            :has-status="false"
            :on-init="init"
            :fields="fields"
            resource="locations"></dynamic-form>
</template>

<script>
    export default {
        data: () => ({
            fields: [
                {
                    type: 'text',
                    label: 'Имя en',
                    rules: 'required',
                    value: '',
                    name: 'name_en',
                    md: 4
                },
                {
                    type: 'text',
                    label: 'Имя ru',
                    rules: 'required',
                    value: '',
                    name: 'name_ru',
                    md: 4
                },
                {
                    type: 'text',
                    label: 'Имя uz',
                    rules: 'required',
                    value: '',
                    name: 'name_uz',
                    md: 4
                },
                {
                    type: 'autocomplete',
                    label: 'Регион',
                    value: null,
                    items: [],
                    name: 'parent_id',
                    md: 4
                },
            ]
        }),
        methods: {
            init() {
                return new Promise((resolve, reject) => {
                    this.$http.get('/locations/list').then(res => {
                        this.fields.map(item => {
                            if (item.name === 'parent_id') {
                                item.items = res.data.data
                            }
                            return item;
                        });
                        resolve(true)
                    }).catch(err => {
                        reject(err)
                    })
                })
            }
        }
    }
</script>
