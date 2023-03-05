<script setup>
import { ref, watch, watchEffect } from "vue"
import { supabase } from "@/supabase.js"
import axios from "axios"

// eslint-disable-next-line
const props = defineProps({ show: Boolean })

const items = ref([
  "Programming",
  "Playing video games",
  "Watching movies",
  "Sleeping",
])
const select = ref(["Streaming", "Eating"])

const remove = (item) => {
  select.value.splice(select.value.indexOf(item), 1)
}

// フォームに入力されたもの
const input = ref({
  url: "",
  username: "Guest",
  reason: "",
  success: false,
})

// 入力されたURLが有効であるか調べ、有効ならcontest番号と問題idを抜き出す関数
// chatGPTで生成、有能すぎて...
function parseUrl(url) {
  const regex = /^https:\/\/atcoder\.jp\/contests\/(.+)\/tasks\/(.+)$/
  const match = regex.exec(url)
  if (match) {
    const [, contest, task] = match
    return [contest, task]
  } else {
    return [null, null]
  }
}
// 使用例
console.log(parseUrl("https://atcoder.jp/contests/agc060/tasks/agc060_f")) // ['agc060', 'agc060_f']
console.log(parseUrl("https://atcoder.jp/contests/contest1/tasks/task1")) // ['contest1', 'task1']
console.log(parseUrl("https://atcoder.jp/contests/agc060/tasks")) // null

// AtCoder ProblemsのAPIを叩いて問題情報を得る関数
async function fetchProblemInfo(problemId) {
  const url = "https://kenkoooo.com/atcoder/resources/problems.json"

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
async function fetchDifficulty(problemId) {
  const url = "https://kenkoooo.com/atcoder/resources/problem-models.json"
  const params = JSON.stringify({
    // image: image.value,
  })

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

function validateUsername(username) {
  if (username.length < 2) return "Error! Username is too short."
  if (username.length > 16) return "Error! Username is too long."
  return null
}

function validateReason(reason) {
  if (reason.length > 100) return "Error! Reason is too long."
  return null
}

// AtCoder ProblemsのAPI叩いた結果をデータベースに登録する関数
const addProblem = async () => {
  const validateUsernameError = validateUsername(input.value.username)
  console.log(validateUsernameError)
  if (validateUsernameError != null) {
    alert(validateUsernameError)
    return
  }

  const validateReasonError = validateReason(input.value.reason)
  console.log(validateReasonError)
  if (validateReasonError != null) {
    alert(validateReasonError)
    return
  }

  const [contestId, problemId] = parseUrl(input.value.url)
  // 入力されたURLが適切でなければエラーを返す
  if (contestId === null || problemId === null) {
    alert(
      "Error! Invalid URL. Please put a valid problem URL. (ex. https://atcoder.jp/contests/abc999/tasks/abc999_x )"
    )
    return
  }
  console.log(contestId)
  console.log(problemId)

  const problemInfo = await fetchProblemInfo(problemId)
  // 該当する問題がなければエラーを返す
  if (problemInfo === null) {
    alert("Error! Problem does not exist. Please put a valid problem URL.")
    return
  }
  console.log(problemInfo)

  const difficulty = await fetchDifficulty(problemId)
  // 該当する問題がなければエラーを返す
  if (difficulty === null) {
    alert("Error! Problem does not exist. Please put a valid problem URL.")
    return
  }
  console.log(difficulty)

  // データベースにinsert
  const { data, error } = await supabase
    .from("problems")
    .insert([
      {
        contest_id: problemInfo.contest_id,
        problem_index: problemInfo.problem_index,
        problem_name: problemInfo.name,
        difficulty: difficulty,
        username: input.value.username,
        reason: input.value.reason,
        // tag: ,
        url: input.value.url,
      },
    ])
    .select("*")
  console.log(error)
  await setSuccessTrueForFiveSeconds()
}

async function setSuccessTrueForFiveSeconds() {
  setTimeout(function () {
    input.value.success = true
  }, 5000) // 5000 milliseconds = 5 seconds
  if (input.value.success) console.log("success!")

  input.value.success = false
  console.log(input.value.success)
}

const limitUsernameLength = (value) =>
  value.length <= 16 || "16文字以内で入力してください" // 文字数の制約
// const limitReasonLength = (value) => value.length <= 100 || "100文字以内で入力してください" // 文字数の制約

// eslint-disable-next-line
const emit = defineEmits(["setInputSuccess"])

watchEffect(() => {
  emit("setInputSuccess", input.value.success)
  console.log(input.value.success)
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <v-card class="modal-container">
          <v-card-title>
            <span class="text-h5">Submit Problem</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Problem URL"
                    hint="ex. https://atcoder.jp/contests/abc283/tasks/abc283_a"
                    required
                    v-model="input.url"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Username (optional)"
                    v-model="input.username"
                    :rules="[limitUsernameLength]"
                    counter="16"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    label="Reason"
                    required
                    v-model="input.reason"
                    counter="100"
                  ></v-textarea>
                </v-col>

                <!-- タグ機能はあとで... -->
                <v-col cols="12">
                  <v-combobox
                    v-model="select"
                    :items="items"
                    chips
                    clearable
                    label="Tags"
                    multiple
                  >
                    <template
                      v-slot:selection="{ attrs, item, select, selected }"
                    >
                      <v-chip
                        v-bind="attrs"
                        :input-value="selected"
                        @click="select"
                        @click:close="remove(item)"
                      >
                        <strong>{{ item }}</strong>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-col>
                <!-- <v-chip closable>Chip</v-chip> -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="
                addProblem()
                $emit('close')
              "
            >
              Submit
            </v-btn>
          </v-card-actions>
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
