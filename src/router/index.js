import Vue from 'vue'
import VueRouter from 'vue-router'
import TokenService from "../services/TokenService";
import ReferencesRoute from "./modules/Reference";
import ProductRoute from "./modules/Product";
import UserRoutes from './modules/User'
import OrderRoutes from './modules/Order';
import login from '../views/auth/login'

Vue.use(VueRouter);

const routes = [
    {
        path: '',
        component: () => import('../layouts/main/index.vue'),
        children: [
            {
                path: '/',
                name: 'index',
                component: () => import('../views/index'),
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import('../views/profile/index') //TODO fix profile
            },
            ...ReferencesRoute,
            ...ProductRoute,
            ...OrderRoutes,

            ...UserRoutes,
            // ...Reports

        ]
    },
    {
        path: '',
        component: () => import('../layouts/empty.vue'),
        children: [
            {
                path: '/login',
                name: 'login',
                component: () => import('../views/auth/login'),
                meta: {
                    public: true,
                    onlyWhenLoggedOut: true
                }
            }
        ]
    },
    {
        path: '/check/:id',
        props: true,
        name: "check",
        component: () => import('../components/order/Check')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const isPublic = to.matched.some(record => record.meta.public);
    const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut);
    TokenService.checkExpire();
    let hasToken = !!TokenService.getToken();
    if (!isPublic && !hasToken) {
        return next({
            name: 'login'
        })
    }
    if (hasToken && onlyWhenLoggedOut) {
        return next({
            name: 'dashboard'
        })
    }
    next();
});

export default router
