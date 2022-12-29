<script setup>
import Modal from "@/components/modal/MyModal.vue"
</script>

<!-- modal用 -->
<script>
export default {
	components: {
		Modal
	},
	data() {
		return {
			showModal: false
		}
	}
}
</script>

<template>
    <v-app-bar flat>
        <v-container class="fill-height d-flex align-center">
            <v-avatar class="mr-10 ml-4" color="grey-darken-1" size="32">
                <!-- <img src="@/assets/icon.png" /> -->
                <img src="https://bvv.s-ul.eu/DmVCALiV">
            </v-avatar>

            <v-btn>About</v-btn>
            <v-btn to="/">List</v-btn>
            <!-- <v-btn to="/submit">Submit</v-btn> -->
            <v-btn id="show-modal" @click="showModal = true">Submit</v-btn>		
            <Teleport to="body">
                <!-- use the modal component, pass in the prop -->
                <modal :show="showModal" @close="showModal = false">
                    <template #header>
                        <h3>custom header</h3>
                    </template>
                </modal>
            </Teleport>
            <v-btn>Queue</v-btn>
            
            <v-spacer></v-spacer>

            <v-responsive max-width="260">
                <v-text-field density="compact" hide-details variant="solo" ></v-text-field>
            </v-responsive>
        </v-container>
    </v-app-bar>
</template>