<script setup>
import { ref } from "vue"

// eslint-disable-next-line
const props = defineProps({ show: Boolean })

const items = ref(['Programming', 'Playing video games', 'Watching movies', 'Sleeping'])
const select = ref(['Streaming', 'Eating'])

const remove = (item) => {
    select.value.splice(select.value.indexOf(item), 1)
}
</script>

  <script>
    export default {
      data () {
        return {
          select: ['Vuetify', 'Programming'],
          items: [
            'Programming',
            'Design',
            'Vue',
            'Vuetify',
          ],
        }
      },
    }
  </script>

<template>
    
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-wrapper">
                <v-card class="modal-container">
                    <v-card-title>
                        <span class="text-h5">User Profile</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        label="Problem URL"
                                        hint="ex. https://atcoder.jp/contests/abc283/tasks/abc283_a"
                                        required
                                    ></v-text-field>
                                </v-col>
                                
                                <v-col cols="12">
                                    <v-text-field
                                        label="Username (optional)"
                                    ></v-text-field>
                                </v-col>
                                
                                <v-col cols="12">
                                    <v-textarea
                                        label="Reason"
                                        required
                                    ></v-textarea>
                                </v-col>

                                <!-- タグ機能はあとで... -->
                                <v-col cols="12">
                                    <v-combobox
                                        v-model="select"
                                        :items="items"
                                        chips
                                        clearable
                                        label="Tags"
                                        multiple  
                                    >
                                        <template v-slot:selection="{ attrs, item, select, selected }">
                                            <v-chip
                                                v-bind="attrs"
                                                :input-value="selected"
                                                @click="select"
                                                @click:close="remove(item)"
                                            >
                                                <strong>{{ item }}</strong>&nbsp;
                                            </v-chip>
                                        </template>
                                    </v-combobox>
                                </v-col>
                                <v-chip closable>
                                    Chip
                                </v-chip>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue-darken-1"
                            variant="text"
                            @click="$emit('close')"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="blue-darken-1"
                            variant="text"
                            @click="$emit('close')"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>

                </v-card>
            </div>
        </div>
    </Transition>
</template>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 600px;
    margin: 0px auto;
    padding: 15px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>