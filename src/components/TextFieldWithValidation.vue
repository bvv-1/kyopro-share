<script setup>
import { defineProps, toRef } from "vue"
import { useField } from "vee-validate"

const props = defineProps({
  name: {
    type: String,
    requird: true,
  },
  type: {
    type: String,
    requird: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const { value, handleBlur, errors } = useField(toRef(props, "name"), undefined)
</script>

<template>
  <v-text-field v-model="value" @blur="handleBlur" :label="label" :error-messages="errors" :type="type" />
</template>
