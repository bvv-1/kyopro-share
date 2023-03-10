import { createRouter, createWebHashHistory } from "vue-router"

// viewsのvueファイルにRouterする際は加える
import viewAbout from "@/views/viewAbout.vue"
import viewList from "@/views/viewList.vue"
import viewQueue from "@/views/viewQueue.vue"
import submitProblem from "@/views/submitProblem.vue"
import submitEdit from "@/views/submitEdit.vue"
import viewDetail from "@/views/viewDetail.vue"

const routes = [
  {
    // 遊び方
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
  {
    // edit画面
    path: "/edit",
    name: "submitEdit",
    component: submitEdit,
  },
  {
    // おすすめ文を見るページ
    path: "/detail",
    name: "viewDetail",
    component: viewDetail,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
