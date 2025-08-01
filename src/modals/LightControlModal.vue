<template>
  <div class="space-y-6">
    <!-- Power Toggle -->
    <div class="flex items-center justify-between mb-2">
      <span class="font-semibold text-lg">LEDs</span>
      <BaseToggle v-model="on" id="led-power-toggle" class="ml-2" />
    </div>

    <!-- Effect Dropdown -->
    <div>
      <label for="effect-select" class="block text-sm font-medium mb-1">Effect</label>
      <BaseSelect v-model="selectedEffect" id="effect-select">
        <option v-for="effect in effects" :key="effect.id" :value="effect.id">
          {{ effect.name }}
        </option>
      </BaseSelect>
    </div>

    <!-- Speed Slider -->
    <div>
      <label for="speed-slider" class="block text-sm font-medium mb-1">Speed</label>
      <BaseSlider v-model="speed" :min="1" :max="100" id="speed-slider" />
    </div>

    <!-- Brightness Slider -->
    <div>
      <label for="brightness-slider" class="block text-sm font-medium mb-1">Brightness</label>
      <BaseSlider v-model="brightness" :min="1" :max="255" id="brightness-slider" />
    </div>

    <!-- Color Picker -->
    <div>
      <label class="block text-sm font-medium mb-1">Color</label>
      <div class="flex flex-col items-center gap-2 mb-2">
        <ColorPicker
          v-model:pureColor="colorHex"
          class="w-40 h-40"
          format="hex"
          :is-widget="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useLEDController } from '@/stores/led'
import BaseToggle from '@/components/BaseToggle.vue'
import BaseSlider from '@/components/BaseSlider.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { ColorPicker } from 'vue3-colorpicker'

import 'vue3-colorpicker/style.css'

const ledController = useLEDController()
const isRGBW = computed(() => ledController.mainChannelConfig.color.w !== undefined)

// State refs
const selectedEffect = ref('')
const speed = ref(0)
const brightness = ref(0)
const colorHex = ref('#ffffff')
const white = ref(0)
const on = ref(false)

// Sync UI with store config
watch(
  () => ledController.mainChannelConfig,
  (val) => {
    selectedEffect.value = val.effect_id
    speed.value = val.speed
    brightness.value = val.brightness
    colorHex.value = rgbToHex(val.color)
    white.value = val.color.w ?? 0
    on.value = val.on
  },
  { immediate: true, deep: true }
)

// Effects list (fetch on mount)
const effects = ref<{ id: string; name: string }[]>([])
onMounted(async () => {
  if (ledController.getAllEffects) {
    effects.value = await ledController.getAllEffects()
    selectedEffect.value = ledController.mainChannelConfig.effect_id
  }
})

// Effect change
watch(selectedEffect, (val) => {
  if (ledController.setEffect) {
    ledController.setEffect(val)
  }
})

let speedTimeout: ReturnType<typeof setTimeout> | null = null
watch(speed, (val) => {
  if (speedTimeout) clearTimeout(speedTimeout)
  speedTimeout = setTimeout(() => {
    if (ledController.setSpeed) {
      ledController.setSpeed(val)
    }
  }, 200)
})

let brightnessTimeout: ReturnType<typeof setTimeout> | null = null
watch(brightness, (val) => {
  if (brightnessTimeout) clearTimeout(brightnessTimeout)
  brightnessTimeout = setTimeout(() => {
    if (ledController.setBrightness) {
      ledController.setBrightness(val)
    }
  }, 200)
})

// Manual debounce helpers
let colorTimeout: ReturnType<typeof setTimeout> | null = null
function onColorInput() {
  if (colorTimeout) clearTimeout(colorTimeout)
  colorTimeout = setTimeout(() => {
    const rgb = hexToRgb(colorHex.value)
    ledController.setColor(rgb)
  }, 100)
}

watch(on, (val) => {
  if (ledController.setPower) {
    ledController.setPower(val)
  }
})

watch(colorHex, onColorInput)

// Helpers
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}
function hexToRgb(hex: string) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return res
    ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) }
    : { r: 255, g: 255, b: 255 }
}
</script>

<style scoped>
.toggle-switch {
  width: 2.5rem;
  height: 1.25rem;
  appearance: none;
  background: #222;
  border-radius: 9999px;
  position: relative;
  outline: none;
  transition: background 0.2s;
}
.toggle-switch:checked {
  background: #38bdf8;
}
.toggle-switch::before {
  content: '';
  position: absolute;
  left: 0.15rem;
  top: 0.15rem;
  width: 1rem;
  height: 1rem;
  background: #fff;
  border-radius: 9999px;
  transition: transform 0.2s;
}
.toggle-switch:checked::before {
  transform: translateX(1.25rem);
}
</style>
