<template>
    <div>
        <v-navigation-drawer
            v-model="showSidebar"
            :mini-variant.sync="mini"
            app
            dark
            clipped
            class="left_bar"
        >
            <v-list
                class="left_bar_list"
            >
                <v-list-item
                    v-if="canRole(['superAdmin', 'admin'])"
                    :to="{name: 'index'}"
                    exact
                >
                    <v-list-item-content>
                        <div class="d-flex align-center">
                            <v-icon size="19">fas fa-tachometer-alt</v-icon>
                            <v-list-item-title style="margin-left: 30px; margin-top: 5px;">Главная</v-list-item-title>
                        </div>
                    </v-list-item-content>
                </v-list-item>
                <v-list-group
                    v-for="(item, ind) in items"
                    :key="ind + 'p'"
                    v-model="item.active"
                    v-if="item.hasAccess"
                    no-action
                    color="gray"
                    active-class="grey--text"
                >
                    <template v-slot:prependIcon>
                        <v-icon size="19">{{ item.icon }}</v-icon>
                    </template>
                    <template v-slot:activator>
                        <v-list-item-content class="hoverShowDiv">
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item
                        v-for="(subItem, index) in item.items"
                        v-if="subItem.hasAccess"
                        :key="subItem.title"
                        :to="subItem.to"
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                <router-link :to="subItem.to" active-class="grey--text"
                                             class="white--text text-decoration-none"
                                             v-html="subItem.title"></router-link>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>


            </v-list>
            <span class="after_left_bar"></span>
        </v-navigation-drawer>
    </div>
</template>

<script>
import canRole from "@/mixins/canRole";

export default {
    props: {
        drawer: {
            type: Boolean,
        },
        mini: {
            type: Boolean
        }
    },
    data() {
        return {
            showSidebar: this.drawer,
            items: [
                {
                    title: 'Заказы',
                    action: 'order-active',
                    icon: "fas fa-shopping-basket",
                    active: false,
                    items: [
                        {
                            title: 'Заказы',
                            to: {name: 'orders-index'},
                            hasAccess: canRole(['superAdmin'])
                        },
                        {
                            title: 'Доставки',
                            to: {name: 'deliveries-index'},
                            hasAccess: canRole(['superAdmin'])
                        },
                        {
                            title: 'Отмена',
                            to: {name: 'canceled-index'},
                            hasAccess: canRole(['superAdmin'])
                        }
                    ],
                    hasAccess: canRole(['superAdmin', 'admin'])
                },
                {
                    title: 'Продукты',
                    action: 'product-active',
                    icon: "fas fa-align-justify",
                    active: false,
                    items: [
                        {
                            title: 'Продукты',
                            to: {name: 'products-index'},
                            hasAccess: canRole(['superAdmin', 'admin', 'contentManager'])
                        },
                    ],
                    hasAccess: canRole(['superAdmin', 'admin', 'contentManager'])
                },
                {
                    title: 'Конфигурация',
                    action: 'setting-active',
                    icon: 'fa fa-cogs',
                    active: false,
                    items: [
                        {
                            title: 'Баннеры',
                            to: {name: 'banner-index'},
                            hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        },
                        {
                            title: 'Бренды',
                            to: {name: 'brands-index'},
                            hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        },
                        {
                            title: 'Категории',
                            to: {name: 'categories-index'},
                            hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        },
                        {
                            title: 'Measure',
                            to: {name: 'measure-index'},
                            hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        },
                        // {
                        //     title: 'Locations',
                        //     to: {name: 'locations-index'},
                        //     hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        // },
                        {
                            title: 'Payment Type',
                            to: {name: 'payment-types-index'},
                            hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        },
                        // {
                        //     title: 'Delivery Type',
                        //     to: {name: 'delivery-types-index'},
                        //     hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        // },
                        // {
                        //     title: 'Courier',
                        //     to: {name: 'courier-index'},
                        //     hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        // },
                        {
                            title: 'Add',
                            to: {name: 'adds-index'},
                            hasAccess: canRole(['superAdmin', 'contentManager'])
                        },
                        {
                            title: 'Faq',
                            to: {name: 'faqs-index'},
                            hasAccess: canRole(['superAdmin', 'contentManager'])
                        },
                        // {
                        //     title: 'Page',
                        //     to: {name: 'pages-index'},
                        //     hasAccess: canRole(['superAdmin', 'contentManager'])
                        // },
                        {
                            title: 'Contact',
                            to: {name: 'contact'},
                            hasAccess: canRole(['superAdmin', 'contentManager', 'seo'])
                        },
                    ],
                    hasAccess: canRole(['superAdmin', 'admin', 'contentManager', 'seo'])
                }, // references
                {
                    title: 'Пользователи',
                    action: 'user-active',
                    icon: 'fas fa-users',
                    active: false,
                    items: [
                        // {
                        //     title: 'Подписчики',
                        //     to: {name: 'subscribers-index'},
                        //     hasAccess: canRole(['superAdmin'])
                        // },
                        {
                            title: 'Роли',
                            to: {name: 'users-role'},
                            hasAccess: canRole(['superAdmin'])
                        },
                        {
                            title: 'Сотрудники',
                            to: {name: 'users-index'},
                            hasAccess: canRole(['superAdmin'])
                        },
                        // {
                        //     title: 'Пользователи',
                        //     to: {name: 'client-list'},
                        //     hasAccess: canRole(['superAdmin', 'contentManager'])
                        // }
                    ],
                    hasAccess: canRole(['superAdmin', 'admin', 'contentManager'])
                },
            ],
        }
    },
    watch: {
        drawer(val) {
            this.showSidebar = val
        },
        showSidebar(val) {
            this.$emit('update:drawer', val)
        },
        '$route.name'() {
            this.items.map(item => {
                if (item.active === true) {
                    if (this.$route.name === 'index') {
                        item.active = false
                    }
                }
            })
        }
    },
    methods: {
        navigationExpandActive() {
            this.items.map(item => {
                item.items.find(itemInner => {
                    if (this.$route.name === itemInner.to.name) {
                        item.active = true
                    }
                })
            })
        },

    },
    created() {
        this.navigationExpandActive();
    },
}
</script>


<style>
.hoverShow {
    position: absolute;
    transition: .5s;
}

.hoverShowDiv:hover .hoverShow {
    transform: translateX(200px);
}


.left_bar {
    /*background: url("https://st2.depositphotos.com/1001951/7204/i/600/depositphotos_72049899-stock-photo-confident-sharp-dressed-man-in.jpg") no-repeat center;*/
    background-size: cover;
}

.after_left_bar {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
}

.left_bar_list {
    position: relative;
    z-index: 20;
}
</style>
