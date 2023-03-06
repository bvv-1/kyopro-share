<!------------------------------------------
  javascriptの部分
------------------------------------------->
<script setup>
import { ref } from "vue"
import { Field, Form } from "vee-validate"
import * as yup from "yup"
import axios from "axios"

import infoJson from "@/assets/info.json"
import HeaderComponent from "@/components/HeaderComponent.vue"

// infoをなんとなくrefで定義し直す（いらないかも）
const info = ref(infoJson)
const inputUrl = ref("")

const schema = yup.object({
  problemUrl: yup.string().required().url().label("Problem URL"),
  username: yup.string().max(16).label("Username"),
  reason: yup.string().max(100).required().label("Reason"),
})

const onSubmit = (values) => {
  alert(values.username)
}

// const onSubmit = handleSubmit(() => {
//   if (errors.value.any()) {
//     return
//   }
//   alert(`名前: ${name.value}\nメールアドレス: ${email.value}`)
// })

// // useFormを使って入力要素の値を管理
// const { handleSubmit, isSubmitting, submitCount } = useForm(
//   {
//     validationSchema: {
//       url: {
//         required: true,
//       },
//       username: {
//         required: true,
//       },
//       reason: {
//         required: true,
//       },
//     },
//   },
//   {
//     initialValues: {
//       url: "",
//       username: "Guest",
//       reason: "",
//     },
//   }
// )

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

// -------------------------------------------------
// vee-validateのuseFieldを使ってフォームの入力要素を定義
// 同時にバリデーションも行う
// -------------------------------------------------
// const { value: url, errorMessage: errorMessageUrl } = useField("url", async (url) => {
//   const [contestId, problemId] = parseUrl(url)
//   // 入力されたURLが適切でなければエラーを返す
//   if (contestId === null || problemId === null) {
//     return "Error! Invalid URL. Please put a valid problem URL. (ex. https://atcoder.jp/contests/abc999/tasks/abc999_x )"
//   } else {
//     inputUrl.value = url
//     return true
//   }
// })

// const { value: username, errorMessage: errorMessageUsername } = useField("username", (username) => {
//   if (username.length < 2) {
//     return "Error! Username is too short."
//   } else if (username.length > 16) {
//     return "Error! Username is too long."
//   } else {
//     return true
//   }
// })

// const { value: reason, errorMessage: errorMessageReason } = useField("reason", (reason) => {
//   if (reason.length > 100) {
//     return "Error! Reason is too long."
//   } else {
//     return true
//   }
// })

// -------------------------------------------------
// submit関連
// -------------------------------------------------
// AtCoder ProblemsのAPIを叩いて問題情報を得る関数
const fetchProblemInfo = async (problemId) => {
  const url = "https://kenkoooo.com/atcoder/resources/problems.json"

  // ----------------------------------------
  // 複数人が同時に実行したときに遅延かける処理を後日実装
  // ----------------------------------------

  try {
    const response = await axios.get(url)
    console.log(response.data)

    const dataIndex = response.data.findIndex((data) => data.id === problemId)
    if (dataIndex === -1) return null
    console.log(dataIndex)

    console.log(response.data[dataIndex])
    return response.data[dataIndex]
  } catch (error) {
    console.log(error)
    return null
  }
}

// AtCoder ProblemsのAPIを叩いて難易度情報を得る関数
const fetchDifficulty = async (problemId) => {
  const url = "https://kenkoooo.com/atcoder/resources/problem-models.json"
  try {
    const response = await axios.get(url)
    console.log(response.data)

    console.log(response.data[problemId].difficulty)
    return response.data[problemId].difficulty
  } catch (error) {
    console.log(error)
    return null
  }
}

// submitボタンを押したときに実行される関数
// const addProblem = async () => {
//   // バリデーションを行う
//   const [contestId, problemId] = parseUrl(inputUrl.value)

//   // 分割代入かつPromise.allで並列処理
//   const [problemInfo, difficulty] = await Promise.all([fetchProblemInfo(problemId), fetchDifficulty(problemId)])

//   // バリデーションに失敗したら何もしない
//   if (problemInfo === null || difficulty === null) return

//   // バリデーションに成功したら、submitする
//   const submitData = {
//     url: url.value,
//     username: username.value,
//     reason: reason.value,
//     problemInfo: problemInfo,
//     difficulty: difficulty,
//   }
//   console.log(submitData)

//   // submitする
//   const url = "https://us-central1-atcoder-problems-2f0c7.cloudfunctions.net/submitProblem"
//   try {
//     const response = await axios.post(url, submitData)
//     console.log(response)
//   } catch (error) {
//     console.log(error)
//   }
// }
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
        <v-sheet min-height="70vh" rounded="lg">
          <span class="text-h5">Submit Problem</span>

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

                <!-- タグ機能はあとで... -->
                <!-- <v-col cols="12">
                  <v-combobox v-model="select" :items="items" chips clearable label="Tags" multiple>
                      <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip v-bind="attrs" :input-value="selected" @click="select" @click:close="remove(item)">
                          <strong>{{ item }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox>
                </v-col>
                <v-chip closable>Chip</v-chip> -->

                <v-col cols="12">
                  <v-btn color="primary" class="mr-4" type="submit">Submit</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </Form>
          <!-- <v-form @submit.prevent validate-on="">
            <v-container>
              <v-row>
                タグ機能はあとで...
                <v-col cols="12">
                  <v-combobox v-model="select" :items="items" chips clearable label="Tags" multiple>
                      <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip v-bind="attrs" :input-value="selected" @click="select" @click:close="remove(item)">
                          <strong>{{ item }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox>
                </v-col>
                <v-chip closable>Chip</v-chip>
              </v-row>
            </v-container>

            <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">Close</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="addProblem">Submit</v-btn>
          </v-form> -->
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>
