<!------------------------------------------
  javascriptの部分
------------------------------------------->
<script setup>
import { ref } from "vue"
import { Field, Form } from "vee-validate"
import * as yup from "yup"
import { supabase } from "../supabase.js"
import axios from "axios"

import infoJson from "@/assets/info.json"
import HeaderComponent from "@/components/HeaderComponent.vue"

// 選択したタグ
const selected = ref([])
const inputSuccess = ref(false)

const schema = yup.object({
  problemUrl: yup.string().required().url().label("Problem URL"),
  username: yup.string().max(16).label("Username"),
  reason: yup.string().max(100).required().label("Reason"),
  // tags: yup.array().of(yup.string()),
})

// -------------------------------------------------
// バリデーションに必要な関数
// -------------------------------------------------
// 入力されたURLが有効であるか調べ、有効ならcontest番号と問題idを抜き出す関数
// chatGPTで生成、有能すぎて...
const parseUrl = (url) => {
  const regex = /^https:\/\/atcoder\.jp\/contests\/(.+)\/tasks\/(.+)$/
  const match = regex.exec(url)
  if (match) {
    const [, contest, task] = match
    return [contest, task]
  } else {
    return [null, null]
  }
}

// AtCoder ProblemsのAPIを叩いて問題情報を得る関数
const fetchProblemInfo = async (problemId) => {
  const url = "https://kenkoooo.com/atcoder/resources/problems.json"

  // ----------------------------------------
  // 複数人が同時に実行したときに遅延かける処理を後日実装
  // ----------------------------------------

  try {
    const response = await axios.get(url)
    // console.log(response.data)

    const dataIndex = response.data.findIndex((data) => data.id === problemId)
    if (dataIndex === -1) return null
    // console.log(dataIndex)

    // console.log(response.data[dataIndex])
    return response.data[dataIndex]
  } catch (error) {
    // console.log(error)
    return null
  }
}

// AtCoder ProblemsのAPIを叩いて難易度情報を得る関数
const fetchDifficulty = async (problemId) => {
  const url = "https://kenkoooo.com/atcoder/resources/problem-models.json"
  try {
    const response = await axios.get(url)
    // console.log(response.data)

    // console.log(response.data[problemId].difficulty)
    return response.data[problemId].difficulty
  } catch (error) {
    // console.log(error)
    return null
  }
}

// -------------------------------------------------
// submit関連
// -------------------------------------------------
const onSubmit = async (values, { resetForm }) => {
  // console.log(values)

  if (selected.value.length >= 4) {
    alert("Error! Please select <4 tags.")
    return
  }
  if (selected.value.length === 0) {
    alert("Error! Please select at least 1 tag.")
    return
  }

  const [contestId, problemId] = parseUrl(values.problemUrl)
  // console.log(`contestId: ${contestId}\nproblemId: ${problemId}`)
  // バリデーションに失敗したら何もしない
  if (contestId === null || problemId === null) {
    alert(
      "Error! Invalid URL. Please put a valid problem URL. (ex. https://atcoder.jp/contests/abc999/tasks/abc999_x )"
    )
    return
  }

  // 分割代入かつPromise.allで並列処理
  const [problemInfo, difficulty] = await Promise.all([fetchProblemInfo(problemId), fetchDifficulty(problemId)])
  // console.log(`problemInfo: ${problemInfo}\ndifficulty: ${difficulty}`)
  // バリデーションに失敗したら何もしない
  if (problemInfo === null || difficulty === null) {
    alert(
      "Error! Invalid URL. Please put a valid problem URL. (ex. https://atcoder.jp/contests/abc999/tasks/abc999_x )"
    )
    return
  }

  // バリデーションを通過したらデータベースにinsert
  const { data, error } = await supabase
    .from("problems")
    .insert([
      {
        contest_id: problemInfo.contest_id,
        problem_index: problemInfo.problem_index,
        problem_name: problemInfo.name,
        difficulty: difficulty,
        username: values.username,
        reason: values.reason,
        tags: selected.value,
        url: values.problemUrl,
      },
    ])
    .select("*")

  if (error !== null) {
    alert(error)
  } else {
    resetForm()
    selected.value = []

    // turn on inputSuccess for 1 second
    inputSuccess.value = true
    setTimeout(() => {
      inputSuccess.value = false
    }, 1000)
  }
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
      <v-container>
        <v-row>
          <v-col cols="12" align="center" justify="center">
            <v-sheet rounded="lg" maxWidth="1200px" class="pa-8">
              <h2 class="text-h4 pa-4">Submit Problem</h2>
              <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <Field name="problemUrl" v-slot="{ field, errors }">
                        <v-text-field
                          v-bind="field"
                          label="Problem URL"
                          :error-messages="errors"
                          hint="ex. https://atcoder.jp/contests/abc283/tasks/abc283_a"
                        />
                      </Field>
                    </v-col>

                    <v-col cols="12">
                      <Field name="username" v-slot="{ field, errors }">
                        <v-text-field v-bind="field" label="Username (optional)" :error-messages="errors" />
                      </Field>
                    </v-col>

                    <v-col cols="12">
                      <Field name="reason" v-slot="{ field, errors }">
                        <v-textarea v-bind="field" label="Reason" :error-messages="errors" />
                      </Field>
                    </v-col>

                    <!-- タグ機能 -->
                    <v-col cols="12">
                      <v-container class="text-left">
                        <v-row dense>
                          <Field name="tags" type="checkbox" v-slot="{ value, handleChange, errors }">
                            <v-col v-for="(tag, index) in infoJson.tags" :key="index" :cols="2">
                              <v-checkbox
                                :model-value="value"
                                @update:modelValue="handleChange"
                                :label="tag"
                                :value="tag"
                                color="primary"
                                v-model="selected"
                              />
                            </v-col>
                            <span v-if="errors.length" class="error">{{ errors[0] }}</span>
                          </Field>
                        </v-row>
                        <!-- {{ selected }} -->
                      </v-container>
                    </v-col>

                    <v-col cols="12">
                      <v-btn color="primary" type="submit" style="width: 300px">Submit</v-btn>
                    </v-col>
                    <v-alert
                      density="comfortable"
                      type="success"
                      variant="tonal"
                      width="180px"
                      class="mx-auto"
                      v-if="inputSuccess"
                    >
                      Submitted!
                    </v-alert>
                  </v-row>
                </v-container>
              </Form>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
