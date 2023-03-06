<!-- javascriptを記述する場所
<script setup>
// setupをつけるとコードが見やすくなる
import ChildComponent from "@/components/ChildComponent.vue"

import { ref, computed } from "vue"

const problems = ref([
  { id: 1, name: 15 },
  { id: 2, name: 10 },
  { id: 3, name: 8 },
])

const key = ref("")

function sort2() {
  problems.value.sort((a, b) => a["name"] - b["name"])
  console.log(problems.value)
}

const sortTest = (array, key) => {
  return array.sort((a, b) => a[key] - b[key])
}
const sortByKey = computed(() => (currentKey) => {
  const sortedProblems = sortTest(problems.value, currentKey)
  console.log(currentKey)
  console.log(sortedProblems)
  problems.value = sortedProblems
  return sortedProblems
})
</script>

マークアップでhtmlを記述する場所
<template>
  <div>good evening world</div>
  <ChildComponent />
  <div v-for="problem in problems" :key="problem.id">{{ problem.id }} - {{ problem.name }}</div>
  <v-btn @click="sortByKey('name')">sort by name!</v-btn>
  <v-btn @click="sortByKey('id')">sort by id!</v-btn>
  <v-btn @click="sort2">sort!!!!</v-btn>
</template> -->

<script setup>
import { Field, Form } from "vee-validate"
import * as yup from "yup"

const schema = yup.object({
  name: yup.string().required().label("Name"),
})

const onSubmit = (values) => {
  alert(values.name)
}
</script>

<template>
  <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
    <Field name="name" v-slot="{ field, errors }">
      <v-text-field v-bind="field" label="Name" :error-messages="errors" />
    </Field>

    <v-btn color="primary" class="mr-4" type="submit">Submit</v-btn>
  </Form>
</template>
