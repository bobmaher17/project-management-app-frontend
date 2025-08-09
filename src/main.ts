import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification' // <-- 1. Import Toast

// --- Import semua file CSS yang dibutuhkan ---
import 'vue-toastification/dist/index.css' // <-- 2. Import CSS untuk Toast
import '@vueform/multiselect/themes/default.css'
import './assets/main.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)

// --- 3. Daftarkan Toast sebagai plugin ---
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true,
  position: "top-right",
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
})

app.mount('#app')