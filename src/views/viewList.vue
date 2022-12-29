<!-- javascriptを記述する場所 -->
<script setup>
import { ref } from "vue"
import { supabase } from "../supabase.js"
import HeaderComponent from '@/components/HeaderComponent.vue'

// problems: データベースの中身そのまま持ってくる、登録した問題
const problems = ref([])
const tasks = ref([])
// task: inputから追加予定のタスク
const task = ref("")

const fetchProblems = async () => {
	let { data, error, status } = await supabase
		.from('problems')
		.select('*')
	console.log(error)
	problems.value = data
}
fetchProblems()

const getTasks = async () => {
	const { data, error, status } = await supabase
		.from('tasks')
		.select('*')
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
<!-- vuetifyのワイヤーフレーム -->
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
									Sort
								</v-list-item-title>
							</v-list-item>
							</v-list>
						</v-sheet>
					</v-col>
					
					<!-- 右のやつ -->
					<v-col>
						<v-sheet min-height="70vh" rounded="lg" >
							
							<v-container>
								<v-row>
									<v-col cols="12" md="6" lg="4" v-for="problem in problems" :key="problem.id">
										<v-card :loading="loading" class="mx-auto my-12" max-width="374" >
											<v-container>
												<template slot="progress">
													<v-progress-linear
													color="deep-purple"
													height="10"
													indeterminate
													></v-progress-linear>
												</template>
												
												<v-row>
													<v-col>diff</v-col>
													<v-col>
														<v-card-title>{{ problem.problem_name }}</v-card-title>
													</v-col>
												</v-row>

												<v-card-text>
													<v-row class="mx-0" >
														<v-col>
															<v-rating
																:value="4.5"
																color="amber"
																dense
																half-increments
																readonly
																size="14"
															></v-rating>
														</v-col>
														<v-col class="align-center">
															by {{  problem.username }}
														</v-col>
													</v-row>

													<div class="my-4 text-subtitle-1">
														{{ problem.contest_id.toUpperCase() }} {{ problem.problem_index }}
													</div>

													<div>{{ problem.reason }}</div>
												</v-card-text>

												<v-divider class="mx-4"></v-divider>

												<!-- <v-card-title></v-card-title> -->

												<v-card-text>
													<v-chip-group
														v-model="selection"
														active-class="deep-purple accent-4 white--text"
														column
													>
														<v-chip>#DP</v-chip>
														<v-chip>#BFS</v-chip>
														<v-chip>#Union-Find</v-chip>
													</v-chip-group>
												</v-card-text>
												
												<v-row>
													<v-col>
														<v-card-actions>
															<v-btn color="deep-purple lighten-2" text @click="reserve" class="text-decoration-underline">
																Open Problem
															</v-btn>
														</v-card-actions>
													</v-col>
													<v-col>
														<div class="my-2">
															<v-btn color="primary" fab small dark >
																<v-icon>mdi-pencil</v-icon>
															</v-btn>
														</div>
													</v-col>
												</v-row>
											</v-container>
										</v-card>
									</v-col>
								</v-row>
							</v-container>
						</v-sheet>
					</v-col>
				</v-row>
			</v-container>

			
				<!-- <v-row>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
					<v-col cols="12" sm="12" md="6" lg="4" xl="4"> <v-card>card</v-card> </v-col>
				</v-row> -->

			<v-container>
				<v-row>
					<v-container>
						<v-row>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
						</v-row>
						<v-row>
							<v-col cols="12"><v-card>card</v-card></v-col>
						</v-row>
					</v-container>
				</v-row>
				<v-row>
					<v-container>
						<v-row>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
							<v-col cols="12" sm="6" md="4"> <v-card>card</v-card> </v-col>
						</v-row>
					</v-container>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>
