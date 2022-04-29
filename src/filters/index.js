import moment from 'moment'
const filters = {
    status(value) {
        if (value === 0) return "Не активный"
        if (value === 10) return "Активный"
        return "Не определен"
    },
    genderType(value) {
        switch (value) {
            case 'f':
                return "Женщина"
            case 'm':
                return "Мужчина"
            case "ch":
                return "Дети"
        }
    },
    percentable (val) {
        if(!val) return ''
        return  val + '%'
    },
    orderStatus(value) {
        switch (value) {
            case 0:
                return "Отменено"
            case 1:
                return "Новый заказ"
            case 2:
                return "Заказ принят"
            case 3:
                return "Заказ в пути"
            case 4:
                return "Доставлен в Узбекистан"
            case 10:
                return "Доставлено"
        }
    },
    cardType(value) {
        switch (value) {
            case 'cash':
                return  value
            case 'card':
                return  value
            case 'self_card':
                return  value
            default:
                return value
        }
    },
    money (val) {
        return val ? val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') : 0
    },
    ifNone(value) {
        if (!value) return "Не определен"
        return value
    },
    formatterDate(value) {
        return moment(value).format('YYYY-MM-DD')
    },
    formatterFullTime(value) {
        return moment(value).format('YYYY-MM-DD HH:MM')
    },
    formatterPhone(value) {
        if(!value) return  ''
        return  value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/g, '$1 $2 $3 $4')
    }
}

export default {
    install(Vue) {
        Object.keys(filters).forEach(filter => {
            Vue.filter(filter, filters[filter])
        })
    }
}
