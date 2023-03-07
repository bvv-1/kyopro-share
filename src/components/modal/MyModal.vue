<!------------------------------------------
  javascriptの部分
------------------------------------------->
<script setup>
import { ref } from "vue"
import { supabase } from "@/supabase.js"
import axios from "axios"
import { Field, Form } from "vee-validate"
import * as yup from "yup"

import infoJson from "@/assets/info.json"

// eslint-disable-next-line
const props = defineProps({ show: Boolean })

// const remove = (item) => {
//   select.value.splice(select.value.indexOf(item), 1)
// }

const schema = yup.object({
  problemUrl: yup.string().required().url().label("Problem URL"),
  username: yup.string().max(16).label("Username"),
  reason: yup.string().max(100).required().label("Reason"),
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

// -------------------------------------------------
// submit関連
// -------------------------------------------------
const onSubmit = async (values) => {
  console.log(values)
  const [contestId, problemId] = parseUrl(values.problemUrl)
  console.log(`contestId: ${contestId}\nproblemId: ${problemId}`)
  // バリデーションに失敗したら何もしない
  if (contestId === null || problemId === null) {
    alert(
      "Error! Invalid URL. Please put a valid problem URL. (ex. https://atcoder.jp/contests/abc999/tasks/abc999_x )"
    )
    return
  }

  // 分割代入かつPromise.allで並列処理
  const [problemInfo, difficulty] = await Promise.all([fetchProblemInfo(problemId), fetchDifficulty(problemId)])
  console.log(`problemInfo: ${problemInfo}\ndifficulty: ${difficulty}`)
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
        tags: [values.tags],
        url: values.problemUrl,
      },
    ])
    .select("*")
  console.log(error)
}

// ----------------------------------------
// input.value.successをon/offしてsubmitted!を表示
// ----------------------------------------
// async function setSuccessTrueForFiveSeconds() {
//   setTimeout(function () {
//     input.value.success = true
//   }, 5000) // 5000 milliseconds = 5 seconds
//   if (input.value.success) console.log("success!")

//   input.value.success = false
//   console.log(input.value.success)
// }

// // eslint-disable-next-line
// const emit = defineEmits(["setInputSuccess"])

// watchEffect(() => {
//   emit("setInputSuccess", input.value.success)
//   console.log(input.value.success)
// })
</script>

<!------------------------------------------
  Reactでいうreturnの部分
------------------------------------------->
<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <v-card class="modal-container">
          <v-card-title>
            <span class="text-h5">Submit Problem</span>
          </v-card-title>

          <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
            <v-card-text>
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
                  <v-col cols="12">
                    <Field name="tags" v-slot="{ field, errors }">
                      <!-- v-checkbox内でv-forをつかってinfoJson.tagsを全部表示 -->
                      <v-checkbox
                        v-for="tag in infoJson.tags"
                        v-bind="field"
                        :label="tag"
                        :value="tag"
                        :key="tag"
                        :error-messages="errors"
                      ></v-checkbox>

                      <!-- <v-combobox
                        v-bind="field"
                        label="Tags"
                        :error-messages="errors"
                        :items="infoJson.tags"
                      ></v-combobox> -->

                      <!-- <v-combobox
                      v-bind="field"
                      label="allTags"
                      :error-messages="errors"
                      :items="infoJson.tags"
                      chips
                      multiple
											clearable
                    /> -->
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
                    </Field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="mr-4" @click="$emit('close')">Close</v-btn>
              <v-btn color="primary" class="mr-4" type="submit">Submit</v-btn>
            </v-card-actions>
          </Form>
        </v-card>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
