<!-- javascriptを記述する場所 -->
<script setup>
// ref: 便利なやつ、記法はreact
import ButtonComponent from "@/components/button/ButtonComponent.vue"
import { ref, watch } from "vue"
// 型は初期値による
const count = ref(0)
// ref型だから.valueで値取り出す
// constなのにcount.valueってやれば代入できちゃう
// console.log(count.value)
const countUp = () => {
    count.value += 1
}

// 引数に関数を２つとる（１つ目はrefオブジェクトでも可、配列で渡すと複数入れられる）
// watch(監視対象の関数, 実行したい処理)
watch(count, () => {
    if (count.value<18) {console.log("選挙権はありません")}
    else if (count.value<25) {console.log("投票行けます")}
    else {console.log("衆議院議員に立候補出来ます")}
})
</script>

<!-- マークアップでhtmlを記述する場所 -->
<template>
    <div>this is child component</div>
    <!-- :子の変数名="親の変数名" -->
    <!-- @子の関数名="親の関数名" -->
    <ButtonComponent 
        :count="count"
        @countUp="countUp"
    />
</template>
