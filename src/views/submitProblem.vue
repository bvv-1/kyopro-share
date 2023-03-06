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
import TextFieldWithValidation from "@/components/TextFieldWithValidation.vue"

// infoをなんとなくrefで定義し直す（いらないかも）
const info = ref(infoJson)
const inputUrl = ref("")

const schema = yup.object({
  name: yup.string().required().label("Name"),
  email: yup.string().email().required().label("E-mail"),
  // terms: yup.boolean().required().oneOf([true], "You must agree to terms and conditions"),
})

function onSubmit(values) {
  alert("aa")
  console.log("Submitted with", values)
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
  modal用
------------------------------------------->
<template>
  <HeaderComponent />

  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <!-- 検索窓とメインを分けるだけの目的 -->
      <v-container>
        <v-sheet min-height="70vh" rounded="lg">
          <span class="text-h5">Submit Problem</span>

          <v-container>
            <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
              <!-- This method uses Higher-order component API to validate vuetify inputs -->
              <Field name="name" v-slot="{ field, errors }">
                <v-text-field v-bind="field" label="Name" :error-messages="errors" />
              </Field>

              <!-- This uses a custom component with the composition API -->
              <TextFieldWithValidation name="email" label="Email" type="email" />

              <!-- This uses a custom component with the composition API -->
              <!-- <TextFieldWithValidation name="password" label="Password" type="password" /> -->

              <!-- This uses a custom component with the composition API -->
              <!-- <TextFieldWithValidation
      name="passwordConfirm"
      label="Password Confirmation"
      type="password"
    /> -->

              <!-- Same thing for other types of components -->
              <!-- In case of checkboxes you need to explicitly bind the model events -->
              <!-- With composition it is easier since you can use the `v-model` API directly -->
              <Field name="terms" :value="true" type="checkbox" v-slot="{ value, handleChange, errors }">
                <v-checkbox
                  :model-value="value"
                  @update:modelValue="handleChange"
                  label="Do you agree?"
                  color="primary"
                  :error-messages="errors"
                />
              </Field>

              <v-btn color="primary" class="mr-4" type="submit">Submit</v-btn>
            </Form>
          </v-container>
          <!-- <v-form @submit.prevent validate-on="">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
										name="url"
                    label="Problem URL"
                    v-model="url"
                    hint="ex. https://atcoder.jp/contests/abc283/tasks/abc283_a"
                    required
                  />
                  {{ errorMessageUrl }}
									<ErrorMessage name="url"/>
                </v-col>

                <v-col cols="12">
                  <v-text-field label="Username (optional)" v-model="username" counter="16" />
                  {{ errorMessageUsername }}
                </v-col>

                <v-col cols="12">
                  <v-textarea label="Reason" v-model="reason" counter="100" required />
                  {{ errorMessageReason }}
                </v-col>

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
