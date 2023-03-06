import { createRouter, createWebHashHistory } from "vue-router"

// viewsのvueファイルにRouterする際は加える
import indexView from "@/views/indexView.vue"
import viewAbout from "@/views/viewAbout.vue"
import viewList from "@/views/viewList.vue"
import viewQueue from "@/views/viewQueue.vue"
import submitProblem from "@/views/submitProblem.vue"

const routes = [
  {
    // props, enumのテスト用
    path: "/index",
    name: "indexView",
    component: indexView,
  },
  {
    // About
    path: "/about",
    name: "viewAbout",
    component: viewAbout,
  },
  {
    // ホーム画面、実質この1ページのみ
    path: "/",
    name: "viewList",
    component: viewList,
  },
  {
    // 編集依頼のキュー画面
    path: "/queue",
    name: "viewQueue",
    component: viewQueue,
  },
  {
    // submit画面
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
