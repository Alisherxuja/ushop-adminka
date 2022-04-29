<template>
    <div class="feature-div">
        <create-or-update-roles :roles="roles"></create-or-update-roles>
    </div>
</template>

<script>
import CreateOrUpdateRoles from "../../components/roles/CreateOrUpdateRoles";

export default {
    name: "update",
    components: {CreateOrUpdateRoles},
    data() {
        return {
            isLoading: false,
            roles: {},
        }
    },
    created() {
        if (this.$route.params.id) {
            this.getData();
        }
    },
    methods: {
        getData() {
            this.$showLoading()
            this.$http.get('roles/' + this.$route.params.id)
                .then(res => {
                    if (res.data.success) {
                        this.roles = res.data.data
                    }
                })
                .catch(err => {

                })
                .finally(() => {
                    this.$clearLoading()
                })
        },
    }
}
</script>

<style scoped>
.feature-div {
    min-height: 800px;
}
</style>
