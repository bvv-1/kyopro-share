<!-- javascriptを記述する場所 -->
<script setup>
import { ref } from "vue"
import { supabase } from "../supabase.js"
import axios from "axios"

// tasks: 登録したタスク情報
const tasks = ref([])
// task: inputから追加予定のタスク
const task = ref("")
const input = ref("")

const username = ref("Guest")

const getTasks = async () => {
	let { data, error, status } = await supabase.from('tasks').select('*')
	console.log(error)
  	tasks.value = data
}
// getTasks()

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
console.log(parseUrl("https://atcoder.jp/contests/abc060/tasks/abc060_f")) // ['abc060', 'abc060_f']
console.log(parseUrl("https://atcoder.jp/contests/agc060/tasks/agc060_g")) // ['agc060', 'agc060_g']
console.log(parseUrl("https://atcoder.jp/contests/abc060/tasks/abc060_g")) // ['abc060', 'abc060_g']
console.log(parseUrl("https://atcoder.jp/contests/contest1/tasks/task1")) // ['contest1', 'task1']
console.log(parseUrl("https://atcoder.jp/contests/contest2/tasks/task2")) // ['contest2', 'task2']
console.log(parseUrl("https://atcoder.jp/contests/contest3/tasks/task3")) // ['contest3', 'task3']
console.log(parseUrl("https://atcoder.jp/contests/agc060/tasks")) // null
console.log(parseUrl("https://atcoder.jp/contests/abc060/tasks")) // null

async function getProblemInfo(problemId) {
	const url = "https://kenkoooo.com/atcoder/resources/problems.json"
    const params = JSON.stringify({
		// image: image.value,
    })

    // axios
    //     .get(url)
    //     .then((response) => {
    //         // ここで'data:image/pngbase64, ...'から始まる文字列がログに流れれば送信成功
	// 		console.log(response.data)
	// 		// 
	// 		const dataIndex = response.data.findIndex(data => data.id === problemId)
	// 		if (dataIndex === -1) return null
	// 		console.log(dataIndex)
	// 		console.log(response.data[dataIndex])
	// 		return response.data[dataIndex]
    //     })
    //     .catch((error) => {
    //         console.log(error)
	// 		return null
    //     })
    try {
		const response = await axios.get(url)
		console.log(response.data)
		const dataIndex = response.data.findIndex(data => data.id === problemId)
		if (dataIndex === -1) return null
		console.log(dataIndex)
		console.log(response.data[dataIndex])
		return response.data[dataIndex]
	} catch (error) {
		console.log(error)
		return null
	}
}

// AtCoder ProblemsのAPI叩いてデータベースに登録
const addProblem = async () => {
	const [contestId, problemId] = parseUrl(input.value)
	console.log(contestId)
	console.log(problemId)
	if (contestId === null || problemId === null) {
		alert("Error! Invalid URL. Please put a valid problem URL. (ex. https://atcoder.jp/contests/abc999/tasks/abc999_x )")
		return
	}

	const problemInfo = await getProblemInfo(problemId)
	console.log(problemInfo)
	
	const { data, error } = await supabase
		.from("problems")
		.insert([{
			contest_id: problemInfo.contest_id,
			problem_index: problemInfo.problem_index,
			problem_name: problemInfo.name,
			// difficulty: ,
			username: username.value,
			// reason: ,
			// tag: ,
		}])
		.select('*')
	console.log(error)
}

const addTask = async () => {
	const { data, error } = await supabase
		.from('tasks')
		.insert([{ task: task.value }])
		.select('*')
	console.log(error)
	tasks.value.push(data[0])
	task.value = ''
}

const deleteTask = async (id) => {
  	const { data, error } = await supabase
    	.from('tasks')
    	.delete()
    	.eq('id', id)
    	.select('id')
	console.log(error)
	const index = tasks.value.findIndex((task) => task.id === data[0].id)
  	tasks.value.splice(index, 1)
}

const updateTask = async (task) => {
  	const { data, error } = await supabase
    	.from('tasks')
    	.update({ completed: task.completed })
    	.eq('id', task.id)
    	.select('*')
	console.log(error)
	const currentTask = tasks.value.find((task) => task.id === data[0].id)
  	currentTask.completed = data[0].completed
}
</script>

<!-- マークアップでhtmlを記述する場所 -->
<template>
    <h1>登録</h1>
    <ul>
        <li v-for="task in tasks" :key="task.id" :style='task.completed ? "text-decoration:line-through" : ""'>
            <span><input type="checkbox" v-model="task.completed" @change="updateTask(task)" /></span>
            <span>{{ task.task }}</span>
            <button @click="deleteTask(task.id)">削除</button>
        </li>
    </ul>
    <!-- <form @submit.prevent="addTask"> -->
    <form @submit.prevent="addProblem">
        <div>
            <!-- <input v-model="task" /> -->
            <input v-model="input" placeholder="https://atcoder.jp/contests/agc060/tasks/agc060_f" />
            <input v-model="username" placeholder="Guest" />
        </div>
        <div>
            <button type="submit">投稿</button>
        </div>
    </form>
    <RouterLink v-bind:to="{ path: '/' }">一覧に戻る</RouterLink>
</template>
