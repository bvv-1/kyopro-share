<script setup>
import { ref } from "vue"
import route from "@/router"

import HeaderComponent from "@/components/HeaderComponent.vue"

const selected = ref(route.currentRoute["_value"].query.id || null)
</script>

<template>
  <HeaderComponent />

  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <!-- 検索窓とメインを分けるだけの目的 -->
      <v-container fluid>
        <v-row>
          <v-col cols="12" align="center" justify="center">
            <v-sheet rounded="lg" maxWidth="1200px" class="pa-8">
              {{ selected }}
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
