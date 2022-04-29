export default [
    {
        path: '/users',
        name: 'users-index',
        component: () => import('../../views/user/index')
    },
    {
        path: '/roles',
        name: 'users-role',
        component: () => import('../../views/roles/index')
    },
    // {
    //     path: '/roles/create',
    //     name: 'users-role-create',
    //     component: () => import('../../views/roles/create')
    // },
    // {
    //     path: '/roles/:id',
    //     name: 'users-role-update',
    //     props: true,
    //     component: () => import('../../views/roles/update')
    // },
    // {
    //     path: '/contacts',
    //     name: 'users-contact',
    //     component: () => import('../../views/contact/index')
    // },
    // {
    //     path: '/client-list',
    //     name: 'client-list',
    //     component: () => import('../../views/client-list/index')
    // }
]
