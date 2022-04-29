export default [
    {
        path: '/orders',
        name: "orders-index",
        meta: {
            title: 'Заказы'
        },
        component: () => import('../../views/order/index')
    },
    {
        path: '/orders/:id',
        name: "order-item-id",
        props: true,
        meta: {
            title: 'Заказы'
        },
        component: () => import('../../views/order/item')
    },
    {
        path: '/deliveries',
        name: "deliveries-index",
        meta: {
            title: 'Доставки'
        },
        component: () => import('../../views/delivery/index')
    },
    {
        path: '/deliveries/:id',
        name: "delivery-item-id",
        props: true,
        meta: {
            title: 'Доставки'
        },
        component: () => import('../../views/delivery/item')
    },
    {
        path: '/canceled',
        name: "canceled-index",
        meta: {
            title: 'Отмена'
        },
        component: () => import('../../views/cancel/index')
    },
    {
        path: '/canceled/:id',
        name: "cancel-item-id",
        props: true,
        meta: {
            title: 'Отмена'
        },
        component: () => import('../../views/cancel/item')
    }
]
