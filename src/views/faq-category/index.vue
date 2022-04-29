<template>
  <custom-table :headers="headers"
                :can-mixin="'admin.faqCategories.faqCategoriesCreate'"
                :can-mixin-delete="'admin.faqCategories.faqCategoriesDelete'"
                :can-mixin-edit="'admin.faqCategories.faqCategoriesUpdate'"
                create-route-name="faq-categories-create" deleteItemApi="faqs/category/delete" getListApi="faqs/category/index"
                updateRouteName="faq-categories-update-id"></custom-table>
</template>

<script>

export default {
  data() {
    return {
      headers: [
        {
          text: 'id',
          value: 'id'
        },
        {
          text: 'Название',
          value: 'name'
        }
      ]
    }
  }
}
</script>
