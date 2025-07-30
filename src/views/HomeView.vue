<template>
  <div>
    <Modal title="Log In to Tranquil" v-model="showLoginModal">
      <LoginModal @login-success="showLoginModal = false" />
    </Modal>

    <Logo />
  </div>
</template>

<script setup lang="ts">
import { useCloudAPIStore } from '@/stores/cloud-api'
import { onMounted, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import LoginModal from '@/modals/LoginModal.vue'
import { useLoaderStore } from '@/stores/loader'
import Logo from '@/components/Logo.vue'

const token = ref('')
const showLoginModal = ref(false)

const loaderStore = useLoaderStore()

onMounted(async () => {
  const cloudAPI = useCloudAPIStore()
  loaderStore.showLoader('login')

  try {
    const response = await cloudAPI.getToken()
    token.value = response
  } catch (error) {
    console.error('Error fetching token:', error)
    showLoginModal.value = true
  }

  loaderStore.hideLoader('login')
})
</script>
