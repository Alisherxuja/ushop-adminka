export default [

    {
        path: '/banner',
        name: 'banner-index',
        meta: {
            title: 'Баннеры'
        },
        component: () => import('../../views/banner/index')
    },
    {
        path: '/banner/create',
        name: 'banners-create',
        component: () => import('../../views/banner/create'),
        meta: {
            title: 'Создать Баннер'
        }
    },
    {
        path: '/banner/update/:id',
        name: 'banners-update-id',
        props: true,
        component: () => import('../../views/banner/update'),
        meta: {
            title: 'Изменить Баннер'
        }
    },

    {
        path: '/brands',
        name: 'brands-index',
        meta: {
            title: 'Бренды'
        },
        component: () => import('../../views/brand/index')
    },
    {
        path: '/brands/create',
        name: 'brands-create',
        component: () => import('../../views/brand/create'),
        meta: {
            title: 'Создать бренд'
        }
    },
    {
        path: '/brands/update/:id',
        name: 'brands-update-id',
        props: true,
        component: () => import('../../views/brand/update'),
        meta: {
            title: 'Изменить бренд'
        }
    },

    {
        path: '/categories',
        name: 'categories-index',
        meta: {
            title: 'Категориии'
        },
        component: () => import('../../views/category/index')
    },
    {
        path: '/categories/create',
        name: 'categories-create',
        component: () => import('../../views/category/create'),
        meta: {
            title: 'Создать категорию'
        }
    },
    {
        path: '/categories/update/:id',
        name: 'categories-update-id',
        props: true,
        component: () => import('../../views/category/update'),
        meta: {
            title: 'Изменить категорию'
        }
    },

    {
        path: '/measure',
        name: 'measure-index',
        meta: {
            title: 'Measure'
        },
        component: () => import('../../views/measure/index')
    },
    {
        path: '/measure/create',
        name: 'measure-create',
        meta: {
            title: 'Measure'
        },
        component: () => import('../../views/measure/create')
    },
    {
        path: '/measure/:id/update',
        name: 'measure-update-id',
        meta: {
            title: 'Measure'
        },
        component: () => import('../../views/measure/update')
    },

    {
        path: '/locations',
        name: 'locations-index',
        meta: {
            title: 'Список регионов'
        },
        component: () => import('../../views/location/index')
    },
    {
        path: '/locations/create',
        name: 'locations-create',
        component: () => import('../../views/location/create'),
        meta: {
            title: 'Создать адрес'
        }
    },
    {
        path: '/locations/update/:id',
        name: 'locations-update-id',
        props: true,
        component: () => import('../../views/location/create'),
        meta: {
            title: 'Изменить адрес'
        },
    },

    {
        path: '/payment-types',
        name: 'payment-types-index',
        meta: {
            title: 'Список виды оплаты'
        },
        component: () => import('../../views/payment-type/index')
    },
    {
        path: '/payment-types/create',
        name: 'payment-types-create',
        component: () => import('../../views/payment-type/create'),
        meta: {
            title: 'Создать виды оплаты'
        }
    },
    {
        path: '/payment-types/update/:id',
        name: 'payment-types-update-id',
        props: true,
        component: () => import('../../views/payment-type/create'),
        meta: {
            title: 'Изменить виды оплаты'
        },
    },

    {
        path: '/delivery-types',
        name: 'delivery-types-index',
        meta: {
            title: 'Список виды доставки'
        },
        component: () => import('../../views/delivery-type/index')
    },
    {
        path: '/delivery-types/create',
        name: 'delivery-types-create',
        component: () => import('../../views/delivery-type/create'),
        meta: {
            title: 'Создать виды доставки'
        }
    },
    {
        path: '/delivery-types/update/:id',
        name: 'delivery-types-update-id',
        props: true,
        component: () => import('../../views/delivery-type/create'),
        meta: {
            title: 'Изменить виды доставки'
        },
    },

    {
        path: '/courier',
        name: 'courier-index',
        meta: {
            title: 'Список виды доставки'
        },
        component: () => import('../../views/courier/index')
    },
    {
        path: '/courier/create',
        name: 'courier-create',
        component: () => import('../../views/courier/create'),
        meta: {
            title: 'Создать виды доставки'
        }
    },
    {
        path: '/courier/update/:id',
        name: 'courier-update-id',
        props: true,
        component: () => import('../../views/courier/create'),
        meta: {
            title: 'Изменить виды доставки'
        },
    },

    {
        path: '/adds',
        name: 'adds-index',
        meta: {
            title: 'Список виды adds'
        },
        component: () => import('../../views/adds/index')
    },
    {
        path: '/adds/create',
        name: 'adds-create',
        component: () => import('../../views/adds/create'),
        meta: {
            title: 'Создать add'
        }
    },
    {
        path: '/adds/update/:id',
        name: 'adds-update-id',
        props: true,
        component: () => import('../../views/adds/create'),
        meta: {
            title: 'Изменить add'
        },
    },


    {
        path: '/pages',
        name: 'pages-index',
        meta: {
            title: 'Список виды pages'
        },
        component: () => import('../../views/pages/index')
    },
    {
        path: '/pages/create',
        name: 'pages-create',
        component: () => import('../../views/pages/create'),
        meta: {
            title: 'Создать page'
        }
    },
    {
        path: '/pages/update/:id',
        name: 'pages-update-id',
        props: true,
        component: () => import('../../views/pages/create'),
        meta: {
            title: 'Изменить page'
        },
    },


    {
        path: '/faqs',
        name: 'faqs-index',
        meta: {
            title: 'Список виды faqs'
        },
        component: () => import('../../views/faq/index')
    },
    {
        path: '/faqs/create',
        name: 'faqs-create',
        component: () => import('../../views/faq/create'),
        meta: {
            title: 'Создать faqs'
        }
    },
    {
        path: '/faqs/update/:id',
        name: 'faqs-update-id',
        props: true,
        component: () => import('../../views/faq/create'),
        meta: {
            title: 'Изменить faqs'
        },
    },
    {
        path: '/contact',
        name: 'contact',
        props: true,
        component: () => import('../../views/contact/index'),
        meta: {
            title: 'Contact'
        },
    },


]
