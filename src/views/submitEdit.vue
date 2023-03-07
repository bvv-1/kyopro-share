<!------------------------------------------
  javascriptの部分
------------------------------------------->
<script setup>
import { ref } from "vue"
import { Field, Form } from "vee-validate"
import * as yup from "yup"
import { supabase } from "../supabase.js"

import infoJson from "@/assets/info.json"
import HeaderComponent from "@/components/HeaderComponent.vue"

const inputSuccess = ref(false)

const schema = yup.object({
  postId: yup.number().required().label("Post ID"),
  username: yup.string().max(16).label("Username"),
  type: yup.string().required().label("Type"),
  purpose: yup.string().required().label("Purpose"),
})

// -------------------------------------------------
// submit関連
// -------------------------------------------------
// problemsというテーブルにpostIdと同一のidのカラムがあるかを確認
const checkPostId = async (postId) => {
  const { data, error } = await supabase.from("problems").select("*").eq("id", postId).select("*")

  console.log(data)
  if (error !== null) {
    alert(error)
    return false
  }
  // 三項演算子を使用
  return data ? true : false
}

const onSubmit = async (values, { resetForm }) => {
  console.log(values)

  // problemsというテーブルにpostIdと同一のidのカラムをカウント
  if (checkPostId(values.postId) === false) {
    alert("Error! Invalid Post ID. Please go to the LIST page and retry.")
    return
  }

  // バリデーションを通過したらデータベースにinsert
  const { data, error } = await supabase
    .from("queue")
    .insert([
      {
        problem_id: values.postId,
        username: values.username,
        type: values.type,
        purpose: values.purpose,
      },
    ])
    .select("*")

  if (error !== null) {
    alert(error)
  } else {
    resetForm()

    // turn on inputSuccess for 1 second
    inputSuccess.value = true
    setTimeout(() => {
      inputSuccess.value = false
    }, 1000)

    window.location = "/#/queue"
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
              <h2 class="text-h4 pa-4">Edit Post</h2>
              <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <Field name="postId" v-slot="{ field, errors }">
                        <v-text-field v-bind="field" label="Post ID" :error-messages="errors" />
                      </Field>
                    </v-col>

                    <v-col cols="12">
                      <Field name="username" v-slot="{ field, errors }">
                        <v-text-field v-bind="field" label="Username (optional)" :error-messages="errors" />
                      </Field>
                    </v-col>

                    <v-col cols="12">
                      <Field name="type" v-slot="{ field, errors }">
                        <v-select v-bind="field" :items="infoJson.types" label="Type" :error-messages="errors" />
                      </Field>
                    </v-col>

                    <v-col cols="12">
                      <Field name="purpose" v-slot="{ field, errors }">
                        <v-textarea v-bind="field" label="Purpose" :error-messages="errors" />
                      </Field>
                    </v-col>

                    <v-col cols="12">
                      <v-btn color="primary" type="submit">Submit</v-btn>
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
