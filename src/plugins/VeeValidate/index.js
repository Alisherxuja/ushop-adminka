import {ValidationObserver, ValidationProvider, extend} from 'vee-validate'
import {email, required} from 'vee-validate/dist/rules'
import * as rules from 'vee-validate/dist/rules';

extend('email', {
    ...email,
    message: 'Email введено неправильно'
});
extend('required', {
    ...required,
    message: '{_field_} поле обязательно для заполнения'
})

extend('confirmed', {
    params: ['value', 'fieldName'],
    validate(value, {value: fieldValue}) {
        return value === fieldValue
    },
    message(field, {fieldName}) {
        return `Поле ${field} не совпадает с ${fieldName}`
    }
})


extend('objectKeyRequired', {
    params: ['key'],
    validate(obj, args) {
        return !!obj[args['key']]
    }
})

Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

export default {
    install(Vue) {
        Vue.component('ValidationProvider', ValidationProvider);
        Vue.component('ValidationObserver', ValidationObserver);
    }
}