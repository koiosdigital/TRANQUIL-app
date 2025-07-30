<template>
  <form class="space-y-6 w-full max-w-md mx-auto" @submit.prevent="handleSubmit">
    <Alert v-if="error" type="error" class="my-4" :message="error" />
    <div>
      <label for="email" class="block text-sm font-medium text-gray-200 mb-1">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
        class="w-full rounded-md border border-zinc-700 bg-zinc-800 text-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-200 mb-1">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
        class="w-full rounded-md border border-zinc-700 bg-zinc-800 text-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
    <BaseButton type="submit" :disabled="loading">
      <span v-if="loading">Logging in...</span>
      <span v-else>Log In</span>
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import Alert from '@/components/Alert.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { ref } from 'vue'

const cloudAPI = useCloudAPIStore()

const emit = defineEmits(['login-success'])

const email = ref('')
const password = ref('')
const error = ref('')

const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await cloudAPI.doLogin(email.value, password.value)
    emit('login-success')
  } catch (e: any) {
    error.value = e?.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>
