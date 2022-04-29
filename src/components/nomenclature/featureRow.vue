<template>
    <tr style="vertical-align: middle">
        <td style="width: 30%" class="pl-0">
            {{feature.name}}
        </td>
        <td style="width: 70%">
            <validation-provider  v-slot="{errors}">
                <v-autocomplete
                        :error-messages="errors[0]"
                        outlined
                        dense
                        multiple
                        :items="allValues"
                        item-text="value"
                        item-value="value_en"
                        v-model="values"/>
            </validation-provider>
        </td>
    </tr>
</template>

<script>
    export default {
        props: {
            feature: {
                type: Object
            },
            selectedValues: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            allValues() {
                return this.feature['feature_value_active'] || []
            },
            values: {
                get() {
                    return this.selectedValues
                },
                set(allValues) {
                    const values = allValues.reduce((value, value_en) => {
                        const findValue = this.allValues.find(item => item.value_en === value_en);
                        if (findValue) {
                            value.push(findValue)
                        }
                        return value
                    }, [])
                    this.$emit('updateValues', {id: this.feature.id, values})
                }
            },
            valuesIsRequired() {
                const typesRequired = [
                    'checkbox',
                    'radio'
                ]
                return this.feature.type ? typesRequired.includes(this.feature.type) : false
            }
        }
    }
</script>