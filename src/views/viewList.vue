<!------------------------------------------
  javascriptの部分
------------------------------------------->
<script setup>
import { ref, computed } from "vue"
import router from "@/router"
import { supabase } from "../supabase.js"

import HeaderComponent from "@/components/HeaderComponent.vue"
import DifficultyCircle from "@/components/DifficultyCircle.vue"

// problems: データベースの中身そのまま持ってくる、登録した問題
const problems = ref([])

// sortStuff: あらゆるものをsortする関数
// Pythonと違って型によってsort法変えないといけないので条件分岐
const sortStuff = (array, key) => {
  // 例外処理
  if (array.length === 0) {
    return array
  }
  if (typeof array[0][key] === "number") {
    return array.sort((a, b) => a[key] - b[key])
  } else {
    return array.sort((a, b) => a[key].localeCompare(b[key]))
  }
}

// sortKey: currentKeyに従ってsort
const sortByKey = computed(() => (currentKey) => {
  problems.value = sortStuff(problems.value, currentKey)
})

// problemsテーブルの中身をすべてproblemsに入れる
const fetchProblems = async () => {
  const { data, error } = await supabase.from("problems").select("*")
  // console.log(error)
  problems.value = data
}
fetchProblems()

// ボタンを押したらその問題のURLを開く
const openProblem = (url) => {
  window.open(url, "_blank")
}

const goEdit = (postId) => {
  console.log(postId)
  router.push({ name: "submitEdit", query: { id: postId } })
}
</script>

<!------------------------------------------
  Reactでいうreturnの部分
  Vuetifyのワイヤーフレーム
------------------------------------------->
<template>
  <HeaderComponent />

  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <!-- 検索窓とメインを分けるだけの目的 -->
      <v-container>
        <v-row>
          <!-- 左の検索窓、タグや難易度によるソート機能を追加予定 -->
          <v-col cols="2">
            <v-sheet rounded="lg">
              <!-- 変える部分 -->
              <v-list rounded="lg">
                <v-list-item v-for="n in 2" :key="n" link>
                  <v-list-item-title>List Item {{ n }}</v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4">
                  <v-list-item-title @click="sortByKey('difficulty')">Sort by Difficulty</v-list-item-title>
                </v-list-item>
                <v-list-item link color="grey-lighten-4">
                  <v-list-item-title @click="sortByKey('created_at')">Sort by Time</v-list-item-title>
                </v-list-item>
                <v-list-item link color="grey-lighten-4">
                  <v-list-item-title @click="sortByKey('username')">Sort by Username</v-list-item-title>
                </v-list-item>
                <v-list-item link color="grey-lighten-4">
                  <v-list-item-title @click="fetchProblems()">Reload</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <!-- 右のカード置き場 -->
          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <!-- 変える部分 -->
              <v-container align="center">
                <v-row>
                  <!-- 表示幅が短くなるとカードは1行3→2→1個 -->
                  <v-col cols="12" md="6" lg="4" v-for="problem in problems" :key="problem.id">
                    <!-- カードはここ以下 -->
                    <v-card class="pa-2" maxWidth="374px" height="374px">
                      <v-container>
                        <v-row>
                          <v-col cols="2">
                            <DifficultyCircle :rating="problem.difficulty" />
                          </v-col>
                          <v-col cols="10" class="pl-0">
                            <v-card-title class="text-left pl-0">
                              {{ problem.problem_name }}
                            </v-card-title>
                          </v-col>
                        </v-row>

                        <v-card-text>
                          <v-row>
                            <v-col cols="12" align="left" class="pl-2 py-0 my-0">
                              <v-rating :value="4.5" color="amber" dense half-increments readonly size="14" />
                            </v-col>
                          </v-row>

                          <v-row align="center">
                            <v-col cols="5">
                              <div class="text-subtitle-1">
                                {{ problem.contest_id.toUpperCase() }}
                                -
                                {{ problem.problem_index }}
                              </div>
                            </v-col>

                            <v-col cols="7">
                              <div class="text-subtitle-1">by {{ problem.username }}</div>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12" style="height: 80px">
                              <div class="text-left fill-height" style="overflow: hidden; text-overflow: ellipsis">
                                <!-- 59字を超過したら三点リーダー -->
                                <div v-if="problem.reason.length <= 59">{{ problem.reason }}</div>
                                <div v-else>{{ problem.reason.substring(0, 59) }}...</div>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <!-- 横線 -->
                        <v-divider class="mx-4"></v-divider>

                        <!-- タグ付け -->
                        <v-card-text>
                          <v-chip-group active-class="deep-purple accent-4 white--text" column>
                            <v-chip>#DP</v-chip>
                            <v-chip>#BFS</v-chip>
                            <!-- <v-chip>#Union-Find</v-chip> -->
                          </v-chip-group>

                          <v-row>
                            <v-col cols="8">
                              <!-- 問題を開くボタン -->
                              <v-card-actions>
                                <v-btn
                                  color="deep-purple lighten-2"
                                  text
                                  @click="openProblem(problem.url)"
                                  class="text-decoration-underline"
                                >
                                  Open Problem
                                </v-btn>
                              </v-card-actions>
                            </v-col>
                            <v-col cols="4">
                              <!-- 編集リクエストを送れるようにする -->
                              <div class="my-2">
                                <v-btn color="primary" @click="goEdit(problem.id)">
                                  <v-icon icon="mdi-pencil" />
                                </v-btn>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
