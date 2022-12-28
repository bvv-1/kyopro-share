<!-- javascriptを記述する場所 -->
<script setup>
import { ref } from "vue"
import { supabase } from "../supabase.js"

// tasks: 登録したタスク情報
const tasks = ref([])
// task: inputから追加予定のタスク
const task = ref("")

const getTasks = async () => {
	let { data, error, status } = await supabase.from('tasks').select('*')
	console.log(error)
	tasks.value = data
}
getTasks()

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
    <h1>Tasks</h1>
    <ul>
        <li v-for="task in tasks" :key="task.id" :style='task.completed ? "text-decoration:line-through" : ""'>
            <span><input type="checkbox" v-model="task.completed" @change="updateTask(task)" /></span>
            <span>{{ task.task }}</span>
            <button @click="deleteTask(task.id)">削除</button>
        </li>
    </ul>
    <form @submit.prevent="addTask">
        <div>
            <input v-model="task" />
        </div>
        <div>
            <button type="submit">タスクを登録</button>
        </div>
    </form>
	<RouterLink v-bind:to="{ path: '/submit' }">良問を登録する</RouterLink>
</template>
