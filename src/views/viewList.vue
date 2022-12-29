<!-- vuetifyのワイヤーフレーム -->
<template>
	<v-app id="inspire">
		<v-app-bar flat>
			<v-container class="fill-height d-flex align-center">
			<v-avatar
				class="mr-10 ml-4"
				color="grey-darken-1"
				size="32"
			></v-avatar>
	
			<v-btn v-for="link in links" :key="link" variant="text" >
				{{ link }}
			</v-btn>
	
			<v-spacer></v-spacer>
	
			<v-responsive max-width="260">
				<v-text-field density="compact" hide-details variant="solo" ></v-text-field>
			</v-responsive>
			</v-container>
		</v-app-bar>
	
		<v-main class="bg-grey-lighten-3">
			<v-container>
			<v-row>
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
	
				<v-col>
				<v-sheet min-height="70vh" rounded="lg" >
					<!--  -->
				</v-sheet>
				</v-col>
			</v-row>
			</v-container>
		</v-main>
	</v-app>


</template>
  
<script>
	export default {
		data: () => ({
			links: [
				"About",
				"List",
				"Submit",
				"Queue",
			],
		}),
	}
</script>
<!-- javascriptを記述する場所 -->
<script setup>
import { ref } from "vue"
import { supabase } from "../supabase.js"

// tasks: 登録したタスク情報
const tasks = ref([])
// task: inputから追加予定のタスク
const task = ref("")

const getTasks = async () => {
	let { data, error, status } = await supabase.from('problems').select('*')
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
<!-- <template>
    <h1>良問</h1>
    <ul>
        <li v-for="task in tasks" :key="task.id">
            <span><input type="checkbox" v-model="task.completed" @change="updateTask(task)" /></span>
            <span>{{ task.problem_name }}</span>
            <button @click="deleteTask(task.id)">削除</button>
        </li>
    </ul>
	<RouterLink v-bind:to="{ path: '/submit' }">良問を登録する</RouterLink>
</template> -->
