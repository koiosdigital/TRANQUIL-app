import '@/assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

import App from './App.vue'

export const tableBaseURL = import.meta.env.PROD ? '' : 'http://192.168.0.135'

const app = createApp(App)
app.use(router)

app.use(createPinia())

app.mount('#app')
