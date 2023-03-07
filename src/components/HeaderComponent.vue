<script setup>
import pic_icon from "@/assets/icon.png"
</script>

<template>
  <v-app-bar flat>
    <v-container class="fill-height d-flex align-center">
      <v-avatar class="mr-10 ml-4" color="grey-darken-1" size="32">
        <v-img :src="pic_icon"></v-img>
      </v-avatar>

      <v-btn to="about">About</v-btn>
      <v-btn to="/">List</v-btn>
      <v-btn to="/submit">Submit</v-btn>
      <v-btn to="/queue">Queue</v-btn>

      <v-spacer></v-spacer>

      <v-responsive max-width="260">
        <v-text-field density="compact" hide-details variant="solo"></v-text-field>
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>
