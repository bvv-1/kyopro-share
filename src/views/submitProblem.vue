<!------------------------------------------
  javascriptの部分
------------------------------------------->
<script setup>
import { ref } from "vue"

import infoJson from "@/assets/info.json"
import HeaderComponent from "@/components/HeaderComponent.vue"

// infoをなんとなくrefで定義し直す（いらないかも）
const info = ref(infoJson)

// フォームに入力されたもの
const input = ref({
  url: "",
  username: "Guest",
  reason: "",
})
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
          <v-form @submit.prevent validate-on="">
            <span class="text-h5">Submit Problem</span>

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
                  <!-- <v-text-field
                      label="Username (optional)"
                      v-model="input.username"
                      :rules="[limitUsernameLength]"
                      counter="16"
                    ></v-text-field> -->
                </v-col>

                <v-col cols="12">
                  <!-- <v-textarea label="Reason" required v-model="input.reason" counter="100"></v-textarea> -->
                </v-col>

                <!-- タグ機能はあとで... -->
                <v-col cols="12">
                  <!-- <v-combobox v-model="select" :items="items" chips clearable label="Tags" multiple>
                      <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip v-bind="attrs" :input-value="selected" @click="select" @click:close="remove(item)">
                          <strong>{{ item }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox> -->
                </v-col>
                <!-- <v-chip closable>Chip</v-chip> -->
              </v-row>
            </v-container>

            <v-spacer></v-spacer>
            <!-- <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">Close</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="addProblem(), $emit('close')">Submit</v-btn> -->
          </v-form>
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>
