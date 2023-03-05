<!-- javascriptを記述する場所 -->
<script setup>
import { computed } from "vue"
// 親から値を受け取る方法、オブジェクトとして変数名: 型
// emitのほうは関数名を文字で列挙 in リスト
// eslint-disable-next-line
const props = defineProps({ count: Number })
// eslint-disable-next-line
const emit = defineEmits(["countUp"])

// 結局はcountにprops.countが渡されてるだけ

const count = computed(() => props.count) // 送られてきた関数
const countUp = () => {
  // 親の関数名、親の関数の引数
  emit("countUp")
}
</script>

<!-- マークアップでhtmlを記述する場所 -->
<template>
  <div>
    <!-- onclickと同義 -->
    <button @click="countUp">+</button>
    <!-- refオブジェクトだけど.valueつけない！ -->
    <p>ただいまの回数は{{ count }}</p>
  </div>
</template>
