import { createRouter, createWebHashHistory } from "vue-router"
import indexView from "@/views/indexView.vue"
import viewList from "@/views/viewList.vue"
import submitProblem from "@/views/submitProblem.vue"

const routes = [
    {
        path: "/index",
        name: "indexView",
        component: indexView,
    },
    {
        path: "/",
        name: "viewList",
        component: viewList,
    },
    {
        path: "/submit",
        name: "submitProblem",
        component: submitProblem,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
