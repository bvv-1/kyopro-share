<!-- javascriptを記述する場所 -->
<script setup>
import { ref, computed, watch } from "vue"
import { supabase } from "../supabase.js"

import HeaderComponent from "@/components/HeaderComponent.vue"
import DifficultyCircle from "@/components/DifficultyCircle.vue"

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
  <HeaderComponent />

  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-sheet min-height="70vh" rounded="lg">
          <v-row>遊び方</v-row>
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>
