<template>
    <custom-table :headers="headers"
                  :can-mixin="'admin.pages.create'"
                  :can-mixin-delete="'admin.pages.delete'"
                  :can-mixin-edit="'admin.pages.update'"
                  resource="pages"></custom-table>
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
                    value: 'title_ru',
                }
            ]
        }
    }
}
</script>
