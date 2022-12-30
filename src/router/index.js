import { createRouter, createWebHashHistory } from "vue-router"

// viewsのvueファイルにRouterする際は加える
import indexView from "@/views/indexView.vue"
import viewList from "@/views/viewList.vue"

const routes = [
    {
        // props, enumのテスト用
        path: "/index",
        name: "indexView",
        component: indexView,
    },
    {
        // ホーム画面、実質この1ページのみ
        path: "/",
        name: "viewList",
        component: viewList,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
