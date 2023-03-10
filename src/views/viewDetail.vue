<script setup>
import { ref, onMounted } from "vue"
import route from "@/router"
import { supabase } from "../supabase.js"

import HeaderComponent from "@/components/HeaderComponent.vue"
import DifficultyCircle from "@/components/DifficultyCircle.vue"

const selected = ref(route.currentRoute["_value"].query.id || null)

// problems: データベースの中身そのまま持ってくる、登録した問題
const problems = ref([])

// problemsテーブルのうちselectedのidを持つものをproblemsに入れる
const fetchProblem = async () => {
  const { data, error } = await supabase.from("problems").select("*").eq("id", selected.value)
  // console.log(error)
  problems.value = data
}
fetchProblem()

// ボタンを押したらその問題のURLを開く
const openProblem = (url) => {
  window.open(url, "_blank")
}
</script>

<template>
  <HeaderComponent />

  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <!-- 検索窓とメインを分けるだけの目的 -->
      <v-container fluid>
        <v-row v-for="problem in problems" :key="problem.id" class="ma-0">
          <v-col cols="12" align="center" justify="center">
            <v-sheet rounded="lg" maxWidth="1200px" class="pa-8">
              <p style="text-align: start">{{ problem.created_at.slice(0, 10) }}</p>

              <!-- <h2 class="text-h4 px-4" style="margin: 0 auto">
                <v-row align-content="center">
                  <v-col cols="2" align="right">
                    <DifficultyCircle style="margin-top: 5px" :rating="problem.difficulty" />
                  </v-col>
                  <v-col cols="8" align="left" @click="openProblem(problem.url)">
                    {{ problem.contest_id.toUpperCase() }} - {{ problem.problem_index }}
                    {{ problem.problem_name }}
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
              </h2> -->

              <h2 class="text-h4">
                <div style="display: flex; justify-content: center; align-items: center">
                  <div style="align-self: flex-end">
                    <DifficultyCircle style="margin-top: 0; margin-bottom: 5px" :rating="problem.difficulty" />
                  </div>
                  <div style="align-self: flex-start" class="px-4" @click="openProblem(problem.url)">
                    {{ problem.contest_id.toUpperCase() }} - {{ problem.problem_index }}
                    {{ problem.problem_name }}
                  </div>
                </div>
              </h2>

              <p style="text-align: end">recommended by {{ problem.username }}</p>

              <p>
                <v-chip-group
                  active-class="deep-purple accent-4 white--text"
                  column
                  v-for="tag in problem.tags"
                  :key="tag"
                  style="margin: auto; display: block"
                >
                  <v-chip>#{{ tag }}</v-chip>
                </v-chip-group>
              </p>

              <div v-html="problem.reason_html" class="ma-8"></div>

              <h2 class="text-h4">
                <v-card-actions style="margin: auto; display: block">
                  <v-btn
                    color="deep-purple lighten-2"
                    text
                    @click="openProblem(problem.url)"
                    class="text-decoration-underline text-h5"
                    width="40%"
                  >
                    OPEN PROBLEM
                  </v-btn>
                </v-card-actions>
              </h2>
            </v-sheet>
            <!-- {{ problem }} -->
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
