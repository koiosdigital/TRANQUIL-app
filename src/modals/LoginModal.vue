<template>
  <form class="space-y-6 w-full max-w-md mx-auto" @submit.prevent="handleSubmit">
    <Alert v-if="error" type="error" class="my-4">
      {{ error }}
    </Alert>
    <BaseInput
      id="email"
      v-model="email"
      type="email"
      label="Email"
      autocomplete="email"
      required
    />
    <BaseInput
      id="password"
      v-model="password"
      type="password"
      label="Password"
      autocomplete="current-password"
      required
    />
    <BaseButton type="submit" :disabled="loading">Log In</BaseButton>
  </form>
</template>

<script setup lang="ts">
import Alert from '@/components/Alert.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

import { useCloudAPIStore } from '@/stores/cloud-api'
import { ref } from 'vue'

const cloudAPI = useCloudAPIStore()

const emit = defineEmits(['close'])

const email = ref('')
const password = ref('')
const error = ref('')

const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await cloudAPI.doLogin(email.value, password.value)
    emit('close')
  } catch (e: any) {
    error.value = e?.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>
