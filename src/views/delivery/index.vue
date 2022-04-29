<template>
    <div>
        <orders-list :delivery="true"></orders-list>
    </div>
</template>

<script>
	import OrdersList from "../../components/order/OrdersList";

	export default {
		components: {OrdersList},
	}
</script>
