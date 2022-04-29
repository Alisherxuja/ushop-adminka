<template>
  <div class="feature-div">
    <create-or-update-roles :roles="roles"></create-or-update-roles>
  </div>
</template>

<script>
import CreateOrUpdateRoles from "../../components/roles/CreateOrUpdateRoles";

export default {
  name: "create",
  components: {CreateOrUpdateRoles},
  data() {
    return {
      roles: {
        name: null,
        permissions: [],
      }
    }
  },
  created() {

  },
  methods: {}
}
</script>

<style scoped>
.feature-div {
  min-height: 800px;
}
</style>
