import CustomTable from "./CustomTable";
import DynamicForm from "./DynamicForm";
import FormDrawer from "./FormDrawer";
import Content from "./Content";

export default {
    install (Vue) {
        Vue.component(CustomTable.name, CustomTable);
        Vue.component(DynamicForm.name, DynamicForm);
        Vue.component(FormDrawer.name, FormDrawer)
        Vue.component(Content.name, Content)
    }
}