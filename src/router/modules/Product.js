export default [
	{
		path: 'products',
		name: 'products-index',
		meta: {
			title: 'Продукты'
		},
		component: () => import('../../views/products/index.vue')
	},
	{
		path: 'products/create',
		name: 'products-create',
		meta: {
			title: 'Создать Продукт'
		},
		component: () => import('../../views/products/item.vue')
	},
	{
		path: 'products/update/:id',
		name: 'products-update-id',
		meta: {
			title: 'Изменить Продукт'
		},
		component: () => import('../../views/products/item.vue')
	},
]
