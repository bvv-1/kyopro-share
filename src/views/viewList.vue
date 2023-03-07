<!------------------------------------------
  javascriptの部分
------------------------------------------->
<script setup>
import { ref, computed, watch } from "vue"
import { supabase } from "../supabase.js"

import HeaderComponent from "@/components/HeaderComponent.vue"
import DifficultyCircle from "@/components/DifficultyCircle.vue"

// problems: データベースの中身そのまま持ってくる、登録した問題
const problems = ref([])

// sortStuff: あらゆるものをsortする関数
// Pythonと違って型によってsort法変えないといけないので条件分岐
const sortStuff = (array, key) => {
  if (typeof array[0][key] === "number") {
    return array.sort((a, b) => a[key] - b[key])
  } else {
    return array.sort((a, b) => a[key].localeCompare(b[key]))
  }
}

// sortKey: currentKeyに従ってsort
const sortByKey = computed(() => (currentKey) => {
  const sortedProblems = sortStuff(problems.value, currentKey)
  console.log(sortedProblems)
  return sortedProblems
})

// problemsテーブルの中身をすべてproblemsに入れる
const fetchProblems = async () => {
  let { data, error, status } = await supabase.from("problems").select("*")
  console.log(error)
  problems.value = data
}
fetchProblems()

// ボタンを押したらその問題のURLを開く
const openProblem = (url) => {
  window.open(url, "_blank")
}

// ----------------------------------------------
// 後で削除予定
// ----------------------------------------------
// const tasks = ref([])
// const task = ref("")

// // 削除予定
// const getTasks = async () => {
//   const { data, error, status } = await supabase.from("tasks").select("*")
//   console.log(error)
//   tasks.value = data
// }
// getTasks()

// // 削除予定
// const addTask = async () => {
//   const { data, error } = await supabase
//     .from("tasks")
//     .insert([{ task: task.value }])
//     .select("*")
//   console.log(error)
//   tasks.value.push(data[0])
//   task.value = ""
// }

// // 削除予定
// const deleteTask = async (id) => {
//   const { data, error } = await supabase.from("tasks").delete().eq("id", id).select("id")
//   console.log(error)
//   const index = tasks.value.findIndex((task) => task.id === data[0].id)
//   tasks.value.splice(index, 1)
// }

// // 削除予定
// const updateTask = async (task) => {
//   const { data, error } = await supabase
//     .from("tasks")
//     .update({ completed: task.completed })
//     .eq("id", task.id)
//     .select("*")
//   console.log(error)
//   const currentTask = tasks.value.find((task) => task.id === data[0].id)
//   currentTask.completed = data[0].completed
// }
// ----------------------------------------------
// 後で削除予定
// ----------------------------------------------

// ボタンを押したらその問題のURLを開く
const openProblem = (url) => {
  console.log(url)
  window.open(url, "_blank")
}

// useStateみたいな書き方
const inputSuccess = ref(false)
const setInputSuccess = (isok) => {
  inputSuccess.value = isok
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
              <v-container>
                <v-row>
                  <v-col>
                    <v-select
                      label="Type"
                      :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <!-- 表示幅が短くなるとカードは1行3→2→1個 -->
                  <v-col cols="12" md="6" lg="4" v-for="problem in problems" :key="problem.id">
                    <!-- ワイヤーフレームではmy-12だった -->
                    <v-card :loading="loading" class="mx-auto my-auto" max-width="374" height="374">
                      <v-container>
                        <v-row align="center">
                          <v-col cols="1">
                            <DifficultyCircle :rating="problem.difficulty" />
                          </v-col>
                          <v-col>
                            <v-card-title>
                              {{ problem.problem_name }}
                            </v-card-title>
                          </v-col>
                        </v-row>

                        <v-card-text>
                          <v-row>
                            <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>
                          </v-row>

                          <v-row align="center">
                            <v-col class="ml-auto">
                              <div class="my-4 text-subtitle-1">
                                {{ problem.contest_id.toUpperCase() }}
                                -
                                {{ problem.problem_index }}
                              </div>
                            </v-col>

                            <v-col class="mr-auto">
                              <div class="my-4 text-subtitle-1">by {{ problem.username }}</div>
                            </v-col>
                          </v-row>

                          <div>
                            {{ problem.reason }}
                          </div>
                        </v-card-text>

                        <!-- 横線 -->
                        <v-divider class="mx-4"></v-divider>

                        <!-- タグ付け -->
                        <!-- <v-card-text> -->
                        <v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column>
                          <v-chip>#DP</v-chip>
                          <v-chip>#BFS</v-chip>
                          <!-- <v-chip>#Union-Find</v-chip> -->
                        </v-chip-group>
                        <!-- </v-card-text> -->

                        <v-row>
                          <v-col>
                            <!-- 問題リンクを貼る予定 -->
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
                          <v-col>
                            <!-- 編集リクエストを送れるようにする予定 -->
                            <div class="my-2">
                              <v-btn color="primary">
                                <v-icon icon="mdi-pencil" />
                              </v-btn>
                            </div>
                          </v-col>
                        </v-row>
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
