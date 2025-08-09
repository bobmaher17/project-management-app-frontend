<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-gray-800">Selamat Datang</h1>
      <p class="text-center text-gray-600">Silakan login untuk melanjutkan</p>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" v-model="username" required
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="password" class="text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input :type="passwordFieldType" id="password" v-model="password" required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <span @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
              {{ passwordFieldType === 'password' ? '👁️' : '🙈' }}
            </span>
          </div>
        </div>
        <button type="submit"
          class="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('admin')
const password = ref('password')
const showPassword = ref(false)

const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password')
const togglePasswordVisibility = () => showPassword.value = !showPassword.value

const handleLogin = () => {
  if (username.value && password.value) {
    localStorage.setItem('user-authenticated', 'true');
    router.push({ name: 'Dashboard' })
  }
}
</script>