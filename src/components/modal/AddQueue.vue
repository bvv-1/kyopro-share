<script setup>
import { ref } from "vue"
import { supabase } from "@/supabase.js"
import axios from "axios"

// eslint-disable-next-line
const props = defineProps({ show: Boolean })

// フォームに入力されたもの
const input = ref({
  url: "",
  username: "Guest",
  type: "",
  new_reason: "",
  purpose: "",
  success: false,
})

// eslint-disable-next-line
const emit = defineEmits(["inputSuccess"])

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

  // データベースにinsert
  const { data, error } = await supabase
    .from("problems")
    .insert([
      {
        // contest_id: problemInfo.contest_id,
        // problem_index: problemInfo.problem_index,
        // problem_name: problemInfo.name,
        // difficulty: difficulty,
        username: input.value.username,
        reason: input.value.reason,
        // tag: ,
        url: input.value.url,
      },
    ])
    .select("*")
  console.log(error)
  input.value.success = true
}

const limitUsernameLength = (value) =>
  value.length <= 16 || "16文字以内で入力してください" // 文字数の制約
// const limitReasonLength = (value) => value.length <= 100 || "100文字以内で入力してください" // 文字数の制約
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
                    label="Username (optional)"
                    v-model="input.username"
                    :rules="[limitUsernameLength]"
                    counter="16"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <!-- <v-text-field
                                        label="Type"
                                        v-model="input.type"
                                        counter="16"
                                    ></v-text-field> -->
                  <v-select
                    label="Type"
                    :items="[
                      'California',
                      'Colorado',
                      'Florida',
                      'Georgia',
                      'Texas',
                      'Wyoming',
                    ]"
                  ></v-select>
                </v-col>

                <v-col cols="12" v-if="input.type === 'Edit'">
                  <!-- <v-select
                                        label="Type"
                                        v-model="input.type"
                                        :items=""
                                    ></v-select> -->
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    label="Reason"
                    required
                    v-model="input.reason"
                    counter="100"
                  ></v-textarea>
                </v-col>
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
