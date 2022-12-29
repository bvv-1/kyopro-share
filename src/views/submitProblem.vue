<!-- javascriptを記述する場所 -->
<script setup>
import { ref } from "vue"
import { supabase } from "../supabase.js"
import axios from "axios"

import HeaderComponent from '@/components/HeaderComponent.vue'

// tasks: 登録したタスク情報
const tasks = ref([])
// task: inputから追加予定のタスク
const task = ref("")
const input = ref("")

const username = ref("")
const reason = ref("")

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

async function fetchProblemInfo(problemId) {
	const url = "https://kenkoooo.com/atcoder/resources/problems.json"
    const params = JSON.stringify({
		// image: image.value,
    })

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

// AtCoder ProblemsのAPI叩いてデータベースに登録
const addProblem = async () => {
	const [contestId, problemId] = parseUrl(input.value)
	console.log(contestId)
	console.log(problemId)
	if (contestId === null || problemId === null) {
		alert("Error! Invalid URL. Please put a valid problem URL. (ex. https://atcoder.jp/contests/abc999/tasks/abc999_x )")
		return
	}

	const problemInfo = await fetchProblemInfo(problemId)
	if (problemInfo === null) {
		alert("Error! Problem does not exist. Please put a valid problem URL.")
		return
	}
	console.log(problemInfo)

	const difficulty = await fetchDifficulty(problemId)
	if (difficulty === null) {
		alert("Error! Problem does not exist. Please put a valid problem URL.")
		return
	}
	console.log(difficulty)
	
	const { data, error } = await supabase
		.from("problems")
		.insert([{
			contest_id: problemInfo.contest_id,
			problem_index: problemInfo.problem_index,
			problem_name: problemInfo.name,
			difficulty: difficulty,
			username: username.value,
			reason: reason.value,
			// tag: ,
			url: input.value,
		}])
		.select('*')
	console.log(error)
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
    <HeaderComponent></HeaderComponent>
	<v-app id="inspire">
		<v-main class="bg-grey-lighten-3">
			<v-container>
				<v-row>
					<!-- 左のやつ -->
					<v-col cols="2">
						<v-sheet rounded="lg">
							<v-list rounded="lg">
							<v-list-item v-for="n in 5" :key="n" link>
								<v-list-item-title>
									List Item {{ n }}
								</v-list-item-title>
							</v-list-item>
			
							<v-divider class="my-2"></v-divider>
			
							<v-list-item link color="grey-lighten-4" >
								<v-list-item-title>
									Refresh
								</v-list-item-title>
							</v-list-item>
							</v-list>
						</v-sheet>
					</v-col>
					
					<!-- 右のやつ -->
					<v-col>
						<v-sheet min-height="70vh" rounded="lg" >
							<form @submit.prevent="addProblem">
								<div>
									<input v-model="input" placeholder="https://atcoder.jp/contests/agc060/tasks/agc060_f" />
									<input v-model="username" placeholder="Guest" />
									<input v-model="reason" placeholder="良問だと思った理由" />
								</div>
								<div>
									<button type="submit">登録</button>
								</div>
							</form>
						</v-sheet>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
	
	
</template>
