<script setup>
import { ref } from "vue"

import infoJson from "@/assets/info.json"

// eslint-disable-next-line
const props = defineProps({ rating: Number })
// console.log(props)

const color = ref("")
const styleOptions = ref({})

const getColor = (rating) => {
  if (rating < 0) return "Grey"
  const index = Math.min(Math.floor(rating / 400), infoJson.ratingColors.length - 2)
  return infoJson.ratingColors[index + 1]
}

const getRatingColorCode = (color) => {
  if (color === "Black") return "#404040"
  else if (color === "Grey") return "#808080"
  else if (color === "Brown") return "#804000"
  else if (color === "Green") return "#008000"
  else if (color === "Cyan") return "#00C0C0"
  else if (color === "Blue") return "#0000FF"
  else if (color === "Yellow") return "#C0C000"
  else if (color === "Orange") return "#FF8000"
  else if (color === "Red") return "#FF0000"
  else if (color === "Bronze") {
    return { base: "#965C2C", highlight: "#FFDABD" }
  } else if (color === "Silver") {
    return { base: "#808080", highlight: "white" }
  } else if (color === "Gold") {
    return { base: "#FFD700", highlight: "white" }
  } else {
    return null
  }
}

const getStyleOptions = (color, fillRatio) => {
  if (color === "Bronze" || color === "Silver" || color === "Gold") {
    const metalColor = getRatingColorCode(color)
    return {
      borderColor: metalColor.base,
      background: `linear-gradient(to right, ${metalColor.base}, ${metalColor.highlight}, ${metalColor.base})`,
    }
  } else {
    const colorCode = getRatingColorCode(color)
    return {
      borderColor: colorCode,
      background: `border-box linear-gradient(to top, ${colorCode} ${fillRatio * 100}%, rgba(0,0,0,0) ${
        fillRatio * 100
      }%)`,
    }
  }
}

color.value = getColor(props.rating)
const fillRatio = props.rating >= 3200 ? 1.0 : props.rating < 0 ? 0.0 : (props.rating % 400) / 400
styleOptions.value = getStyleOptions(color.value, fillRatio)
// console.log(styleOptions.value)
</script>

<template>
  <div id="dcircle" :style="styleOptions"></div>
</template>

<style>
#dcircle {
  /* display: inline-block; */

  border-radius: 50%;
  border-style: solid;
  border-width: 2px;

  height: 30px;
  width: 30px;

  /* 上下にオフセット */
  margin-top: 8.5px;
}
</style>
