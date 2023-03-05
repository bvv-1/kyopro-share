<!-- javascriptを記述する場所 -->
<script setup>
import { ref, computed, watch } from "vue"
import { supabase } from "../supabase.js"

import HeaderComponent from "@/components/HeaderComponent.vue"
// import DifficultyCircle from "@/components/DifficultyCircle.vue"

// problems: データベースの中身そのまま持ってくる、登録した問題
const problems = ref([])
const queues = ref([])

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

// カード表示のため、データベースの中身すべてproblemsに入れる
const fetchProblems = async () => {
  let { data, error, status } = await supabase.from("problems").select("*")
  console.log(error)
  problems.value = data
}
fetchProblems()

// カード表示のため、データベースの中身すべてproblemsに入れる
const fetchQueues = async () => {
  let { data, error, status } = await supabase.from("queue").select("*")
  console.log(error)
  queues.value = data
  console.log(queues.value)
  console.log(typeof queues.value[0]["created_at"])
}
fetchQueues()

// 後で削除予定
const tasks = ref([])
const task = ref("")

// 削除予定
const getTasks = async () => {
  const { data, error, status } = await supabase.from("tasks").select("*")
  console.log(error)
  tasks.value = data
}
getTasks()

// 削除予定
const addTask = async () => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ task: task.value }])
    .select("*")
  console.log(error)
  tasks.value.push(data[0])
  task.value = ""
}

// 削除予定
const deleteTask = async (id) => {
  const { data, error } = await supabase.from("tasks").delete().eq("id", id).select("id")
  console.log(error)
  const index = tasks.value.findIndex((task) => task.id === data[0].id)
  tasks.value.splice(index, 1)
}

// 削除予定
const updateTask = async (task) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed: task.completed })
    .eq("id", task.id)
    .select("*")
  console.log(error)
  const currentTask = tasks.value.find((task) => task.id === data[0].id)
  currentTask.completed = data[0].completed
}

const openProblem = (url) => {
  console.log(url)
  window.open(url, "_blank")
}

const inputSuccess = ref(false)

// watch(emitの値, () => {
//     if (emitがtrue) inputSuccess.value = true
//     else inputSuccess.value = false
// })
</script>

<!-- マークアップでhtmlを記述する場所 -->
<!-- vuetifyのワイヤーフレーム -->
<template>
  <!-- ヘッダー -->
  <HeaderComponent></HeaderComponent>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <!-- 検索窓とメインを分けるだけの目的 -->
      <v-alert
        density="comfortable"
        type="success"
        variant="tonal"
        width="180px"
        class="mx-auto"
        v-if="inputSuccess === true"
      >
        Submitted!
      </v-alert>
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
                  <v-list-item-title @click="fetchQueues()">Reload</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <!-- 右のカード置き場 -->
          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <!-- 変える部分 -->
              <v-list rounded="lg">
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-left">Time</th>
                      <th class="text-left">Name</th>
                      <th class="text-left">Type</th>
                      <th class="text-left">New Reason</th>
                      <th class="text-left">Purpose</th>
                      <th class="text-left">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="queue in queues" :key="queue.id">
                      <!-- <td>{{ queue.created_at.slice(0, 10) }}</td> -->
                      <td>{{ queue.username }}</td>
                      <td>{{ queue.type }}</td>
                      <td>{{ queue.new_reason }}</td>
                      <td>{{ queue.purpose }}</td>
                      <td>{{ queue.comment }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
