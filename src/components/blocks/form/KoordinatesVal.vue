<script setup>
import { onMounted, h, defineProps, defineEmits } from "vue"
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"
const emit = defineEmits(["update:lat", "update:lon"]) // Vue-стандарт для v-model:lat / v-model:lon

defineProps({
  lat: {
    type: String,
    default: "",
  },
  lon: {
    type: String,
    default: "",
  },
})

function insertCoords(coords) {
  const [lat, lon] = coords.split(",").map(v => v.trim())
  emit("update:lat", lat)
  emit("update:lon", lon)
  toast.success("Координаты вставлены!")
}

// Проверка буфера обмена при возврате на вкладку
function checkClipboard() {
  window.addEventListener("focus", async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (/^\d+\.\d+,\s*\d+\.\d+$/.test(text)) {
        toast(
          {
            render() {
              return h("div", [
                h("p", [
                  "Обнаружены координаты: ",
                  h("b", text),
                ]),
                h(
                  "button",
                  {
                    style:
                      "margin-top:10px; padding:5px 10px; background:#4caf50; color:#fff; border:none; border-radius:4px; cursor:pointer",
                    onClick: () => insertCoords(text),
                  },
                  "Вставить"
                ),
              ])
            },
          },
          { autoClose: false }
        )
      }
    } catch (e) {
      console.error("Ошибка доступа к буферу:", e)
    }
  })
}

onMounted(() => {
  checkClipboard()
})
</script>

<template>
  <div class="form-group">
    <label>Координаты</label>
    <input
      type="text"
      :value="lat"
      @input="emit('update:lat', $event.target.value)"
      placeholder="Широта (lat)"
    />
    <input
      type="text"
      :value="lon"
      @input="emit('update:lon', $event.target.value)"
      placeholder="Долгота (lon)"
    />
  </div>
</template>
<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #333;
}

input,
textarea,
select {
  background: #f1f1f1;
  border: 1px solid #5f22c1;
  padding: 5px;
  min-height: 34px;
}

</style>