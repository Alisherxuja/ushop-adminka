<template>
    <custom-table :headers="headers"
                  :can-mixin="'admin.faqs.create'"
                  :can-mixin-delete="'admin.faqs.delete'"
                  :can-mixin-edit="'admin.faqs.update'"
                  resource="faqs"></custom-table>
</template>

<script>
export default {
    data() {
        return {
            headers: [
                {
                    text: 'id',
                    value: 'id',
                },
                {
                    text: 'Название',
                    value: 'question',
                },
                {
                    text: 'ЧПУ',
                    value: 'answer',
                },
            ]
        }
    }
}
</script>
